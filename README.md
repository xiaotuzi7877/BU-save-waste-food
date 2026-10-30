# BU SaveFood / Spark! Bytes

A campus food-discovery and reservation application. I implemented the application workflows across the Next.js/TypeScript client, Express API, and Prisma/PostgreSQL data model: students discover and reserve food, organizers publish events, and administrators manage users and inspect activity.

## Architecture overview

```text
Next.js 14 / React / Material UI
        | credentialed HTTP + session cookie
        v
Express 5 -> authentication/role middleware -> controllers -> services -> repositories
                                                                |
                                                                v
                                                Prisma -> PostgreSQL / Supabase

Event images -> Multer -> server/uploads/events
Email notifications -> Resend (optional configuration)
```

The schema defines **6 entities** (User, DietaryPrefs, Event, FoodItem, Reservation, Feedback), **3 roles**, and the server mounts **10 route groups**. These describe implementation scope, not live-user scale.

## Implemented features

- Student registration/login and Google sign-in with BU email checks; JWT session cookies and role checks.
- Event discovery, event publishing, food-item reservations, cancellations, dietary preferences and feedback.
- Organizer verification, admin user management, and analytics backed by Prisma queries and Recharts views.
- JPEG/PNG image upload through the Express API with a 5 MB limit and local Multer disk storage.
- Event and reservation email flows through Resend. Test-mode recipient selection has offline tests and never redirects mail to an unrelated hardcoded address.

**Storage clarification:** Supabase supplies PostgreSQL connectivity. The current upload implementation uses local disk; Supabase Storage is not implemented. A dependency appearing in package.json does not establish that the feature exists.

## Design trade-offs and remaining work

| Choice | Benefit | Engineering boundary |
|---|---|---|
| Separate browser client and Express API | Clear UI/API/service/repository responsibilities | Cookie, CORS, and deployment origins need consistent configuration |
| Prisma relational models and explicit roles | Traceable relationships and role-based workflows | Capacity updates and cancellation need transaction/idempotency hardening |
| Local upload storage | Simple reproducible development setup | Ephemeral/serverless deployment needs durable object storage |
| Optional transactional email | Core setup can be compiled without a mail account | Event-broadcast preference handling and delivery observability need further work |

This is a portfolio application, not a claim of production readiness, customer adoption, zero overselling, or load-tested throughput. Before a real-user deployment, review capacity concurrency, cancellation retries, notification preferences, authentication configuration and verbose logs elsewhere in the application.

## Local setup

Verification used Node 22 and npm with the committed lockfiles. A configured PostgreSQL database is required to run the application. Supabase is one option.

```sh
git clone https://github.com/xiaotuzi7877/BU-save-waste-food.git
cd BU-save-waste-food/server
npm ci
cp .env.example .env
# Configure DATABASE_URL and JWT_SECRET for your own development environment.
npm run prisma:gen
npx prisma migrate deploy
npm run dev
```

In another terminal:

```sh
cd BU-save-waste-food/client
npm ci
cp .env.local.example .env.local
npm run dev
```

The client defaults to port 3000 and the API to 4000. Optional Google and Resend settings are listed in the examples. Never place database credentials, JWT secrets or email API keys in NEXT_PUBLIC variables. No database migration or email send was performed during portfolio verification.

## Offline verification

After generating Prisma types, these checks do not connect to a database or send email:

```sh
cd server
npm test

cd ../client
npx tsc --noEmit
npm run lint
```

The server tests cover production recipient deduplication, explicit test-mailbox allowlisting, missing test configuration, case normalization, and prevention of test-mail rerouting. Compilation and recipient tests do not substitute for end-to-end database or browser testing.

## Code map

- `client/src/app/`: student, organizer and admin screens.
- `client/src/components/`: event forms, uploads, authentication, preferences and admin views.
- `server/src/routes/`, `controllers/`, `services/`, `repositories/`: API layers.
- `server/prisma/schema.prisma`: six entities and role/status enums.
- `server/src/middleware/`: authentication, roles and upload handling.
- `server/src/lib/email-recipients.test.ts`: offline recipient-policy tests.
- [Interview walkthrough](docs/portfolio-walkthrough.md).

The project retains the Spark! Bytes application context and its existing source attribution. No adoption or impact figures are invented.
