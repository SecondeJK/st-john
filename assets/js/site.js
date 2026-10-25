// Progressive enhancement only: every page works without JavaScript.

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
}

function initCarousel() {
  const root = document.querySelector(".carousel");
  if (!root) return;
  const slides = [...root.querySelectorAll(".carousel__slide")];
  const dots = [...root.querySelectorAll(".carousel__dot")];
  const pauseBtn = root.querySelector('[data-carousel="pause"]');
  if (slides.length < 2) {
    root.querySelector(".carousel__controls")?.remove();
    return;
  }

  let index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.classList.toggle("is-active", n === index);
      s.setAttribute("aria-hidden", String(n !== index));
    });
    dots.forEach((d, n) => d.setAttribute("aria-current", String(n === index)));
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
    pauseBtn.textContent = "▶";
    pauseBtn.setAttribute("aria-label", "Play slideshow");
  };
  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 7000);
    pauseBtn.textContent = "❚❚";
    pauseBtn.setAttribute("aria-label", "Pause slideshow");
  };

  root.querySelector('[data-carousel="prev"]').addEventListener("click", () => show(index - 1));
  root.querySelector('[data-carousel="next"]').addEventListener("click", () => show(index + 1));
  dots.forEach((d) => d.addEventListener("click", () => show(Number(d.dataset.carouselTo))));
  pauseBtn.addEventListener("click", () => (timer ? stop() : start()));
  root.addEventListener("focusin", () => timer && clearInterval(timer));

  if (reduceMotion) stop();
  else start();
}

function initBlogFilters() {
  const form = document.querySelector("[data-blog-filters]");
  const grid = document.querySelector("[data-blog-posts]");
  if (!form || !grid) return;
  const chips = [...document.querySelectorAll(".tag-chips .chip[data-tag]")];
  const posts = [...grid.querySelectorAll(".post-card")];
  const empty = document.querySelector("[data-blog-empty]");
  const params = new URLSearchParams(location.search);
  const state = { tag: params.get("tag") || "", media: params.get("media") || "", q: params.get("q") || "" };

  form.q.value = state.q;
  form.media.value = state.media;

  const apply = () => {
    const q = state.q.trim().toLowerCase();
    let shown = 0;
    posts.forEach((p) => {
      const tags = p.dataset.tags ? p.dataset.tags.split("|") : [];
      const ok =
        (!state.tag || tags.includes(state.tag)) &&
        (!state.media || p.dataset.media.split(" ").includes(state.media)) &&
        (!q || p.dataset.text.includes(q));
      p.hidden = !ok;
      if (ok) shown++;
    });
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.tag === state.tag)));
    empty.hidden = shown > 0;

    const next = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => v && next.set(k, v));
    history.replaceState(null, "", next.toString() ? `?${next}` : location.pathname);
  };

  chips.forEach((c) =>
    c.addEventListener("click", (e) => {
      e.preventDefault();
      state.tag = c.dataset.tag;
      apply();
    })
  );
  form.addEventListener("submit", (e) => e.preventDefault());
  form.q.addEventListener("input", () => {
    state.q = form.q.value;
    apply();
  });
  form.media.addEventListener("change", () => {
    state.media = form.media.value;
    apply();
  });
  apply();
}

function initCalendar() {
  const root = document.querySelector("[data-calendar]");
  const dataEl = document.getElementById("events-data");
  if (!root || !dataEl) return;

  const events = JSON.parse(dataEl.textContent || "[]").map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  }));
  const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const byDay = new Map();
  events.forEach((e) => {
    const k = key(e.start);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(e);
  });

  const grid = root.querySelector(".calendar__grid");
  const title = root.querySelector(".calendar__title");
  const dayPanel = root.querySelector(".calendar__day");
  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = null;

  const fmtTime = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  const fmtDay = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const fmtMonth = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  const renderDay = (date) => {
    const list = byDay.get(key(date)) || [];
    if (!list.length) {
      dayPanel.innerHTML = "";
      return;
    }
    dayPanel.innerHTML =
      `<h3>${esc(fmtDay.format(date))}</h3><ul class="event-list">` +
      list
        .map(
          (e) => `<li class="event"><div class="event__body">
            <h4 class="event__title">${e.link ? `<a href="${esc(e.link)}" rel="noopener">${esc(e.title)}</a>` : esc(e.title)}</h4>
            <p class="event__meta">${e.allDay ? "All day" : `${fmtTime.format(e.start)} to ${fmtTime.format(e.end)}`}${
            e.location ? ` · ${esc(e.location)}` : ""
          }</p></div></li>`
        )
        .join("") +
      "</ul>";
  };

  const render = () => {
    title.textContent = fmtMonth.format(view);
    grid.innerHTML = "";
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((d) => {
      const el = document.createElement("div");
      el.className = "calendar__dow";
      el.textContent = d;
      grid.append(el);
    });
    const offset = (view.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let i = 0; i < offset; i++) grid.append(document.createElement("span"));
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const list = byDay.get(key(date)) || [];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar__cell";
      btn.textContent = d;
      btn.setAttribute("aria-label", `${fmtDay.format(date)}: ${list.length || "no"} event${list.length === 1 ? "" : "s"}`);
      if (key(date) === key(today)) btn.classList.add("is-today");
      if (list.length) {
        btn.classList.add("has-events");
        btn.dataset.count = list.length;
        btn.setAttribute("aria-pressed", String(selected && key(selected) === key(date)));
        btn.addEventListener("click", () => {
          selected = date;
          render();
          renderDay(date);
        });
      } else {
        btn.disabled = true;
      }
      grid.append(btn);
    }
  };

  root.querySelector('[data-cal="prev"]').addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    render();
  });
  root.querySelector('[data-cal="next"]').addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    render();
  });

  root.hidden = false;
  render();
  const firstToday = byDay.get(key(today)) ? today : events[0]?.start;
  if (firstToday) {
    selected = firstToday;
    render();
    renderDay(firstToday);
  }
}

function initGallery() {
  const galleries = document.querySelectorAll("[data-gallery]");
  if (!galleries.length || typeof HTMLDialogElement !== "function") return;

  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Image viewer");
  dialog.innerHTML = `<figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__caption"></figcaption></figure>
    <button type="button" class="lightbox__btn lightbox__close" aria-label="Close">×</button>
    <button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous image">‹</button>
    <button type="button" class="lightbox__btn lightbox__next" aria-label="Next image">›</button>
    <p class="lightbox__count" aria-live="polite"></p>`;
  document.body.append(dialog);
  const img = dialog.querySelector(".lightbox__img");
  const caption = dialog.querySelector(".lightbox__caption");
  const count = dialog.querySelector(".lightbox__count");

  let links = [];
  let index = 0;
  const show = (i) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    img.src = link.href;
    img.alt = link.querySelector("img")?.alt || "";
    caption.textContent = link.dataset.caption || "";
    count.textContent = `Image ${index + 1} of ${links.length}`;
    dialog.classList.toggle("lightbox--single", links.length < 2);
  };

  galleries.forEach((g) => {
    const own = [...g.querySelectorAll(".gallery__link")];
    own.forEach((link, i) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        links = own;
        show(i);
        dialog.showModal();
      })
    );
  });

  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".lightbox__prev").addEventListener("click", () => show(index - 1));
  dialog.querySelector(".lightbox__next").addEventListener("click", () => show(index + 1));
  dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => img.removeAttribute("src"));
}

initNav();
initCarousel();
initBlogFilters();
initCalendar();
initGallery();
