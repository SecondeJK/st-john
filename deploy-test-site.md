# Deploy a test site (fixture data)

How to put a test copy of the site on Netlify using the **local test data**, with no Sanity or
Google Calendar accounts needed. Use it to show the site to the PCC, staff or volunteers before
going live. For the real launch, follow [go-live-steps.md](go-live-steps.md) instead.

What the test site shows:

- **Real site content** from `data/site.yaml`: every page, staff, churches, service times
- **Test blog posts** from `data/fixtures/posts.yaml`
- **Test events** from `data/fixtures/events.yaml`, dated from the day of each build
- A striped **"Development build"** banner on every page, so nobody mistakes it for the live site
- **Hidden from search engines**: every page is marked `noindex`

## How it works

`netlify.toml` builds the production site, which normally needs real Sanity and Google Calendar
credentials and stops if they're missing:

```
Missing required variables for production: HUGO_BASEURL HUGO_SANITY_PROJECT_ID ...
```

Setting the environment variable **`HUGO_TEST_SITE=true`** on the Netlify site switches the build
to test mode. It builds from the test data, marks pages `noindex`, and uses the Netlify site's own
address. Nothing else is needed.

There are two ways to deploy. **Option A** is recommended: it updates itself on every push to GitHub.

---

## Option A: Netlify connected to GitHub (recommended)

### 1. Create the site

1. At <https://app.netlify.com>, **Add new site → Import an existing project → GitHub**, and choose
   `SecondeJK/st-john`.
2. Leave the build settings as they are (they come from `netlify.toml`).
3. Before deploying, open **Add environment variables** (on the same screen) and add:

   | Key | Value |
   |---|---|
   | `HUGO_TEST_SITE` | `true` |

   Don't add any Sanity or Google variables.
4. Click **Deploy**.

**If you've already created the site** and got the *"Missing required variables"* error:
**Site configuration → Environment variables → Add a variable** → `HUGO_TEST_SITE` = `true`
(all scopes and contexts). Then **Deploys → Trigger deploy → Deploy site**.

### 2. Give it a clear name

**Site configuration → General → Site details → Change site name**, e.g. `st-john-test`. The
address becomes `https://st-john-test.netlify.app/`. Then **Trigger deploy** again, so links and
the sitemap use the new address.

### 3. Turn on the contact form

**Forms → Enable form detection**, then **Trigger deploy** once more. New sites have form detection
off, and without it the contact form returns an error.

Submissions appear under **Forms** in the dashboard. Don't turn on email notifications for the test
site unless you want test messages in the parish inbox.

**Check:** the deploy log contains
`HUGO_TEST_SITE=true: building a test site from fixtures (requested: production)` and ends
successfully.

### Updating it

Every push to `main` redeploys the test site automatically. Branches and pull requests get their own
preview addresses, also built from test data.

---

## Option B: Upload from your computer (Netlify CLI)

Use this if you don't want Netlify connected to GitHub.

### One-off setup

```sh
npm install -g netlify-cli
netlify login                          # opens the browser to authorise
netlify sites:create --name st-john-test
```

- Pick your Netlify team when asked. If the name is taken, choose another.
- This links the project folder to the site (stored in `.netlify/`, which the CLI adds to
  `.gitignore`). If it says the folder isn't linked, run `netlify link --name st-john-test`.
- In the Netlify dashboard: **Forms → Enable form detection**.
- Also add `HUGO_TEST_SITE` = `true` under **Site configuration → Environment variables**. Some CLI
  versions run the build from `netlify.toml` before uploading, and this makes that build succeed too.

### Each deploy

From the project root:

```sh
HUGO_TEST_SITE=true HUGO_BASEURL=https://st-john-test.netlify.app/ \
  scripts/hugo.sh production --gc --minify --cleanDestinationDir

netlify deploy --dir=public --prod --no-build
```

- The first command builds the test site into `public/` (`--cleanDestinationDir` removes files from
  earlier builds).
- The second uploads it. "Production" means the main address of the **test** site; it doesn't touch
  the real one. Leave out `--prod` to get a one-off preview address first.
- If your CLI version doesn't recognise `--no-build`, leave it out.

---

## Check it

- [ ] The test site opens, with the striped *"Development build · blog: fixtures · events: fixtures"*
      banner at the top.
- [ ] The menu and the *Our Churches* dropdown work, on a phone as well as a computer.
- [ ] The Staff and Leadership page shows the five headshots.
- [ ] What's On shows upcoming test events in the calendar.
- [ ] The Blog page shows the test posts, and the tag filters work.
- [ ] Sending the contact form shows a success page, and the message appears under **Forms** in Netlify.

## Keeping the test events current

Test events are dated from the day of the build, so they run out after a few weeks. With
**Option A**, any push redeploys; otherwise use **Deploys → Trigger deploy**. With **Option B**,
run the two deploy commands again.

## Turning the test site into the live site (optional)

You can reuse the same Netlify site for launch: delete `HUGO_TEST_SITE`, add the real variables
from [go-live-steps.md](go-live-steps.md) phase 5, and redeploy. Or keep the test site separate and
create a new site for production, which leaves you a place to try changes safely.

## Taking it down

Netlify dashboard → test site → **Site configuration → General → Danger zone → Delete this site**.
If you used Option B, also delete the `.netlify/` folder in the project.

## Limitations

- **Not password-protected:** anyone with the link can view it. It is hidden from search engines,
  but don't share the link publicly. (Netlify's password protection needs a paid plan.)
- **Test content:** the blog posts and events are made up. The phone number and email in
  `data/site.yaml` are placeholders until they're updated (go-live phase 1).
