import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric to track error rate
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '10s', target: 50 },   // ramp-up to 50 VUs
    { duration: '20s', target: 100 },  // ramp-up to 100 VUs
    { duration: '30s', target: 100 },  // stay at 100 VUs
    { duration: '10s', target: 0 },    // ramp-down to 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],    // error rate < 1%
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    errors: ['rate<0.01'],            // custom error rate
  },
};

export default function () {
  const url = 'https://test-api.k6.io/public/crocodiles/';
  const res = http.get(url);

  const checkResult = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!checkResult); // if any check fails, mark as error

  // Simulate think time
  sleep(1);
}