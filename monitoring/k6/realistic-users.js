import { check, group, sleep } from "k6";
import http from "k6/http";

const BASE_URL = __ENV.LOAD_TEST_BASE_URL || "http://backend:5000";
const EMAIL = __ENV.LOAD_TEST_EMAIL;
const PASSWORD = __ENV.LOAD_TEST_PASSWORD;

if (!EMAIL || !PASSWORD) {
  throw new Error(
    "Set LOAD_TEST_EMAIL and LOAD_TEST_PASSWORD to a dedicated test account.",
  );
}

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "2m", target: 20 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
  },
};

const requestParams = {
  headers: { "Content-Type": "application/json" },
  tags: { scenario: "authenticated-user" },
};

export default function () {
  const jar = http.cookieJar();
  const cookies = jar.cookiesForURL(BASE_URL);

  if (!cookies.token?.length) {
    const login = http.post(
      `${BASE_URL}/api/login`,
      JSON.stringify({ email: EMAIL, password: PASSWORD }),
      requestParams,
    );
    const loginOk = check(login, {
      "login succeeds": (response) => response.status === 201,
    });

    if (!loginOk) {
      return;
    }
  }

  group("browse account and projects", () => {
    const account = http.get(`${BASE_URL}/api/me`, requestParams);
    check(account, {
      "account loads": (response) => response.status === 200,
    });
    sleep(Math.random() + 0.5);

    const projects = http.get(
      `${BASE_URL}/api/v1/MyProjects`,
      requestParams,
    );
    const projectsOk = check(projects, {
      "project list loads": (response) => response.status === 200,
    });

    if (projectsOk) {
      const data = projects.json("data");
      if (Array.isArray(data) && data.length > 0) {
        const project = data[Math.floor(Math.random() * data.length)];
        const detail = http.get(
          `${BASE_URL}/api/v1/MyProjects/${encodeURIComponent(project._id)}`,
          requestParams,
        );
        check(detail, {
          "project detail loads": (response) => response.status === 200,
        });
      }
    }
  });

  sleep(Math.random() * 2 + 1);
}
