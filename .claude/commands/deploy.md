Deploy the current changes to production and wait for CI/CD to complete.

Steps:
1. Run `git -C /home/coder/src/Website status --short` to check for uncommitted changes. If there are any, stage and commit them with an appropriate message before proceeding.
2. Run `git -C /home/coder/src/Website push origin main` to push to GitHub (triggers the CI/CD pipeline).
3. Tell the user deployment typically takes ~2 minutes, then wait 10 seconds for GitHub Actions to register the run. Get the run ID with:
   `gh run list --repo WTP-Advisory/Website --branch main --limit 1 --json databaseId,status,name --jq '.[0]'`
4. Watch the run until it completes:
   `gh run watch <run_id> --repo WTP-Advisory/Website --exit-status`
   This command blocks until the workflow finishes and exits with a non-zero code on failure.
5. After it finishes, fetch the final result:
   `gh run view <run_id> --repo WTP-Advisory/Website --json conclusion,status,jobs`
6. Report the result clearly:
   - On success: confirm the site is live on production (Vercel).
   - On failure: show which job failed and the relevant error from `gh run view <run_id> --repo WTP-Advisory/Website --log-failed`.
