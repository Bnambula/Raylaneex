# Raylane Express — Full MVP

Uganda's first vertically integrated transport technology platform.
**Tusimbudde — Off We Go!**

## Files

| File | Description |
|------|-------------|
| `index.html` | Public homepage — hero, search, map, routes, parcels, loyalty |
| `book.html` | 5-step booking flow — search → seat → details → pay → QR ticket |
| `operator.html` | Operator SaaS dashboard — all 16 management views |
| `apply.html` | 3-step operator onboarding |
| `styles.css` | Global design system — Warriors Gold + Royal Blue |
| `app.js` | Shared JS — nav, scroll reveals, toasts, geolocation, utils |
| `manifest.json` | PWA manifest — installable on Android home screen |
| `vercel.json` | Vercel deployment config with URL rewrites |
| `_redirects` | Netlify redirects |

## Deploy to Vercel (60 seconds)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Set **Framework Preset** to `Other`
5. Set **Root Directory** to the folder containing these files
6. Click Deploy — you're live!

## Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site from Git
3. Connect your repo, set publish directory to root
4. Click Deploy

## Key Features

### Passenger
- Mobile-first booking with MTN MoMo, Airtel Money, Visa/Mastercard
- Interactive seat map (67-seater coach and 14-seater minivan)
- Real-time seat availability with 5-minute lock
- QR e-ticket sent via SMS — no account needed
- Parcel booking with GPS tracking
- Group/charter booking
- Geolocation: find nearest terminal with live departures
- Loyalty programme (Bronze → Silver → Gold)

### Operator SaaS
- Full dashboard: trips, bookings, fleet, drivers, financials, payroll
- Compliance monitoring with 60-day expiry warnings
- Real-time activity feed
- SMS broadcast to passengers
- IFRS-compliant P&L and financial exports

### Design System
- Colors: Warriors Gold (#FFC72C) + Royal Blue (#0B1D45)
- Fonts: Sora (display) + DM Sans (body)
- Mobile-first, 2G-optimised
- PWA-ready — installable on Android

## Environment Variables (for production backend)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
MTN_MOMO_API_KEY=
MTN_MOMO_SECRET=
AIRTEL_MONEY_KEY=
AFRICA_TALKING_KEY=
DPO_GROUP_KEY=
FLUTTERWAVE_PUBLIC_KEY=
```

## Routes

| URL | File |
|-----|------|
| `/` | `index.html` |
| `/book` | `book.html` |
| `/apply` | `apply.html` |
| `/operator` | `operator.html` |
| `/admin` | `admin.html` |
