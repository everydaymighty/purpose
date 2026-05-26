# Pathway

A clean, lavender-themed job-search website built with plain HTML and CSS.

**Live site:** https://purpose-xf3o.onrender.com

## What's inside

Pathway is a static multi-page site with everything a basic job platform needs:

- **Home** (`index.html`) — landing page with hero, job search, categories, and featured roles
- **Jobs** (`jobs.html`) — searchable listings with sidebar filters
- **Job detail** (`job.html`) — full job view with apply flow
- **Profile** (`profile.html`) — job seeker profile with view + edit modes
- **Sign in / Sign up** (`signin.html`, `signup.html`) — email/password auth UI with role picker
- **For employers** (`employers.html`) — pricing and post-a-job page
- **About** (`about.html`) — company story, values, and team
- **Careers** (`careers.html`) — Pathway's own open roles
- **Contact** (`contact.html`) — enterprise sales form
- **Privacy** (`privacy.html`) — privacy policy with table of contents
- **Coming soon** — `career-advice.html`, `salary-guide.html`, `blog.html`, `hiring-resources.html`

## Design

A soft lavender gradient flows slowly across every page. Surfaces sit on top as frosted glass. Buttons are white pills with a purple outline. All design tokens (colors, radii, shadows) live as CSS variables at the top of `styles.css`, so re-skinning is a one-file change.

## Tech

No frameworks, no build step. Just:

- HTML5 + CSS3
- Inter font from Google Fonts
- A small amount of vanilla JS per page for things like mobile nav, form validation, and the profile edit toggle

## Run it locally

Open `index.html` in any browser. That's it.

## Deploy

The site is hosted on [Render](https://render.com) as a free **Static Site**, auto-deploying from the `main` branch of this repo.

To push changes:

```bash
git add .
git commit -m "your message"
git push
```

Render picks up the push and redeploys in ~30 seconds.

**Render settings used:**
- Build Command: *(blank)*
- Publish Directory: `./`

## File structure

```
Purpose/
├── index.html
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
├── career-advice.html
├── salary-guide.html
├── blog.html
├── hiring-resources.html
├── styles.css       ← shared styles for every page
├── make-zip.bat     ← double-click to zip the site
└── README.md
```
