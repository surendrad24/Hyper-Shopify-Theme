# Hyper Shopify Theme

This repo is configured for a 2-step deploy flow:

1. Push to `staging` -> auto deploys to Shopify staging theme.
2. Merge/push to `main` -> auto deploys to Shopify live theme.

Store: `cedar-hospitality-commercial.myshopify.com`

## Required GitHub Actions secrets

- `SHOPIFY_FLAG_STORE` = `cedar-hospitality-commercial.myshopify.com`
- `SHOPIFY_CLI_THEME_TOKEN` = Theme Access password
- `SHOPIFY_FLAG_STAGING_THEME_ID` = staging theme ID
- `SHOPIFY_FLAG_THEME_ID` = live theme ID (`133753045077`)

## Pull current live theme into this repo

```bash
shopify theme pull \
  --store cedar-hospitality-commercial.myshopify.com \
  --live \
  --path .
```

## Daily workflow (VS Code -> Staging -> Live)

1. Edit theme files in VS Code.
2. Commit and push to `staging`.
3. GitHub Actions deploys to staging theme.
4. Open PR `staging` -> `main`.
5. Merge PR.
6. GitHub Actions deploys `main` to live theme.

## Recommended safeguards

- Protect `main` branch and require PR approval.
- Optionally set required status checks for staging deploy before merge.
