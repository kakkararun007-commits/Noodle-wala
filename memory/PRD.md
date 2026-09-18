# NoodleWala.com — Product Requirements & Progress Document

## Original Problem Statement
Build a premium, responsive, production-ready website and scalable web application for NoodleWala.com — a specialty noodle retail brand uniting noodles from different countries under one roof. Must support: brand awareness, product discovery (future e-commerce), international collections, franchise lead generation + applications, store discovery, Try & Buy sampling concept, AI-powered customer assistance, customer care ticketing, franchise partner support, and future POS/inventory/CRM/payment/delivery integrations. Brand must always be written "NoodleWala" (never "Noodle Wala"). Fixed palette: #00704A, #063B2B, #123D2D, #1B8A63, #C9A227, #F7FAF6, #FFFFFF, #5F6F67, #D7E4DC. No fabricated stores, prices, reviews, guarantees, or SLAs.

## User Choices (confirmed)
- AI assistant: real LLM — Gemini 3.1 Pro (gemini-3.1-pro-preview) via Emergent Universal Key, SSE streaming.
- Seed data: clearly-labelled sample catalogue (8 origin collections, 12 sample products, 3 demo stores).
- Admin portal: NOT in Release 1 (architecture-ready DB collections only).

## User Personas
1. Customers — discover noodles, find stores, Try & Buy, ask AI, raise/track tickets.
2. Prospective franchise partners — learn the model, apply, request callback.
3. Existing franchise partners — support + ticket escalation (full portal later).
4. Internal NoodleWala team — content/product/store/ticket/lead management (admin UI later phase).

## Architecture
- Frontend: React 19 + react-router-dom 7 + Tailwind + shadcn/ui. Pages in /app/frontend/src/pages; shared components in /app/frontend/src/components (Logo, Header, Footer, Blocks, ProductCard, CollectionCard, StoreCard, AIAssistant, TicketDialog, TicketLookup). API client: /app/frontend/src/lib/api.js (axios + fetch-based SSE streamChat).
- Backend: FastAPI single-module /app/backend/server.py, MongoDB (motor) via MONGO_URL/DB_NAME. All routes under /api.
- DB collections: collections, products, stores, site_config, knowledge, tickets, franchise_leads, contact_enquiries, ai_conversations.
- AI: emergentintegrations LlmChat, Gemini 3.1 Pro, system prompt built from published knowledge articles + store/collection summaries + strict no-fabrication rules; history persisted in ai_conversations; SSE with X-Accel-Buffering: no.
- Security: server-side validation (pydantic), honeypot spam fields, in-memory rate limiting on form/AI endpoints, ticket lookup requires mobile verification, consent flags mandatory.

## Implemented (2026-09-18, Release 1)
- Home page: hero, marquee, brand intro pillars, Explore by Origin (8 collections), featured products, Try & Buy promo, franchise band with disclaimer, store discovery teaser.
- Shop (/shop): search, origin/category/spice/Try & Buy filters, sort, skeleton/empty/error states.
- Product detail: full field spec with "Information not available" fallbacks, spice meter, related products.
- Collections: grid + per-origin detail pages.
- Try & Buy (/try-and-buy): concept, 5-step process, participating stores (from DB), eligible products, terms + hygiene/safety (config-driven).
- Store locator (/stores): city/area/PIN search, city chips, store cards with Try & Buy/pickup/delivery status, register-interest form, empty state.
- Franchise (/franchise): hero, Why NoodleWala, indicative terms from site_config (labelled Indicative), 6-step process, full validated application form with duplicate detection + honeypot + consents, compliant success message.
- About (/about), Contact (/contact) with typed enquiry routing, NotFound.
- Customer Care (/customer-care): AI entry point, ticket creation dialog (18 categories), ticket status lookup (number + mobile verification), searchable knowledge base, contact options.
- AI Assistant: floating launcher on all pages, streaming chat, quick actions, typing/error/retry/clear states, ticket creation CTA, privacy note.
- SEO: page titles/meta via usePageTitle, OG tags, semantic HTML, alt text, focus-visible rings, reduced-motion support.
- Backend test suite: /app/backend/tests/backend_test.py (25 tests, all passing).

## Test Status
- iteration_1: backend 25/25 pass; frontend all listed journeys pass (Playwright). Brand audit clean — no "Noodle Wala" anywhere. No open bugs.

## Prioritized Backlog
### P0 (next)
- Admin portal UI: products, stores, Try & Buy configs, leads, tickets dashboard, knowledge base, roles (Super Admin, Admin, Care Agent, Franchise Team, etc.).
- Real store/product data ingestion replacing sample listings.
### P1
- Customer authentication + accounts; ticket history per customer; ticket messaging/attachments.
- Map view for store locator; browser geolocation; WhatsApp/directions deep links.
- Email/WhatsApp notifications for leads, enquiries, ticket updates (Resend/Twilio playbooks).
- Multilingual assistant (Hindi/Hinglish) — architecture stubbed, not implemented.
### P2
- E-commerce: cart, checkout, payments (Stripe/Razorpay), pickup/delivery, order tracking, coupons.
- POS/inventory/CRM integrations; analytics event pipeline; SLA monitoring; audit log UI.

## Known Limitations / Notes
- In-memory rate limiter is per-process (move to Mongo/Redis at scale).
- AI system prompt rebuilt per request (add TTL cache when traffic grows).
- Ticket lookup verifies by last-10-digit mobile match (documented behavior).
- Social links intentionally absent until official profiles exist.
- All product/store data is labelled sample/demo; pricing intentionally not published.
