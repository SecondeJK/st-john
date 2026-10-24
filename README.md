# St John the Baptist, Halesowen

Prototype website for St John the Baptist Church, Halesowen, built with [Hugo](https://gohugo.io/).
The brief is in [docs/website-spec.md](docs/website-spec.md).

- **Content (pages, blog, staff, churches, home page, settings):** [Sanity](https://www.sanity.io/), a hosted CMS. Every page is generated from CMS data by `content/_content.gotmpl`; there are no Markdown content files.
- **Events:** a public Google Calendar, read at build time.
- **Hosting:** Netlify (`netlify.toml`), with a nightly rebuild (`.github/workflows/rebuild.yml`) so events stay current.

## Running locally

Requires Hugo extended 0.134+.

```sh
make dev        # http://localhost:1313
```

Local development uses **temporary test data only**: `data/fixtures/site.yaml` (pages, posts, staff, churches) and `data/fixtures/events.yaml` (events dated relative to today). A striped banner at the top of the page shows which environment and data sources are in use.

## Environments

| Environment   | Command             | Content            | Events            | Notes                         |
|---------------|---------------------|--------------------|-------------------|-------------------------------|
| `development` | `make dev`          | fixtures           | fixtures          | env banner shown              |
| `staging`     | `make staging`      | Sanity             | Google Calendar   | `noindex`, env banner shown   |
| `production`  | `make build`        | Sanity             | Google Calendar   | minified, fingerprinted       |

`scripts/hugo.sh <env> [hugo args]` does the work:

1. Loads `.env.<env>` then `.env`. Variables already set (by your shell, CI or Netlify) always win.
2. For staging and production, stops the build if any required variable is missing.
3. Runs Hugo with `--environment <env>`, which layers `config/<env>/` over `config/_default/`.

Copy `.env.example` to `.env.development` / `.env.staging` / `.env.production`. These files are git-ignored.

| Variable                 | Used for                                                          |
|--------------------------|-------------------------------------------------------------------|
| `HUGO_BASEURL`           | Public URL / domain of the site                                   |
| `HUGO_SANITY_PROJECT_ID` | Sanity project                                                    |
| `HUGO_SANITY_DATASET`    | Sanity dataset (usually `production`)                             |
| `HUGO_SANITY_TOKEN`      | Optional read token, only if the dataset is private               |
| `HUGO_GCAL_ID`           | Public Google Calendar ID                                         |
| `HUGO_GCAL_API_KEY`      | Google API key, restricted to the Calendar API                    |

Any Hugo param can be overridden from the environment, e.g. `HUGO_PARAMS_CMS_SOURCE=sanity` in `.env.development` to preview live CMS content locally.

## CMS (Sanity Studio)

The editing app is in `studio/`.

```sh
cd studio
cp .env.example .env     # add your Sanity project ID
npm install
npm run dev              # http://localhost:3333
npm run deploy           # host the Studio at <name>.sanity.studio
```

Document types: Site settings and Home page (one each), Pages, Blog posts (tags, image/video/YouTube attachments), Tags, Staff and leadership, Our churches.
Page and post bodies are Markdown. A page's **layout** picks a template: about, staff, contact, churches, church, events, or standard.

The site is static, so add a Sanity webhook that calls a Netlify build hook on publish.

## Deploying to Netlify

1. Create the site from this repository. `netlify.toml` sets the build command and Hugo version.
2. Add the environment variables above under *Site configuration → Environment variables*. Use different values for the Production and Deploy Preview contexts if you like.
3. Deploy previews and branch deploys build as `staging` (noindex) using their own preview URL.
4. Create a build hook. Add it to Sanity as a webhook, and as the `NETLIFY_BUILD_HOOK` GitHub secret for the nightly calendar refresh.
5. The contact form uses Netlify Forms; submissions appear in the Netlify dashboard.

## Project layout

```
assets/        CSS, JS and images (processed by Hugo: resized, WebP, fingerprinted)
config/        _default config plus development / staging / production overrides
content/       _content.gotmpl: builds every page from CMS data
data/fixtures/ local test data (development only)
layouts/       templates; partials/cms/data.html and partials/events/data.html fetch content
scripts/       hugo.sh environment loader
studio/        Sanity Studio schemas and config
```

## Before launch

- Replace placeholder staff names, phone number, email and address in the CMS.
- Confirm the A Church Near You links for St Peter's Cradley, St Peter's Lapal, St Margaret's Hasbury and St Kenelm's Romsley.
- Review the draft mission statement and the placeholder pages (Safeguarding, Flower Ladies' Guild, Guiding Lights, Traidpoint opening times).
- The About Us history is adapted from Wikipedia (CC BY-SA 4.0). Keep the attribution line, and check facts with the parish.
