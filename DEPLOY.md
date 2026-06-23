# Negoshi — Deployment Guide

## What you have
- `app/layout.tsx`      — fonts + metadata (replace your existing one)
- `app/page.tsx`        — new homepage (replace your existing one)
- `app/negoshi.css`     — all brand styles (new file)
- `app/components/`     — all section components (new folder)
- `app/api/subscribe/route.ts` — email capture API (new file)
- `supabase-migration.sql`     — run once in Supabase SQL editor

---

## Step 1 — Run the Supabase migration
1. Open your Supabase project dashboard
2. Go to SQL editor → New query
3. Paste the contents of `supabase-migration.sql` and run it
4. Add a few real deals via the Table editor so the page shows live data

---

## Step 2 — Check your environment variables
Make sure these exist in Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`  ← needed for the subscribe API route

---

## Step 3 — Copy files into your repo
Drop all files from this folder into your existing Negoshi repo,
replacing the files that already exist where needed:

```
your-repo/
  app/
    layout.tsx          ← replace
    page.tsx            ← replace
    negoshi.css         ← new
    components/
      Navbar.tsx        ← new
      Hero.tsx          ← new
      StaticSections.tsx ← new
      DealsSection.tsx  ← new
      ClientSections.tsx ← new
    api/
      subscribe/
        route.ts        ← new
```

---

## Step 4 — Push to GitHub → Vercel auto-deploys
```bash
git add .
git commit -m "New Negoshi homepage"
git push
```
Vercel picks it up automatically. Live in ~60 seconds.

---

## Step 5 — Add deals to Supabase
Each deal needs:
| Column               | Example                              |
|----------------------|--------------------------------------|
| plan_name            | 30GB Small Plan                      |
| price                | 22                                   |
| retail_price         | 45                                   |
| description          | 30GB data · Unlimited calls & SMS... |
| affiliate_url        | https://your-affiliate-link.com      |
| is_featured          | true / false                         |
| is_member_exclusive  | true / false                         |
| is_active            | true                                 |

---

## What's next (this week)
- [ ] Supabase migration + seed deals
- [ ] Copy files → push to GitHub
- [ ] Verify live on negoshi.com.au
- [ ] Add real affiliate links to deals
- [ ] Test email capture → check subscribers table
