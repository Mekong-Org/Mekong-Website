---
name: create-git-repo
description: Initialize a new git repository in the current project and optionally create a matching GitHub remote. Use when the user asks to "create a git repo", "set up git", "init a repository", "push this to GitHub" for a project that isn't already a repo, or similar.
---

# Create Git Repository

Set up a new local git repository with sensible defaults, then optionally create and push to a matching GitHub remote.

## Steps

1. **Check current state first.** Run `git status` (or check for a `.git` folder). If a repo already exists here, stop and tell the user — do not re-init over existing history. If the working directory has existing uncommitted files, that's fine (they'll go into the initial commit), but flag anything that looks like a mistake (e.g. huge binaries, existing `node_modules`).

2. **`git init -b main`** in the project root — always name the default branch `main`, never `master`. If the installed git version doesn't support `-b` (older than 2.28), run `git init` then `git checkout -b main` (or `git branch -m main` if a default branch was already created) before the first commit.

3. **Generate a `.gitignore` if one doesn't already exist.** Detect the project type from files present (e.g. `package.json` → Node, `pyproject.toml`/`requirements.txt` → Python, `go.mod` → Go, `Cargo.toml` → Rust) and write an appropriate `.gitignore` (node_modules, build output, `.env`, OS cruft like `.DS_Store`, editor folders, etc.). If a `.gitignore` already exists, leave it alone.

4. **Generate a minimal `README.md` if one doesn't already exist.** Just a title (project/folder name) and a one-line placeholder description — don't invent features or architecture the user hasn't described.

5. **Stage and make the initial commit.**
   - Review `git status` before staging — never blindly `git add -A` if there are files that look like secrets (`.env`, credentials, keys). Confirm with the user if anything looks off.
   - Commit message: follow [Conventional Commits](https://www.conventionalcommits.org/) — `chore: initial commit`.

6. **Ask whether to create a GitHub remote**, unless the user already said so in their request. Before asking about owner, run `gh api user --jq .login` and `gh org list` to find out what's actually available — never assume the personal account is what the user wants. Use `AskUserQuestion` covering:
   - Visibility: public or private (no default — always ask, per user preference).
   - Owner: if `gh org list` returns any orgs, always ask which owner to use (personal account or one of the orgs) — list the real options found, don't silently default to the personal account. Only skip this question if `gh org list` returns nothing.
   - Repo name: always ask explicitly — never assume the current folder name without confirming. Offer the folder name as the suggested/default option, but let the user confirm or override it.

7. **If yes, create the remote with `gh repo create`:**
   ```
   gh repo create <owner>/<name> --private|--public --source=. --remote=origin
   ```
   Then push:
   ```
   git push -u origin main
   ```
   - If `gh` is not installed or not authenticated (`gh auth status` fails), tell the user and stop — don't attempt raw `git remote add` against a repo that doesn't exist yet.

8. **If no** (local only), stop after the initial commit — don't create a remote or push anywhere.

## Guardrails

- Never force-push, never overwrite an existing remote, never delete an existing `.git` directory.
- Default branch is always `main`; commit messages always follow Conventional Commits (`type: description`, e.g. `feat:`, `fix:`, `chore:`, `docs:`).
- Creating a GitHub repo and pushing code is visible/external — always get an explicit go-ahead for visibility (public vs. private) before running `gh repo create`. Never default to public silently.
- Don't invent a repo description or topics the user hasn't provided.
