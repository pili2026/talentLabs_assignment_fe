# Job Platform Frontend

This is the frontend implementation for the Job Platform. Built with **Vue 3**, **TypeScript**, **Tailwind CSS**, and **Vite**.

## Features

- Job List with search, filter, pagination, and sorting
- Create / Edit / View / Delete job postings
- i18n language support (English / 繁體中文)
- URL query sync & browser history support
- Responsive UI using Tailwind CSS
- Simple animated loading spinner

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
> - Make sure the Docker network used by both frontend and backend containers (e.g., job_platform_network) already exists
> - Ensure the backend container (e.g., job_platform_web) is joined to the same network
> - Otherwise, Nginx will throw: host not found in upstream "job_platform_web"

You can verify the network and container status using:

```bash
docker network ls
docker network inspect job_platform_network
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

## Design Decisions & Tradeoffs

Several design choices were made to accommodate ambiguous areas in the frontend portion of the assignment.

### 1. **URL Query Sync and State Preservation**

- The requirement mentions query persistence across page reloads and browser history navigation.
- Implemented using `vue-router` with full sync between filters, search terms, pagination, and route query parameters.
- **Tradeoff**: Adds complexity to page state management, but provides a better user experience.

### 2. **Skill Filter UX Design**

- Backend supports filtering by multiple skills, but input format is not defined.
- Implemented a comma-separated input field and optional checkboxes for simplicity.
- **Tradeoff**: Easier to implement than a fully dynamic multi-select UI component, yet still functional and testable.

### 3. **Language Switching (i18n)**

- Used `vue-i18n` to support Traditional Chinese and English.
- Language setting is preserved across page reloads using `localStorage`.
- **Tradeoff**: No server-side translation fallback, which is acceptable in this SPA context.

### 4. **API Integration via Proxy**

- API requests are proxied using `VITE_API_BASE` both in Vite dev server and Nginx Docker setup.
- Ensures frontend can run independently or with Docker Compose while still reaching the backend.
- **Tradeoff**: Requires careful alignment of paths between `.env`, `vite.config.ts`, and `nginx.conf`.

### 5. **Component Architecture**

- Page components are co-located under `src/pages`; shared logic is abstracted into composables and API modules.
- All API calls are centralized under `src/api` for better maintainability.
- **Tradeoff**: Lightweight modularity instead of Vuex/Pinia for this assignment scope.

### 6. **Responsiveness and Loading Experience**

- Used Tailwind CSS with responsive breakpoints and a simple animated loading spinner.
- No heavy animation libraries to maintain performance.
- **Tradeoff**: Prioritizes speed and clarity over visual complexity.

> These decisions aim to balance development speed, usability, and assignment constraints.

## Future Improvements

- Add authentication & permission roles
- Drag-and-drop skill chips with transitions
- API error banner instead of inline text
- Test coverage using Cypress or Vitest
