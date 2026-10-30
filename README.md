Jenkins webhook test
fix: update feedback generator for Jenkins

## Run the application with Docker

The root `docker-compose.yml` runs the React frontend, Express API, and MongoDB.
The frontend is served by Nginx and proxies API requests to the backend, so the
application is available at one URL and the browser does not need to resolve
Docker-only service names.

### Prerequisites

- Docker Desktop (or Docker Engine) with the Compose plugin.
- A Gemini API key to use AI-generated visualizations. The rest of the app can
  start without one.

### Start locally

1. If you do not already have a `.env` file, create one from the example:

   ```bash
   if [ ! -f .env ]; then cp .env.example .env; fi
   ```

2. Open `.env` in a text editor. Set `JWT_SECRET` to a long, random value,
   set `GRAFANA_ADMIN_PASSWORD` to a password you choose, and optionally add
   your `GEMINI_API_KEY` if you want AI visualization. If `.env` already
   exists, keep its current values and add `GRAFANA_ADMIN_PASSWORD` rather
   than replacing the file. Keep `.env` private and do not commit it.

3. From the repository root, build and start the services:

   ```bash
   docker compose up --build -d
   ```

4. Open `http://localhost:8080` (or the `WEB_PORT` you configured).
5. Check service status and logs:

   ```bash
   docker compose ps
   docker compose logs -f
   ```

The frontend and backend wait for their dependencies' health checks before
starting. MongoDB data is stored in the `mongo_data` named volume and persists
when containers are recreated.

### Deploy the frontend to Vercel and the backend to Render

The app can run as a Vercel static frontend and a Render Node web service. Use
MongoDB Atlas for the database; the MongoDB container in Docker Compose is only
available to the local Compose network.

#### 1. Create a MongoDB Atlas database

Create a cluster and database user, then copy its connection string. Replace
the password and database name, URL-encode special characters in the password,
and keep this URI private. Configure Atlas Network Access to allow connections
from your Render service.

#### 2. Deploy the backend to Render

Create a **Web Service** from this repository and configure:

- Root Directory: `backend`
- Runtime: Node
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/`

Set these Render environment variables:

| Name | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long, randomly generated secret |
| `GEMINI_API_KEY` | Your Gemini API key, if using AI generation |
| `AI_MODEL` | `gemini-3.6-flash` or your chosen supported model |
| `CORS_ORIGINS` | Your Vercel production origin, e.g. `https://your-app.vercel.app` |

Render provides `PORT`; the server listens on it. After deployment, verify
`https://your-backend.onrender.com/` returns the backend status JSON and
`https://your-backend.onrender.com/metrics` returns Prometheus metrics.

#### 3. Deploy the frontend to Vercel

Import the same repository into Vercel and configure:

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

The Vercel rewrites in `frontend/vercel.json` proxy `/api/*` requests to the
Render backend. The frontend uses this same-origin proxy in production so
authentication cookies are not treated as third-party cookies. No
`VITE_API_URL` setting is needed on Vercel; redeploy after changing the
rewrites or frontend code.

#### 4. Verify authentication and CORS

Open the Vercel site and test registration, login, and a page that loads
projects. Production API requests go through the Vercel same-origin proxy;
local development requests still use the configured `VITE_API_URL` or
`http://localhost:5000`. The backend allows only origins listed in
`CORS_ORIGINS` for direct cross-origin requests.

If you use a custom Vercel domain, the proxy continues to use the same-origin
frontend URL for browser requests. Keep `CORS_ORIGINS` updated for any
development clients that call Render directly.

### Open the Grafana dashboard

Grafana and Prometheus start as part of the same Compose command:

- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Backend metrics: `http://localhost:5000/metrics`

Sign in to Grafana with username `admin` and the `GRAFANA_ADMIN_PASSWORD` you
set in `.env`. Open **Dashboards** → **Code Visualizer** → **Code Visualizer -
API Overview**. The Prometheus data source and dashboard are provisioned
automatically.

The dashboard shows API request rate, server error rate, 95th-percentile
response time, request rates by route and status code, and Node.js memory
usage. Generate some app traffic and wait at least one minute for Prometheus
to collect enough data for the charts.

### Simulate users with k6

The optional k6 load-test service simulates authenticated users logging in,
loading their account and project list, opening a project when one exists, and
pausing between actions. It ramps up to 20 virtual users, holds for two minutes,
then ramps down. The script only reads existing projects and does not call the
AI-backed project-creation endpoint.

1. Create a dedicated test account in the application.
2. Set `LOAD_TEST_EMAIL` and `LOAD_TEST_PASSWORD` in the root `.env` file. Do
   not use a production account.
3. Run the test from the repository root:

   ```powershell
   docker compose --profile loadtest run --rm k6   ```

The k6 container connects to the backend using the Docker-only hostname
`backend`; no host port is needed for the test. The k6 summary is printed in
the terminal. The Compose service runs `monitoring/k6/realistic-users.js`.
Successful requests appear in the existing Grafana dashboard's request-rate,
route, and status-code panels after Prometheus scrapes them (allow at least one
scrape interval). The dashboard layout does not change; its metric values and
graphs show the load. The test stops when it finishes; it is not started by the
regular `docker compose up` command.

Grafana and Prometheus ports are bound to your own computer (`127.0.0.1`) by
default. Do not expose them publicly with the example credentials; set a
private Grafana password and configure authentication and network access
before deploying monitoring services to a public server.

### Stop and clean up

Stop the services while retaining database data:

```bash
docker compose down
```

For a complete local reset, including the MongoDB data volume:

```bash
docker compose down --volumes
```

### Deploy with a container registry

1. Create a registry repository and sign in:

   ```bash
   docker login
   ```

2. Set `IMAGE_PREFIX` in `.env` to your registry namespace, for example
   `your-dockerhub-username/code-visualizer`.
3. Build and push both application images:

   ```bash
   docker compose build
   docker compose push frontend backend
   ```

4. On the deployment host, install Docker and Compose, clone the repository,
   add a configured `.env` file, then pull and start the services:

   ```bash
   docker compose pull
   docker compose up -d --no-build
   ```

Keep the deployment host's `.env` private and provide a strong `JWT_SECRET`.
For production, configure persistent MongoDB storage and prefer a managed
MongoDB service over the bundled container.

### Build images locally

Build the frontend and backend application images with Compose:

```bash
docker compose build
```

### Container files

- `docker-compose.yml` — local multi-container orchestration.
- `frontend/Dockerfile` and `frontend/nginx.conf` — production frontend image
  and API reverse proxy.
- `backend/Dockerfile` — production API image.
- `backend/src/metrics.js` — API and Node.js Prometheus metrics.
- `monitoring/prometheus.yml` — Prometheus scrape configuration.
- `monitoring/grafana/` — provisioned Grafana data source and API dashboard.
- `monitoring/k6/realistic-users.js` — authenticated read-only k6 user scenario.
- `frontend/.dockerignore` and `backend/.dockerignore` — keep local files and
  dependencies out of image build contexts.
- `.env.example` — names and local defaults for Compose configuration.
