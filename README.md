# Hyper Shopify Theme

This repo is configured so pushes to `main` auto-deploy to the live theme on:
`cedar-hospitality-commercial.myshopify.com`.

## One-time setup

1. In Shopify Admin, create a custom app with theme permissions (`read_themes`, `write_themes`).
2. Install the app and copy its Admin API access token.
3. In GitHub repo settings, add these Actions secrets:
   - `SHOPIFY_CLI_THEME_TOKEN` = custom app Admin API token
   - `SHOPIFY_FLAG_THEME_ID` = current live theme ID
   - `SHOPIFY_FLAG_STORE` = store domain (used by staging workflow)
   - `SHOPIFY_FLAG_STAGING_THEME_ID` = staging theme ID (optional/manual workflow)

## Pull current live theme into this repo

```bash
shopify theme pull \
  --store cedar-hospitality-commercial.myshopify.com \
  --live \
  --path .
```

Then commit and push.

## Daily workflow (VS Code + GitHub)

1. Edit theme files in VS Code.
2. Commit and push to `main`.
3. GitHub Actions runs `.github/workflows/shopify-live-deploy.yml`.
4. Shopify live theme updates automatically.

## Important

Direct deploys to live are enabled (`--allow-live`). Use branch protection on `main` if you want safer approvals.
