# PharmaNet Help Center

Public documentation site for the PharmaNet platform — guides for customers and sellers on using the verified pharmacies marketplace. Fully bilingual (English + Amharic).

Built with [Mintlify](https://mintlify.com).

## Tech Stack

| Technology | Version |
|---|---|
| **Mintlify** | Latest (via `mint` CLI) |
| **Node.js** | 18+ (specified in `.nvmrc`) |
| **Format** | MDX + YAML frontmatter |
| **Config** | `docs.json` |
| **Deployment** | Vercel (automatic on push) |

## Content Structure

```
pharmanet-guide-docs/
├── index.mdx                    # Landing / welcome page
├── quickstart.mdx               # Quick start guide
│
├── customer/                    # Customer guide (7 pages)
│   ├── index.mdx
│   ├── create-account.mdx
│   ├── find-products.mdx
│   ├── visit-pharmacies.mdx
│   ├── place-order.mdx
│   ├── track-orders.mdx
│   └── manage-account.mdx
│
├── seller/                      # Seller guide (10 pages)
│   ├── index.mdx
│   ├── register.mdx
│   ├── dashboard.mdx
│   ├── manage-products.mdx
│   ├── process-orders.mdx
│   ├── chat-customers.mdx
│   ├── reports.mdx
│   ├── payments.mdx
│   ├── promotions.mdx
│   └── account-settings.mdx
│
├── help/                        # Help & support (2 pages)
│   ├── index.mdx
│   └── contact.mdx
│
├── am/                          # Full Amharic translation (አማርኛ)
│   ├── index.mdx
│   ├── quickstart.mdx
│   ├── customer/                # 7 translated pages
│   ├── seller/                  # 10 translated pages
│   └── help/                    # 2 translated pages
│
├── images/                      # hero-dark.png, hero-light.png, checks-passed.png
├── logo/                        # dark.svg, light.svg
│
├── docs.json                    # Mintlify configuration
└── .env.local                   # Vercel OIDC token (deployment)
```

## Navigation Tabs (from `docs.json`)

1. **Home** — Getting Started
2. **Customer Guide** — 7 pages covering the full customer journey
3. **Seller Guide** — 10 pages covering pharmacy owner operations
4. **Help & Support** — Contact and FAQ
5. **አማርኛ** — Full Amharic translation with 21+ pages

## Branding

| Property | Value |
|---|---|
| Primary Color | `#1B5E20` (dark green) |
| Light Color | `#4CAF50` (green) |
| Dark Color | `#0D3320` (dark green) |
| Logo | Light/dark SVG variants in `logo/` |

## Hardcoded Credentials (Test Purposes Only)

| Key | File | Value |
|---|---|---|
| Vercel OIDC Token | `.env.local:2` | `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9...` |

> **⚠️**: This is a Vercel deployment token for CI/CD. Rotate before sharing the repository publicly.

## Features

- **Bilingual Support** — Full English + Amharic (አማርኛ) content for both customer and seller guides
- **Customer Guide** — Step-by-step instructions: account creation, product search, ordering, order tracking, account management
- **Seller Guide** — Complete pharmacy owner documentation: registration, dashboard, product management, order processing, customer chat, reports, payments, promotions, account settings
- **Help & Support** — Contact information and FAQ
- **Responsive Design** — Mintlify handles mobile/desktop/tablet layouts
- **Dark/Light Mode** — Automatic theme switching
- **Search** — Full-text search across all documentation

## Allowed Users

| User Type | Access |
|---|---|
| **Anyone** (public) | Full read access — no authentication required |

## Prerequisites

- Node.js 18+
- Mintlify CLI (`mint`)

## How to Run

```bash
# 1. Navigate to the project
cd pharmanet-guide-docs

# 2. Install Mintlify CLI globally
npm i -g mint

# 3. Start development server
mint dev
```

Preview at **http://localhost:3000**.

## Development

```bash
# Preview with a specific port
mint dev --port 4000
```

## Deployment

Deployed via **Vercel**. Changes pushed to the default branch are deployed automatically. The Vercel OIDC token in `.env.local` is used for CI/CD authentication.

## License

Proprietary — PharmaNet, Alyah Software © 2026
