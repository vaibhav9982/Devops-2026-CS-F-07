import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from "@prometheus-io/client";

export const metricsRegistry = new Registry();
metricsRegistry.setDefaultLabels({ app: "code-visualizer-api" });

collectDefaultMetrics({ register: metricsRegistry });

const requestLabels = ["method", "route", "status_code"];

const httpRequests = new Counter({
  name: "code_visualizer_http_requests_total",
  help: "Total number of HTTP requests handled by the API.",
  labelNames: requestLabels,
  registers: [metricsRegistry],
});

const httpRequestDuration = new Histogram({
  name: "code_visualizer_http_request_duration_seconds",
  help: "Duration of HTTP requests handled by the API in seconds.",
  labelNames: requestLabels,
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export function recordHttpMetrics(req, res, next) {
  if (req.path === "/metrics") {
    next();
    return;
  }

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route ? `${req.baseUrl}${req.route.path}` : "unmatched",
      status_code: String(res.statusCode),
    };
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;

    httpRequests.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);
  });

  next();
}
