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

### Open the Grafana dashboard

Grafana and Prometheus start as part of the same Compose command:

- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`

Sign in to Grafana with username `admin` and the `GRAFANA_ADMIN_PASSWORD` you
set in `.env`. Open **Dashboards** → **Code Visualizer** → **Code Visualizer -
API Overview**. The Prometheus data source and dashboard are provisioned
automatically.

The dashboard shows API request rate, server error rate, 95th-percentile
response time, request rates by route and status code, and Node.js memory
usage. Generate some app traffic and wait at least one minute for Prometheus
to collect enough data for the charts.

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
- `frontend/.dockerignore` and `backend/.dockerignore` — keep local files and
  dependencies out of image build contexts.
- `.env.example` — names and local defaults for Compose configuration.
