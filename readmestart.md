# Start the project

```bash
cd /d/FSD
if [ ! -f .env ]; then cp .env.example .env; fi
nano .env
docker compose up --build -d
docker compose ps
```

In `.env`, set `JWT_SECRET` and `GRAFANA_ADMIN_PASSWORD`, then save and exit the editor.

- App: http://localhost:8080
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

Stop the containers:

```bash
docker compose down
```
