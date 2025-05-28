# TalentLabs Frontend Assignment

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
docker compose up --build
```

This will build the frontend image, proxy API requests to the backend via the VITE_API_BASE environment variable, and expose the site on port `8000`.

> When running the frontend container independently:
>
> - Make sure the Docker network used by both frontend and backend containers (e.g., talentlabs_network) already exists
> - Ensure the backend container (e.g., talentlabs_web) is joined to the same network
> - Otherwise, Nginx will throw: host not found in upstream "talentlabs_web"

You can verify the network and container status using:

```bash
docker network ls
docker network inspect talentlabs_network
```

### Environment Configuration

This project uses Vite's .env or Docker ARG to configure runtime settings.

#### Example: Configure backend API location

You can create a `.env` file and define:

```env
VITE_API_BASE=/api
```

This ensures that frontend requests to /api/... will be proxied to the backend server.

During local development (via npm run dev), the proxy is handled by Vite's config:

```js
server: {
  host: '0.0.0.0',
  port: 5173,
  proxy: {
    '/api': {
      target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

During Docker build, you can inject VITE_API_BASE like this:

```bash
docker build --build-arg VITE_API_BASE=/api -t job-fe .
```

Or via Docker Compose:

```yml
build:
  context: .
  dockerfile: Dockerfile
  args:
    VITE_API_BASE: /api
```

Make sure VITE_API_BASE matches the proxy path used in Nginx (nginx.conf) and Vite (vite.config.ts).

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
