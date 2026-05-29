# PanAI Product Roadmap

PanAI is an independent desktop AI agent workbench. It focuses on local files, office documents, multiple agents, model choice, remote access, and repeatable automation in one app.

This roadmap keeps upstream Apache-2.0 compatibility as an engineering constraint, but PanAI's product identity, release path, default assets, docs, icons, and repository ownership are independent.

## Product Direction

- Desktop app on macOS, Windows, and Linux.
- Built-in Pan CLI runtime and local agent auto-detection.
- Multi-agent conversations and team workflows.
- Skills, assistants, MCP tools, and extension workflows.
- Office/document workflows for PPT, Word, Excel, PDF, images, and file organization.
- Remote WebUI and remote channels.
- Scheduled tasks and unattended execution.
- Model/provider configuration and OpenAI-compatible API usage.
- Centralized provider routing for text, image, embedding, rerank, vision, and tool-capable models.

## M1: Full Product Rebrand

- Replace user-visible legacy product naming with PanAI.
- Replace user-visible legacy CLI naming with Pan CLI.
- Keep protocol and migration identifiers only where required for runtime compatibility.
- Maintain independent package metadata, release channels, icons, docs, and issue templates.
- Avoid mixing ArchIToken repository identity into PanAI.
- Remove legacy theme, wallpaper, screenshot, and README media defaults from PanAI.

## M2: Model Provider Upgrade

- Add Hugging Face model integration as a first-class provider path.
- Keep OpenAI-compatible providers behind internal provider adapters.
- Support local inference stacks such as Ollama, vLLM, LM Studio, and llama.cpp where practical.
- Add Chinese ecosystem providers where useful, including Baidu image generation as the default image model option.
- Keep provider routing centralized and testable.

## M3: Pan CLI And Agent Runtime

- Make Pan CLI the branded built-in agent entry.
- Add a clear agent registry for built-in agents, detected agents, and custom agents.
- Improve task traceability: plan, tool calls, files touched, approvals, and final artifacts.
- Add stronger failed-task recovery and retry controls.
- Keep multi-agent orchestration transparent to the user.

## M4: Chinese And International Product Experience

- Provide complete Simplified Chinese docs and UI coverage.
- Keep English docs usable for international users.
- Improve WeChat, Feishu/Lark, DingTalk, Telegram, and WebUI remote workflows.
- Optimize default model/provider choices for Chinese users without removing global provider support.

## M5: Office, File, And Workflow Depth

- Turn office assistants into repeatable workflows, not one-shot prompts.
- Add templates, artifacts, validation, and revision loops for PPT, Word, Excel, PDF, and image tasks.
- Improve file operations with previews, batch actions, rollback, and audit trails.
- Track generated outputs as artifacts with provenance.

## M6: Security, Privacy, And Enterprise Controls

- Make local-first behavior explicit.
- Add provider credential isolation and safer config export/import.
- Add audit logs for file writes, shell commands, remote access, and model calls.
- Add policy controls for allowed tools, folders, and providers.
- Avoid sending local files to remote models unless the user explicitly approves.

## Quality Gates

- Branding smoke tests pass.
- Installers launch correctly on target platforms.
- Built-in Pan CLI works without extra user installation.
- At least one PanAI-only provider or workflow works end to end.
- User-facing docs explain PanAI independently from ArchIToken.
- License and attribution files preserve upstream Apache-2.0 obligations.

## Non-Goals

- PanAI is not ArchIToken.
- PanAI should not diverge through random rewrites.
- PanAI should not claim superiority without tests, demos, or measurable improvements.
- PanAI should not remove runtime compatibility unless there is a clear replacement.
