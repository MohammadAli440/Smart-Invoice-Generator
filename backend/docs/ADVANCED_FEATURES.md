# Advanced Features

This document describes the optional advanced features added:

## Email tracking

- Email opens are tracked via a 1x1 PNG pixel included in outgoing HTML emails: `/api/email/open/:emailLogId.png`.
- Clicks are tracked via a redirect endpoint: `/api/email/redirect?logId={logId}&url={encodedUrl}`.
- Email logs now include `openCount`, `clickCount`, `links` array with per-link clicks.
- To enable: ensure `APP_URL` is set to the public base URL (e.g. `https://app.example.com`) so absolute URLs in emails point to your server.

## Scheduled sends

- New `ScheduledSend` model and endpoints to schedule/cancel/list sends.
- Endpoints:
  - `POST /api/scheduled/invoice/:id` - schedule a send for given invoice (body: `scheduledAt`, `to`, `subject`, `message`).
  - `GET /api/scheduled` - list scheduled sends for the current user
  - `DELETE /api/scheduled/:id` - cancel a scheduled send
- A simple worker script runs a DB-polling scheduler and executes due sends:
  - `npm run scheduler` (backend directory) runs a poll loop and processes jobs.
  - Configure `SCHEDULER_POLL_MS` to change interval (default 30000 ms).

## Notes and runtime requirements

- The scheduler is intentionally simple and works without Redis/Bull; for production you should replace it with BullMQ + Redis.
- Tests are not included for every new feature yet; consider adding unit & integration tests before production.

## Env variables

- `APP_URL` - required for email tracking links (absolute URL used in outgoing emails)
- `SCHEDULER_POLL_MS` - optional, poll interval for scheduler in milliseconds

