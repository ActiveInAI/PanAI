#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    io::{Read, Write},
    net::{SocketAddr, TcpStream},
    path::PathBuf,
    process::{Child, Command, Stdio},
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

use tauri::{AppHandle, Manager, State};

const BACKEND_PORT: u16 = 13400;

#[derive(Clone, Default)]
struct BackendState {
    child: Arc<Mutex<Option<Child>>>,
    port: Arc<Mutex<Option<u16>>>,
}

impl BackendState {
    fn set(&self, child: Child, port: u16) {
        *self.child.lock().expect("backend child lock poisoned") = Some(child);
        *self.port.lock().expect("backend port lock poisoned") = Some(port);
    }
}

impl Drop for BackendState {
    fn drop(&mut self) {
        if let Ok(mut child) = self.child.lock() {
            if let Some(mut process) = child.take() {
                let _ = process.kill();
                let _ = process.wait();
            }
        }
    }
}

#[tauri::command]
fn backend_port(state: State<'_, BackendState>) -> Result<u16, String> {
    state
        .port
        .lock()
        .map_err(|_| "backend port lock poisoned".to_string())?
        .ok_or_else(|| "PanAI backend is not ready".to_string())
}

fn runtime_key() -> &'static str {
    #[cfg(all(target_os = "windows", target_arch = "x86_64"))]
    {
        "win32-x64"
    }
    #[cfg(all(target_os = "windows", target_arch = "aarch64"))]
    {
        "win32-arm64"
    }
    #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
    {
        "darwin-x64"
    }
    #[cfg(all(target_os = "macos", target_arch = "aarch64"))]
    {
        "darwin-arm64"
    }
    #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    {
        "linux-x64"
    }
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    {
        "linux-arm64"
    }
}

fn backend_binary_name() -> &'static str {
    if cfg!(windows) {
        "aioncore.exe"
    } else {
        "aioncore"
    }
}

fn resolve_backend_binary(app: &AppHandle) -> Result<PathBuf, String> {
    let relative = PathBuf::from("bundled-aioncore")
        .join(runtime_key())
        .join(backend_binary_name());
    let mut candidates = Vec::new();

    if let Ok(resource_dir) = app.path().resource_dir() {
        candidates.push(resource_dir.join(&relative));
    }

    candidates.push(
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("..")
            .join("resources")
            .join("bundled-aioncore")
            .join(runtime_key())
            .join(backend_binary_name()),
    );

    candidates
        .into_iter()
        .find(|path| path.is_file())
        .ok_or_else(|| format!("Cannot find bundled backend binary: {}", relative.display()))
}

fn create_runtime_dirs(app: &AppHandle) -> Result<(PathBuf, PathBuf, PathBuf, PathBuf), String> {
    let app_data = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("Cannot resolve app data dir: {error}"))?;
    let cache_dir = app_data.join("cache");
    let data_dir = app_data.join("panai");
    let log_dir = app_data.join("logs");
    let work_dir = app_data.join("workspace");

    for dir in [&cache_dir, &data_dir, &log_dir, &work_dir] {
        fs::create_dir_all(dir)
            .map_err(|error| format!("Cannot create {}: {error}", dir.display()))?;
    }

    Ok((cache_dir, data_dir, log_dir, work_dir))
}

fn backend_health_ok(port: u16) -> bool {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let mut stream = match TcpStream::connect_timeout(&addr, Duration::from_millis(400)) {
        Ok(stream) => stream,
        Err(_) => return false,
    };
    let _ = stream.set_read_timeout(Some(Duration::from_millis(400)));
    let _ = stream.set_write_timeout(Some(Duration::from_millis(400)));

    let request =
        format!("GET /health HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n\r\n");
    if stream.write_all(request.as_bytes()).is_err() {
        return false;
    }

    let mut response = String::new();
    stream.read_to_string(&mut response).is_ok() && response.starts_with("HTTP/1.1 200")
}

fn wait_for_backend(port: u16, timeout: Duration) -> Result<(), String> {
    let start = Instant::now();
    while start.elapsed() < timeout {
        if backend_health_ok(port) {
            return Ok(());
        }
        std::thread::sleep(Duration::from_millis(250));
    }
    Err(format!(
        "PanAI backend did not become healthy on port {port}"
    ))
}

fn start_backend(app: &AppHandle, state: &BackendState) -> Result<(), String> {
    if backend_health_ok(BACKEND_PORT) {
        *state.port.lock().expect("backend port lock poisoned") = Some(BACKEND_PORT);
        return Ok(());
    }

    let binary = resolve_backend_binary(app)?;
    let (cache_dir, data_dir, log_dir, work_dir) = create_runtime_dirs(app)?;
    let app_version = app.package_info().version.to_string();

    let mut command = Command::new(binary);
    command
        .arg("--port")
        .arg(BACKEND_PORT.to_string())
        .arg("--data-dir")
        .arg(&data_dir)
        .arg("--log-level")
        .arg("info")
        .arg("--app-version")
        .arg(app_version)
        .arg("--log-dir")
        .arg(&log_dir)
        .arg("--work-dir")
        .arg(&work_dir)
        .arg("--local")
        .env("PANAI_CACHE_DIR", &cache_dir)
        .env("PANAI_WORK_DIR", &work_dir)
        .env("PANAI_LOG_DIR", &log_dir)
        .stdin(Stdio::null());

    match fs::File::create(log_dir.join("aioncore.stdout.log")) {
        Ok(stdout) => {
            command.stdout(Stdio::from(stdout));
        }
        Err(_) => {
            command.stdout(Stdio::null());
        }
    }

    match fs::File::create(log_dir.join("aioncore.stderr.log")) {
        Ok(stderr) => {
            command.stderr(Stdio::from(stderr));
        }
        Err(_) => {
            command.stderr(Stdio::null());
        }
    }

    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }

    let mut child = command
        .spawn()
        .map_err(|error| format!("Failed to start PanAI backend: {error}"))?;
    if let Err(error) = wait_for_backend(BACKEND_PORT, Duration::from_secs(30)) {
        let _ = child.kill();
        let _ = child.wait();
        return Err(error);
    }
    state.set(child, BACKEND_PORT);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(BackendState::default())
        .invoke_handler(tauri::generate_handler![backend_port])
        .setup(move |app| {
            let state = app.state::<BackendState>();
            start_backend(app.handle(), &state).map_err(|error| {
                eprintln!("{error}");
                Box::<dyn std::error::Error>::from(error)
            })?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running PanAI Tauri app");
}
