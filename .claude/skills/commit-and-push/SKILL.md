---
name: commit-and-push
description: Stage changes, draft and confirm a commit message, commit, and optionally push. Use when the user asks to "commit this", "commit and push", "make a commit", or similar, in an existing git repo.
---

# Commit and Push

Turn the current working tree changes into a reviewed, confirmed commit, then optionally push it.

## Steps

1. **Look before staging.** Run `git status` and `git diff` (staged + unstaged) to see what's actually changing. Never blindly `git add -A` — if `git status` shows anything that looks like a secret (`.env`, credentials, keys, tokens) or an accidental artifact (`node_modules`, build output, huge binaries) that isn't already covered by `.gitignore`, stop and flag it to the user before proceeding.

2. **Stage the relevant files.** Prefer adding specific files/paths over a blanket `-A` when it's easy to tell what belongs; use `-A` only after the review in step 1 confirms nothing unwanted is present.

3. **Draft a commit message from the actual diff.** Always follow [Conventional Commits](https://www.conventionalcommits.org/) format: `type: description` (e.g. `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`), summarizing the *why* over the *what* in 1-2 sentences. Check `git log --oneline -10` to match the repo's existing scope/tone conventions on top of this format (e.g. whether scopes like `feat(auth):` are used), but the `type:` prefix itself is non-negotiable regardless of prior history.

4. **Confirm the message with the user** via `AskUserQuestion` — offer the drafted message as the recommended option, plus a way to supply their own (the free-text "Other" option covers this). Do not commit on a guessed message without confirmation.

5. **Commit** with the confirmed message, using a heredoc (`git commit -m "$(cat <<'EOF' ... EOF)"`) if the message is multi-line.

6. **Check push state.** Run `git status` (it reports ahead/behind vs. upstream) or `git rev-parse --abbrev-ref --symbolic-full-name @{u}` to see if an upstream is configured.
   - No upstream / no remote: tell the user there's nothing to push to (or ask if they want to set one up — see the `create-git-repo` skill for that flow) and stop.
   - Upstream exists: **always ask the user before pushing** — pushing affects shared/remote state. Don't push automatically even if a remote is configured.

7. **If confirmed, push** (`git push`, or `git push -u origin <branch>` if no upstream is set yet but a remote exists and the user wants one set).

## Guardrails

- Never force-push (`--force`/`--force-with-lease`) unless the user explicitly asks for it in this exact request.
- Never amend an existing commit unless explicitly asked — always create a new commit.
- Never skip hooks (`--no-verify`) unless explicitly asked.
- If a pre-commit hook fails, fix the underlying issue and re-commit as a new commit — don't bypass it.
- Pushing is a visible, hard-to-reverse action for collaborators — confirmation in step 6 is not optional.
