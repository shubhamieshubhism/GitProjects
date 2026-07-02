// import http from 'k6/http';
// import { check } from 'k6';

// export const options = {
//   vus: 50,
//   duration: '30s',
//   // 50 VUs * 30s ≈ 1500 requests at 1 req/VU/s, but we want 10k total,
//   // so we'll add a high request rate by setting a very short sleep.
//   // Better: use a high number of iterations.
//   // Actually we'll use a higher duration or more VUs.
//   // We'll use stages for a prolonged stress.
//   stages: [
//     { duration: '2m', target: 100 },
//     { duration: '1m', target: 100 },
//   ],
//   thresholds: {
//     http_req_failed: ['rate<0.02'], // allow 2% errors
//     http_req_duration: ['p(95)<1000'],
//   },
// };

// export default function () {
//   // Use a dummy login endpoint – httpbin returns whatever we POST
//   const url = 'https://httpbin.org/post';
//   const payload = JSON.stringify({
//     username: 'testuser',
//     password: 'testpass',
//   });
//   const params = {
//     headers: { 'Content-Type': 'application/json' },
//   };

//   const res = http.post(url, payload, params);

//   check(res, {
//     'status is 200': (r) => r.status === 200,
//     'response has json': (r) => r.json('json') !== undefined,
//   });

//   // No sleep – we want high throughput
// }

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // warm-up
    { duration: '2m', target: 100 },  // peak load (100 VUs)
    { duration: '1m', target: 100 },  // sustain
    { duration: '30s', target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],   // allow 2% errors
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
//   const url = 'https://httpbin.org/post';
  const url = 'https://jsonplaceholder.typicode.com/posts';
  const payload = JSON.stringify({
    username: 'testuser',
    password: 'testpass',
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has json': (r) => r.json('json') !== undefined,
  });

  // A small think time to control request rate (adjust as needed)
  sleep(0.1);
}