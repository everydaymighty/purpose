# Pathway

A clean, lavender-themed job-search website built with plain HTML, CSS, and a sprinkle of vanilla JS.

**Live site:** https://purpose-xf3o.onrender.com

## What's inside

A static multi-page site with everything a job platform needs to look real.

**Core flow**

- **Home** (`index.html`) — hero with two floating purple orbs, animated bubble clouds of fields, stats, categories, how-it-works, featured roles, CTA
- **Jobs** (`jobs.html`) — searchable listings with sidebar filters (type, arrangement, experience, salary, date)
- **Job detail** (`job.html`) — full job view with apply modal and similar jobs sidebar
- **Profile** (`profile.html`) — job seeker profile with view + in-place edit modes
- **Sign in / Sign up** (`signin.html`, `signup.html`) — auth UI with role picker, social buttons, basic validation

**Employer side**

- **For employers** (`employers.html`) — pricing and post-a-job
- **Hiring resources** (`hiring-resources.html`) — searchable library of free templates and guides
- **Contact sales** (`contact.html`) — enterprise contact form with success state

**Company**

- **About** (`about.html`) — story, values, leadership grid
- **Careers** (`careers.html`) — Pathway's own open roles, grouped by team
- **Privacy** (`privacy.html`) — privacy policy with sticky table of contents

**Coming soon (placeholder pages with email capture)**

- `career-advice.html`, `salary-guide.html`, `blog.html`

## Design

A soft lavender gradient flows slowly across every page. Surfaces sit on top as frosted glass — translucent white cards with backdrop blur. Buttons are white pills with a purple outline and purple text; the dark CTA card flips it to a solid white-on-purple variant.

**Typography**

- **DM Sans** for body and UI
- **DM Serif Display** for hero headlines and section titles — gives the site an editorial feel
- Both load via `@import` in `styles.css`, so every page picks them up automatically

**Hero animation system (on `index.html`)**

- Two large purple orbs hug the edges and drift on slow 18s and 22s float cycles
- Each orb is surrounded by ~13 white pill bubbles labeled with fields ("Design", "Engineering", "Finance"…) that float in sync with their parent orb, plus their own gentle bob
- A small "Search…" bubble in each cluster opens a field modal
- The top edge of the hero blends into the nav via a soft white veil, the bottom blends into the body gradient — no hard seams

**Interactions**

- **Hover any floating bubble** → it scales up with a stronger shadow
- **Click a floating bubble** → opens a modal that stays open: field name in serif, one-line blurb, role count, list of companies hiring in that field, and "See all jobs" + "Close" buttons. Click outside, hit Esc, or use the × to dismiss.
- **Click a big category card** → a center popup rises up showing the category info, then auto-navigates to filtered listings
- **Click "Search…" bubble** → opens the same modal as a field, with curated remote-first companies, then routes to `jobs.html`
- **Scroll** → sections fade in with staggered delays via an intersection observer
- **Reach the stats strip** → numbers count up from 0 to their final value
- **Click "Sign in" pill** → goes to signin form. Sign in is a small frosted pill with an enter-arrow icon to match the bubble theme.

All design tokens (colors, radii, shadows, font vars) live as CSS variables at the top of `styles.css`, so re-skinning is a one-file change.

## Tech

No frameworks, no build step. Just:

- HTML5 + CSS3
- DM Sans + DM Serif Display from Google Fonts
- Two small JS files:
  - `nav.js` — mobile nav drawer, scroll-reveal observer, number counter
  - Inline `<script>` on `index.html` — bubble click → modal, category card popup
- Per-page inline JS for forms (signin/signup validation, contact form, profile edit toggle, jobs filter chips)

## Run it locally

Open `index.html` in any browser. That's it — no server needed.

## Deploy

Hosted on [Render](https://render.com) as a free **Static Site**, auto-deploying from the `main` branch of this repo.

To push changes:

```bash
git add .
git commit -m "your message"
git push
```

Render picks up the push and redeploys in ~30 seconds.

**Render settings:**
- Build Command: *(blank)*
- Publish Directory: `./`

## File structure

```
Purpose/
├── index.html              ← landing page (hero with orbs + bubbles + modal)
├── signin.html
├── signup.html
├── jobs.html
├── job.html
├── profile.html
├── employers.html
├── about.html
├── careers.html
├── contact.html
├── privacy.html
├── hiring-resources.html
├── career-advice.html
├── salary-guide.html
├── blog.html
├── styles.css              ← shared styles + design tokens for every page
├── nav.js                  ← shared mobile nav, scroll reveals, number counter
├── make-zip.bat            ← double-click to zip the site for sharing
└── README.md
```

## Editing tips

- **Change the palette** → edit the `--purple-*` variables at the top of `styles.css`
- **Change the fonts** → edit `--font-body` and `--font-display` in `styles.css`
- **Add a new field bubble** to the hero → drop a new `<div class="job-bubble">` in `index.html`, add a position rule for its `:nth-child(N)`, and add an entry in the `categoryInfo` + `companiesByField` maps so the modal has data for it
- **Change company logos shown in the modal** → edit the `companiesByField` map at the top of the `<script>` block in `index.html`
- **Adjust the scroll-reveal animation** → tweak `.reveal` and `@keyframes` in `styles.css`
- **Slow or speed the bubble drift** → change the `floatA` / `floatB` / `bubbleFloat` durations in `index.html`'s `<style>` block
