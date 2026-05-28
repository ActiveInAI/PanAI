# PanAI: AionUI Parity And Beyond

PanAI is an independent project derived from AionUI under Apache-2.0. The goal is not a cosmetic rename. The goal is to keep AionUI compatibility as the baseline, then build a stronger PanAI product direction on top.

## Positioning

PanAI is a desktop AI agent workbench for users who need local files, office documents, multiple agents, model choice, remote access, and repeatable automation in one app.

AionUI remains the upstream compatibility baseline. PanAI must stay close enough to upstream that security fixes, runtime fixes, and agent ecosystem improvements can be merged without large rewrites.

## Baseline: Match AionUI

PanAI must preserve these AionUI capabilities before claiming superiority:

- Desktop app on macOS, Windows, and Linux.
- Built-in agent runtime and local agent auto-detection.
- Multi-agent conversations and team workflows.
- Skills, assistants, MCP tools, and extension workflows.
- Office/document workflows for PPT, Word, Excel, PDF, images, and file organization.
- Remote WebUI and remote channels.
- Scheduled tasks and unattended execution.
- Model/provider configuration and OpenAI-compatible API usage.
- Existing test, build, package, and release workflows.

## Differentiation: Surpass AionUI

PanAI should exceed AionUI in the following areas.

### 1. PanAI Identity And Runtime Independence

- Replace user-visible AionUI naming with PanAI.
- Replace user-visible Aion CLI naming with Pan CLI.
- Keep upstream internal names only where required for compatibility.
- Maintain independent package metadata, release channels, icons, docs, and issue templates.
- Avoid mixing ArchIToken repository identity into PanAI.

### 2. Model Hub And Provider Breadth

- Add Hugging Face model integration as a first-class provider path.
- Keep OpenAI-compatible providers behind internal provider adapters.
- Support local inference stacks such as Ollama, vLLM, LM Studio, and llama.cpp where practical.
- Add Chinese ecosystem providers where useful, including Baidu image generation as a default image model option.
- Separate text, image, embedding, rerank, vision, and tool-capable model routing.

### 3. PanCLI And Agent Runtime

- Make Pan CLI the branded built-in agent entry.
- Add a clear agent registry for built-in agents, detected agents, and custom agents.
- Improve task traceability: plan, tool calls, files touched, approvals, and final artifacts.
- Add stronger failed-task recovery and retry controls.
- Keep multi-agent orchestration transparent to the user.

### 4. Chinese And International Product Experience

- Provide complete Simplified Chinese docs and UI coverage.
- Keep English docs usable for upstream and international users.
- Improve WeChat, Feishu/Lark, DingTalk, Telegram, and WebUI remote workflows.
- Optimize default model/provider choices for Chinese users without removing global provider support.

### 5. Office, File, And Workflow Depth

- Turn office assistants into repeatable workflows, not one-shot prompts.
- Add templates, artifacts, validation, and revision loops for PPT, Word, Excel, PDF, and image tasks.
- Improve file operations with previews, batch actions, rollback, and audit trails.
- Track generated outputs as artifacts with provenance.

### 6. Security, Privacy, And Enterprise Controls

- Make local-first behavior explicit.
- Add provider credential isolation and safer config export/import.
- Add audit logs for file writes, shell commands, remote access, and model calls.
- Add policy controls for allowed tools, folders, and providers.
- Avoid sending local files to remote models unless the user explicitly approves.

### 7. Engineering Quality And Release Discipline

- Keep a small, reviewable delta from upstream AionUI.
- Maintain an upstream sync routine.
- Add smoke tests for branding, Pan CLI naming, model provider defaults, and assistant startup.
- Add release checklist for Linux, Windows, and macOS packages.
- Measure startup time, memory use, task completion rate, and provider failures.

## Execution Milestones

### M0: Repository Independence

Status: done.

- PanAI lives in `/home/insome/dev/panai`.
- ArchIToken no longer has a PanAI remote.
- GitHub `ActiveInAI/PanAI` tracks AionUI history plus PanAI changes.

### M1: Full Product Rebrand

- Replace visible AionUI text with PanAI.
- Replace visible Aion CLI text with Pan CLI.
- Replace default app icon and package metadata.
- Remove AionUI-only theme/wallpaper defaults from PanAI.
- Keep compatibility names only where required by upstream runtime.

### M2: Model Provider Upgrade

- Remove stale default Qwen GGUF entries from PanAI defaults.
- Add Hugging Face provider configuration.
- Set Baidu image generation as the default image model where configured.
- Keep provider routing centralized and testable.

### M3: Installable PanAI Builds

- Build signed or unsigned test packages for Linux first.
- Verify startup, settings, model configuration, built-in Pan CLI, assistants, and WebUI.
- Publish GitHub releases from `ActiveInAI/PanAI`, not from ArchIToken.

### M4: Beyond AionUI Feature Track

- Add PanAI task traces and artifact tracking.
- Add stronger workflow templates for office and file operations.
- Add provider policy controls.
- Add Chinese-first setup defaults and docs.

## Measurement

PanAI can claim it surpasses AionUI only when measured against concrete checks:

- Feature parity checklist passes.
- Branding smoke tests pass.
- Installers launch correctly on target platforms.
- Built-in Pan CLI works without extra user installation.
- At least one PanAI-only provider or workflow works end to end.
- User-facing docs explain PanAI independently from AionUI and ArchIToken.

## Non-Goals

- PanAI is not ArchIToken.
- PanAI should not diverge from AionUI through random rewrites.
- PanAI should not claim superiority without tests, demos, or measurable improvements.
- PanAI should not remove upstream compatibility unless there is a clear replacement.
