<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- MCP server requires OAuth sign-in (backend auth as authorization server; consent at /.lovable/oauth/consent, sign-in at /login) — prevents anonymous access to app tools.
- Slack alerts are sent server-side from hub.server.ts via slack.server.ts, deduped by unique event_key in slack_notifications; awaited (not fire-and-forget) because Workers drop floating promises.
