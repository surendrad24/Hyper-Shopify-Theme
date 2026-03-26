# Hyper Shopify Theme

Custom Shopify theme for `cedar-hospitality-commercial.myshopify.com` with a staged deployment flow and many Cedar-specific content modules.

## Deployment Flow

1. Push to `staging` branch.
2. GitHub Actions runs `.github/workflows/shopify-staging-deploy.yml` and deploys to staging theme (`SHOPIFY_FLAG_STAGING_THEME_ID`).
3. Open PR from `staging` to `main`.
4. Merge to `main`.
5. GitHub Actions runs `.github/workflows/shopify-live-deploy.yml` and deploys to live theme (`SHOPIFY_FLAG_THEME_ID`) with `--allow-live`.

## Required GitHub Secrets

- `SHOPIFY_FLAG_STORE` = `cedar-hospitality-commercial.myshopify.com`
- `SHOPIFY_CLI_THEME_TOKEN` = Theme Access password
- `SHOPIFY_FLAG_STAGING_THEME_ID` = staging theme id
- `SHOPIFY_FLAG_THEME_ID` = live theme id (`133753045077`)

## Codebase Snapshot

- `sections`: 114 liquid sections
- `snippets`: 148 reusable liquid snippets
- `assets`: 65 JS files, 81 CSS files
- `templates`: 71 templates (39 dedicated `page.*` templates)

## Step-By-Step Feature Walkthrough

1. Theme foundation and rendering pipeline
- `layout/theme.liquid` is the root layout.
- Loads base assets (`vendor.css`, `theme.css`, `vendor.js`, `theme.js`) and optional feature assets (compare/wishlist/rtl/quick-view).
- Injects custom tracking code via metafields: `shop.metafields.foxtheme.code_head.value` and `shop.metafields.foxtheme.code_body.value`.
- Renders grouped sections: `sections/header-group.json`, `sections/footer-group.json`, `sections/overlay-group.json`.

2. Header, navigation, wishlist count, GST toggle
- `sections/header.liquid` includes desktop menu, mobile drawer, wishlist icon bubble, cart icon/count, and GST toggle snippet.
- `snippets/desktop-menu.liquid`, `snippets/menu-drawer.liquid`, `snippets/menu-drawer-details.liquid`, `snippets/mega-menu.liquid` implement navigation variants.
- `assets/header.js` drives sticky header logic, dropdown/mega interactions, drawer behavior, and menu sidebar controls.
- `snippets/gst-toggle.liquid` + `assets/gst-toggle.js` provide excl/incl GST display toggle.

3. Product discovery and listing behavior
- Collection/search filtering, sorting, and layout switching: `sections/main-collection-product-grid.liquid` + `assets/facets.js`.
- Predictive search: `assets/search.js` + `snippets/predictive-search.liquid`.
- Collection cards/tabs/sliders: `sections/collection-cards.liquid`, `sections/collection-tabs.liquid`, `sections/collection-list-slider.liquid`, `assets/collection-cards.js`, `assets/collection-tabs.js`, `assets/collection-item-slider.js`.
- Brand discovery pages:
- `sections/shop-by-brand.liquid` implements A-Z and 0-9 brand directory navigation.
- `sections/shop-by-brand-section.liquid` implements a custom brand carousel with progress and controls.

4. Product page, quick view, compare, bundles
- Core PDP: `sections/main-product.liquid` + `assets/product-info.js` + `assets/variant-selects.js`.
- Quick view modal: `sections/quick-view.liquid` + `assets/quick-view.js`.
- Product compare feature (localStorage-backed): `sections/product-compare.liquid`, `sections/product-compare-bar-item.liquid`, `assets/compare.js`.
- Bundle modules: `sections/products-bundle.liquid`, `sections/products-bundle-selection.liquid`, `sections/multiple-product-bundles.liquid`, `assets/products-bundle.js`, `assets/products-bundle-selection.js`, `assets/multiple-product-bundles.js`.
- Related/recommended products: `sections/related-products.liquid`, `assets/product-recommendations.js`.

5. Cart, drawer, shipping, and wishlist page
- Cart page and drawer: `sections/main-cart.liquid`, `sections/cart-drawer.liquid`, `assets/cart.js`.
- Includes shipping calculator and cart utilities in `assets/cart.js`.
- Custom wishlist page: `sections/wishlist-template.liquid`.
- Uses localStorage `wishlist` handles.
- Fetches product + variant data through Storefront API (`/api/2023-10/graphql.json`).
- Supports per-item add-to-cart and add-all-to-cart flow.
- Header wishlist badge logic: `assets/wishlist.js`.

6. Content/marketing modules (custom-coded Cedar sections)
- `sections/Bss-QO-univeral-page.liquid`: BSS quick-order integration via `/apps/customer-portal/...` endpoints.
- `sections/catalogues.liquid`: catalog card grid with image, title, CTA + download action.
- `sections/cedar-highlights-section.liquid`: configurable highlights grid with design controls.
- `sections/feature-steps.liquid`: icon-based steps/features strip.
- `sections/fianance.liquid`: custom hover card section for finance content.
- `sections/hot-deals.liquid`: promotional deals module.
- `sections/industry-category-section.liquid`: custom industry/category presentation.
- `sections/job-listing.liquid`: careers listing section.
- `sections/most-popular-category.liquid`: tabbed + horizontal carousel category cards.
- `sections/projects-tabs.liquid`: dynamic project grid with category tab filtering and optional “view all” tab.
- `sections/our-clients-carousel.liquid`: marquee-style client/logo carousel.
- `sections/our-story-image-section.liquid`: full-bleed image grid storytelling section.

7. Page templates and business content
- 39 dedicated page templates under `templates/page.*.json` (about, contact, FAQ, projects, finance pages, policy pages, brand pages, wishlist page, etc.).
- Multiple product template variants: `templates/product.*.json` (coming soon, flash sale, grid variants, out-of-stock variants).
- Collection variants: `templates/collection.*.json`.
- BSS search feeds for external logic:
- `templates/search.bss.b2b.liquid`
- `templates/search.bss.bcp.liquid`

8. Metafields and data model touchpoints
- Theme uses `foxtheme` metafields in multiple places (collection banners/images, megamenu images, product showcase fields, flash-sale text, size chart, tracking injections).
- Metafield definitions snapshot exists at `.shopify/metafields.json`.

9. JavaScript component model
- The theme heavily uses Custom Elements (`customElements.define(...)`) for modular UI behavior.
- Key component domains:
- Navigation/header (`assets/header.js`)
- Cart/drawer (`assets/cart.js`)
- Filters (`assets/facets.js`)
- Product/PDP (`assets/product-info.js`, `assets/variant-selects.js`)
- Compare/wishlist (`assets/compare.js`, `assets/wishlist.js`)
- Bundles (`assets/products-bundle*.js`)

10. Current technical notes (important for future cleanup)
- `sections/projects-tabs.liquid` contains duplicated implementation blocks; refactor is recommended.
- `assets/gst-toggle.js` contains multiple old commented implementations plus active version; file can be simplified.
- `sections/shop-by-brand2.liquid` is largely commented legacy code.
- `assets/wishlist.js` contains commented notification markup and minimal active notification rendering.

## Local Theme Sync Commands

Pull live theme:

```bash
shopify theme pull \
  --store cedar-hospitality-commercial.myshopify.com \
  --live \
  --path .
```

Push current branch manually (if needed):

```bash
shopify theme push \
  --store cedar-hospitality-commercial.myshopify.com \
  --theme <theme_id> \
  --path .
```
