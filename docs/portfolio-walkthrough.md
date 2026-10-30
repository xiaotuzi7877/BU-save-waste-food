# SaveFood interview walkthrough

## 60-second explanation

I implemented a campus food-discovery and reservation application across Next.js, Express and PostgreSQL. The application has student, organizer and admin workflows, six relational entities, image uploads, notifications and analytics. My focus was converting the end-to-end flow into explicit screens, API boundaries and data relationships. The current repository is a portfolio implementation; I distinguish implemented workflows from production hardening and unmeasured product impact.

## Architecture -> contribution -> result

- Follow an event from the EventForm UI through its controller/service/repository into Prisma.
- Explain the six data entities and relationships, and the three role-specific workflows.
- Trace a reservation and cancellation, including validation and inventory counters.
- Describe the actual image path: browser multipart request -> Multer -> local disk -> API-served URL.
- Describe email delivery as configured integration, not evidence that real users received messages.
- Demonstrate analytics queries and explain what each count measures.

## Design trade-offs to practice

1. Why split client, API, services and repositories instead of putting database access in UI handlers?
2. Why cookie credentials and CORS configuration must agree.
3. Why an availability check followed by an update can oversell under concurrency. Transactions or conditional updates are future hardening, not completed results.
4. Why cancellation should become idempotent before supporting retries.
5. Why local images are convenient for development but insufficient on ephemeral hosts.
6. Why test-mode email must be explicitly allowlisted and must never reroute messages to an unrelated address.
7. How to measure future product impact: publish-to-claim time, reservation conversion and food reclaimed. These are proposed measures; no such results are claimed.

## Verification boundary

Use the committed offline checks for compilation, lint and email-recipient policy. No live database migration, email delivery, full browser flow or load benchmark was exercised in the portfolio cleanup.
