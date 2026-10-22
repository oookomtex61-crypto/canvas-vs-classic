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

- Keep the existing static STK experience under public/stk and its TanStack HTML entry, preserving the original design.
- MAX delivery is server-only, targets the verified specialist, and requires a signed visitor session plus separate lead consent; this keeps credentials private and prevents cookie consent from authorizing lead transmission.
- Validate AI lead output and use private durable delivery receipts before sending; only a MAX message ID authorizes success wording, and uncertain sends must not be retried automatically because MAX has no idempotency key.
