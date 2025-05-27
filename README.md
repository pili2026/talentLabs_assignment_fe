# Job Platform - Frontend (Vue 3 + Vite)

This is the frontend implementation for the Job Platform coding assignment. Built with **Vue 3**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## Features

- Job List with search, filter, pagination, and sorting
- Create / Edit / View / Delete job postings
- i18n language support (English / 繁體中文)
- URL query sync & browser history support
- Responsive UI using Tailwind CSS
- Simple animated loading spinner

---

## Project Setup

```bash
npm install
```

### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Type Check, Build and Minify for Production

```bash
npm run build
```

### Lint with ESLint

```bash
npm run lint
```

### Docker Setup

This frontend can be containerized using Docker and served via Nginx.

#### Dockerfile

A multi-stage Dockerfile is used:

- Node.js stage to build the Vue app
- Nginx stage to serve the built assets

See `Dockerfile`, `entrypoint.sh`, and `nginx.conf` under `bin/nginx/` for details.

#### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will build the frontend, proxy API requests to the backend via the `${JOB_SERVER}` environment variable, and expose the site on port `8080`.

Ensure that your backend server is reachable and that CORS settings are correctly configured.

### Environment Configuration

This project uses Vite's `.env` files to configure runtime settings.

#### Example: Configure backend API location

You can create a `.env` file and define:

```env
VITE_API_BASE=http://0.0.0.0:8000
```

This allows frontend requests (e.g., via axios) to be directed to the correct backend during development or containerized deployment.

## Directory Highlights

| Path             | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| `src/pages`      | Contains `JobListPage.vue`, `JobDetailPage.vue`, `JobCreatePage.vue`, `JobEditPage.vue` |
| `src/components` | Contains `LoadingSpinner.vue` reusable spinner                                          |
| `src/api`        | All API logic (e.g., `getJobList`, `createJob`)                                         |
| `src/stores`     | Authentication state (for username / logout)                                            |
| `src/i18n`       | Language files (`en.ts`, `zh-TW.ts`)                                                    |

## Authentication

This project uses real login credentials. After the backend server is started, an `admin` user is seeded by default.

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

You can log in using these credentials, and the authenticated state will be reflected in the header (showing username and logout button).

## AI Usage

AI assistance (e.g., GitHub Copilot / ChatGPT) was used for UI improvement and refactoring. Manual logic and testing are implemented to ensure correctness.

## Notes

- Ensure Node.js ≥ 18.x is installed.
- All job-related fields follow the structure defined in the assignment.
- Skills can be filtered using checkboxes and comma-separated input.

## Future Improvements

- Add authentication & permission roles
- Drag-and-drop skill chips with transitions
- API error banner instead of inline text
- Test coverage using Cypress or Vitest
