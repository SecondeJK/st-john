# Deploy a test site (fixture data)

How to put a test copy of the site on Netlify using the **local test data**, with no Sanity or
Google Calendar accounts needed. Use it to show the site to the PCC, staff or volunteers before
going live. For the real launch, follow [go-live-steps.md](go-live-steps.md) instead.

What the test site shows:

- **Real site content** from `data/site.yaml`: every page, staff, churches, service times
- **Test blog posts** from `data/fixtures/posts.yaml`
- **Test events** from `data/fixtures/events.yaml`, dated from the day you build. They go stale,
  so rebuild and redeploy to refresh them.
- A striped **"Development build"** banner on every page, so nobody mistakes it for the live site
- **Hidden from search engines**: every page is marked `noindex`

## Why this is a manual deploy

`netlify.toml` builds the **production** site, which needs real Sanity and Google Calendar
credentials and stops if they're missing. Netlify's `netlify.toml` settings override anything set
in its dashboard, so a site connected to the GitHub repository can't build with test data.

Instead, you build the test site on your own computer and upload the finished files with the
Netlify command-line tool. Netlify doesn't run any build for this, so the production checks don't
apply.

---

## One-off setup

### 1. Install and log in to the Netlify CLI

Requires Node.js.

```sh
npm install -g netlify-cli
netlify login          # opens the browser to authorise
```

### 2. Create the test site

From the project root:

```sh
netlify sites:create --name st-john-test
```

- Pick your Netlify team when asked.
- If `st-john-test` is taken, choose another name. The site's address will be
  `https://<name>.netlify.app/`.
- This links the project folder to the new site (stored in a `.netlify/` folder, which the CLI adds
  to `.gitignore`). If it says the folder isn't linked, run `netlify link --name <name>`.

Keep this separate from the production site you'll create during go-live.

### 3. Turn on the contact form

In the Netlify dashboard, open the test site → **Forms** → **Enable form detection**. New sites
have it off, and without it the contact form returns an error.

Submissions appear under **Forms** in the dashboard. Don't turn on email notifications for the test
site unless you want test messages in the parish inbox.

---

## Deploy (each time)

Run these from the project root. Use your site's name if it isn't `st-john-test`.

### 1. Build with test data

```sh
HUGO_BASEURL=https://st-john-test.netlify.app/ \
HUGO_PARAMS_NOINDEX=true \
scripts/hugo.sh development --gc --minify --cleanDestinationDir
```

- `development` uses the test blog posts and events, and shows the banner.
- `HUGO_BASEURL` makes links, the sitemap and canonical tags point at the test site rather than
  `localhost`.
- `HUGO_PARAMS_NOINDEX=true` tells search engines not to index the pages.
- `--cleanDestinationDir` empties `public/` first, so no files from earlier builds get uploaded.

It should finish with a line like `Total in 180 ms` and no `ERROR` lines.

### 2. Upload a preview (optional)

```sh
netlify deploy --dir=public
```

This gives you a one-off preview address to check before replacing what's on the test site.

### 3. Publish to the test site

```sh
netlify deploy --dir=public --prod
```

"Production" here just means the main address of the **test** site,
`https://st-john-test.netlify.app/`. It doesn't touch the real site.

> If the CLI starts running the build command from `netlify.toml` and fails with
> *"Missing required variables"*, add `--no-build` to the deploy command. The site is already built
> in `public/`.

---

## Check it

- [ ] The test site opens, with the striped *"Development build · blog: fixtures · events: fixtures"*
      banner at the top.
- [ ] The menu and the *Our Churches* dropdown work, on a phone as well as a computer.
- [ ] The Staff and Leadership page shows the five headshots.
- [ ] What's On shows upcoming test events in the calendar.
- [ ] The Blog page shows the test posts, and the tag filters work.
- [ ] Sending the contact form shows a success page, and the message appears under **Forms** in Netlify.

## Updating the test site

Make your changes, check them locally with `make dev`, then repeat the two deploy commands:
build, then `netlify deploy --dir=public --prod`.

Rebuild at least every few weeks if people are using the test site, or the test events run out.

## Taking it down

Netlify dashboard → test site → **Site configuration → General → Danger zone → Delete this site**.
Then delete the `.netlify/` folder in the project, so the CLI no longer points at it.

## Limitations

- **Manual only:** pushing to GitHub doesn't update the test site. Automatic test deploys would
  need a small change to `netlify.toml`.
- **Not password-protected:** anyone with the link can view it. It is hidden from search engines,
  but don't share the link publicly. (Netlify's password protection needs a paid plan.)
- **Test content:** the blog posts and events are made up. The phone number and email in
  `data/site.yaml` are placeholders until they're updated (go-live phase 1).
