import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
  // 200 VUs * 30s = 6000 requests if each does one, but we want higher.
  // We'll make each VU loop multiple times by using a short sleep.
  thresholds: {
    http_req_failed: ['rate<0.1'],   // allow up to 10% errors (simulate attack)
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  // Send many requests rapidly to overload the system
  const url = 'https://test-api.k6.io/public/crocodiles/';
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Minimal think time to maximise request rate
  sleep(0.1);
}

// Note: To truly simulate DDoS, run with high VUs and no sleep.
// This script also captures failure patterns via thresholds.