# Go-live steps

How to take the St John the Baptist site live. Only two parts of the site rely on external
services:

- **Blog posts** come from **Sanity** (a hosted CMS)
- **Events** on the What's On page come from **Google Calendar**

Everything else (site settings, home page, every page, staff and leadership, churches, service
times) is permanent content in `data/site.yaml` in this repository. **Netlify** hosts the site,
handles the contact form, and rebuilds it.

Work through the phases in order. Each one ends with a check, so you know it worked before moving on.

## Accounts you will need

Use parish-owned accounts (for example a shared `office@` mailbox) rather than personal ones, so
access survives changes of volunteers.

| Service | Used for | Plan |
|---|---|---|
| GitHub | The code and site content (`SecondeJK/st-john`), the nightly rebuild | Free |
| Netlify | Hosting, builds, contact form | Free tier is enough to start |
| Sanity | Blog posts | Free tier is enough to start |
| Google account | The public events calendar and the Calendar API key | Free |
| Domain registrar | The church's domain name | Existing |

---

## Phase 0: Tidy the repository

- [ ] Commit and push any outstanding local changes (`git status` should be clean).
- [ ] Check the site builds locally: `make dev`, then open <http://localhost:1313>.

---

## Phase 1: Finalise the site content (in the repository)

All of this is in `data/site.yaml`. Edit it, check it with `make dev`, then commit and push.
The local site already shows this content exactly as it will appear live.

- [ ] **Contact details** (`settings`): real phone number (currently a test number), email
      (currently `office@example.org`) and postal address.
- [ ] **Facebook** (`settings.facebook`): the real page URL. It isn't shown anywhere at the moment
      since the top banner was removed; ask if you want it added to the footer.
- [ ] **Mission statement** (About Us page): approved by the PCC. It is currently marked as a draft.
- [ ] **Safeguarding page**: the real policy, the Parish Safeguarding Officer's contact details and
      the Diocese of Worcester safeguarding team's details.
- [ ] **Guiding Lights page**: real content, or clearly marked as coming soon.
- [ ] **About Us history**: adapted from Wikipedia (CC BY-SA 4.0). Keep the attribution line, and
      check the facts with the parish.
- [ ] **Permissions**: people named or pictured have agreed. This covers staff headshots, the
      Traidpoint photo, and the Traidpoint committee members named on that page.

Already done and in `data/site.yaml`:

- Staff and leadership: Revd Hazel Charlton (Vicar & Team Leader), Revd Sarah Tranter,
  Revd Chris Henson, Revd Rachel Homer and Mthr Victoria Barlow, with headshots
- Service times: Sunday 9.30am Holy Communion (Eucharist), Wednesday 12.30pm Holy Communion (Spoken)
- Our Churches: A Church Near You links and photos for all four other churches

> **Making changes after launch:** edit `data/site.yaml` (or add images to `assets/images/`),
> commit and push. Netlify rebuilds the live site automatically within a couple of minutes.

---

## Phase 2: Set up Sanity (the blog)

1. Go to <https://www.sanity.io/manage> and sign in with the parish account.
2. **Create a project** called "St John the Baptist, Halesowen".
   - Dataset name: `production`
   - Visibility: **Public**. Published posts are public on the website anyway, and drafts are
     never exposed. This means no read token is needed.
3. Copy the **Project ID** from the project's dashboard.
4. Set up the Studio (the editing app) on your machine:

   ```sh
   cd studio
   cp .env.example .env
   # edit .env: SANITY_STUDIO_PROJECT_ID=<your project ID>
   npm install
   npx sanity login
   npm run dev          # opens http://localhost:3333
   ```

5. Deploy the Studio so editors can write posts from a browser without installing anything:

   ```sh
   npm run deploy       # choose a hostname, e.g. st-john-halesowen
   ```

   It will be at `https://<hostname>.sanity.studio`. Bookmark it.
6. Invite editors: sanity.io/manage → your project → **Members** → **Invite**, with the
   *Editor* role.
7. In the Studio, create the **Tags** you want visitors to filter by (e.g. News, Music, Community,
   Worship), then publish at least one real **Blog post** so the blog isn't empty at launch.

**Check:** the hosted Studio shows just two lists, *Blog posts* and *Tags*, and your first post
is published (not a draft).

---

## Phase 3: Set up Google Calendar (events)

### 3a. The calendar

1. In Google Calendar (parish account), create a new calendar, e.g. "St John's events".
   Use a dedicated calendar, not anyone's personal one: everything in it will be public.
2. Open the calendar's **Settings and sharing**:
   - **Access permissions for events** → tick **Make available to public** → choose
     **See all event details**.
   - **Integrate calendar** → copy the **Calendar ID**
     (it looks like `abc123…@group.calendar.google.com`).
3. Add the regular services and upcoming events. The site shows the next 180 days.
   Set each event's **location** and **description**; both appear on the What's On page.

### 3b. The API key

1. Go to <https://console.cloud.google.com/> (same parish account) and create a project,
   e.g. "st-john-website".
2. **APIs & Services → Library** → search for **Google Calendar API** → **Enable**.
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Edit the new key:
   - **API restrictions** → **Restrict key** → tick only **Google Calendar API**.
   - **Application restrictions** → leave as **None**. The key is only used by Netlify's build
     servers, which have no fixed address. It is sent in a request header at build time and never
     appears in the published pages.
5. Copy the key.

**Check:** paste this into a terminal with your values filled in. It should print event titles,
not an error:

```sh
curl -s -H "X-Goog-Api-Key: <API key>" \
  "https://www.googleapis.com/calendar/v3/calendars/<Calendar ID>/events?maxResults=5" \
  | grep '"summary"'
```

(If the Calendar ID contains `#` or other special characters, URL-encode it.)

---

## Phase 4: Try it locally against the real services

Before involving Netlify, confirm the site builds with the real blog and calendar.

1. Create `.env.staging` in the project root (it is git-ignored):

   ```sh
   HUGO_BASEURL=http://localhost:1313/
   HUGO_SANITY_PROJECT_ID=<project ID>
   HUGO_SANITY_DATASET=production
   HUGO_GCAL_ID=<Calendar ID>
   HUGO_GCAL_API_KEY=<API key>
   ```

2. Run `scripts/hugo.sh staging server`.

**Check:** the striped banner reads *"Staging build · blog: sanity · events: google"*. The Blog
page shows your real post(s), and What's On lists your Google Calendar events. All other pages
look the same as in `make dev`.

---

## Phase 5: Set up Netlify (hosting)

1. At <https://app.netlify.com>, **Add new site → Import an existing project → GitHub** and choose
   `SecondeJK/st-john`. Netlify reads the build settings from `netlify.toml`, so leave them as they are.
   Netlify now rebuilds the site on every push to `main`.
2. **Site configuration → Environment variables**. Add these, marking the key as a secret:

   | Variable | Value | Contexts |
   |---|---|---|
   | `HUGO_BASEURL` | `https://<your domain>/` | Production (previews set their own URL automatically) |
   | `HUGO_SANITY_PROJECT_ID` | your project ID | All |
   | `HUGO_SANITY_DATASET` | `production` | All |
   | `HUGO_GCAL_ID` | your Calendar ID | All |
   | `HUGO_GCAL_API_KEY` | your API key (secret) | All |

   `HUGO_SANITY_TOKEN` is only needed if you made the Sanity dataset private.
   Until the domain is connected (phase 7), set the production `HUGO_BASEURL` to the
   `.netlify.app` address.
3. **Forms → Enable form detection** (new Netlify sites have it off by default), then
   **Trigger deploy** so Netlify finds the contact form.
4. **Site configuration → Notifications → Emails and webhooks → Form submission notifications** →
   send contact-form messages to the parish office email.

**Check:** the deploy succeeds and the `.netlify.app` address shows the full site with **no**
striped banner. If the build fails with *"Missing required variables"*, the log names the
missing variables.

---

## Phase 6: Automatic rebuilds

The site is static, so it only changes when it is rebuilt. Changes to `data/site.yaml` rebuild on
push (phase 5). The blog and the calendar each need a trigger of their own.

### 6a. When a blog post is published in Sanity

1. Netlify: **Site configuration → Build & deploy → Continuous deployment → Build hooks →
   Add build hook**, named "Sanity publish", branch `main`. Copy the URL.
2. Sanity: sanity.io/manage → project → **API → Webhooks → Create webhook**:
   - URL: the Netlify build hook URL
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: leave empty (all documents)
   - HTTP method: POST
   - Leave *"Trigger webhook when drafts are modified"* **off**

### 6b. Nightly, for calendar changes

Google Calendar can't notify Netlify, so a GitHub Action rebuilds the site every night at 04:00 UTC.

1. Create a second Netlify build hook, named "Nightly calendar refresh".
2. GitHub → repository → **Settings → Secrets and variables → Actions → New repository secret**:
   name `NETLIFY_BUILD_HOOK`, value the hook URL.
3. **Actions → Nightly rebuild → Run workflow** to test it.

Calendar changes made during the day appear the next morning. To show one sooner, use
**Trigger deploy** in Netlify or **Run workflow** in GitHub.

> GitHub pauses scheduled workflows after 60 days with no commits to the repository. If events
> stop updating, check the Actions tab and re-enable the workflow.

**Check:** publish a small edit to a blog post in the Studio. A new deploy starts in Netlify within
a few seconds, and the change is live within a couple of minutes.

---

## Phase 7: Connect the domain

1. Netlify: **Domain management → Add a domain** → enter the church's domain.
2. Netlify shows the DNS records to create. Add them at your domain registrar, or move the domain's
   nameservers to Netlify DNS if you prefer Netlify to manage it. Set up both the bare domain and `www`.
3. Wait for DNS to update (minutes to a few hours). Netlify then issues the HTTPS certificate
   automatically.
4. Update the production `HUGO_BASEURL` to `https://<your domain>/` and **Trigger deploy**.

**Check:** the domain loads over `https://`, the `www` and bare versions redirect to one another,
and page links don't point to `.netlify.app`.

---

## Phase 8: Final checks on the live domain

- [ ] Every menu item and dropdown link works, on a phone as well as a computer.
- [ ] What's On shows the real events, and *Subscribe (iCal)* opens the calendar.
- [ ] Send a test message through the contact form and check it arrives by email.
- [ ] Publish a test blog post with an image, see it appear, then delete or unpublish it.
- [ ] Add the site to [Google Search Console](https://search.google.com/search-console) and submit
      `https://<your domain>/sitemap.xml`.
- [ ] Update the church's A Church Near You page and Facebook page to link to the new site.

---

## If something goes wrong

| Problem | What to do |
|---|---|
| A bad deploy is live | Netlify → **Deploys** → choose the last good deploy → **Publish deploy**. |
| A content change broke the build | The Netlify deploy log names the problem (often a YAML indentation mistake in `data/site.yaml`). The previous deploy stays live until a build succeeds. Fix and push, or revert the commit. |
| Build fails: *"Missing required variables"* | Add the named variables in Netlify (phase 5) for that deploy context. |
| Build fails: *"blog: Sanity request failed"* | Check `HUGO_SANITY_PROJECT_ID` and dataset; if the dataset is private, add `HUGO_SANITY_TOKEN`. |
| Build fails: *"events: Google Calendar request failed"* | Check the calendar is public, the Calendar API is enabled, and the key's API restriction includes it. |
| A published blog post doesn't show | Check Netlify **Deploys** for a new build. If there wasn't one, check the Sanity webhook's delivery log. If there was, wait a minute and trigger another deploy. |
| Events are out of date | Check the GitHub **Actions** tab for the nightly run, or trigger a deploy by hand. |

## Reference

- `README.md`: architecture, environments and all environment variables
- `data/site.yaml`: all permanent site content
- `.env.example`: template for local `.env.<environment>` files
- `netlify.toml`: build commands per deploy context
- `.github/workflows/rebuild.yml`: nightly rebuild
- `studio/`: Sanity Studio (blog) schemas
