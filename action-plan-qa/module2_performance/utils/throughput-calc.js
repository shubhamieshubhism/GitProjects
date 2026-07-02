#!/usr/bin/env node

const { program } = require('commander');

program
  .option('-t, --throughput <number>', 'Target throughput (requests per second)', parseFloat)
  .option('-r, --responseTime <number>', 'Average response time in milliseconds', parseFloat)
  .parse(process.argv);

const opts = program.opts();

if (!opts.throughput || !opts.responseTime) {
  console.error('Please provide both --throughput and --responseTime');
  process.exit(1);
}

const throughput = opts.throughput; // RPS
const responseTimeSec = opts.responseTime / 1000; // seconds

// Formula: VUs = (throughput * response_time_seconds)
// Because each VU can handle 1/response_time requests per second.
// Explanation: A VU spends response_time seconds on each request, then can send another.
// So max RPS per VU = 1 / response_time.
// Thus required VUs = RPS / (1 / response_time) = RPS * response_time.
const requiredVUs = Math.ceil(throughput * responseTimeSec);

console.log(`
Throughput target: ${throughput} req/s
Average response time: ${opts.responseTime} ms
Calculated Virtual Users needed: ${requiredVUs}

Explanation:
Each VU can process ${(1 / responseTimeSec).toFixed(2)} requests per second.
To achieve ${throughput} req/s, you need ${throughput} / ${(1 / responseTimeSec).toFixed(2)} ≈ ${requiredVUs} VUs.
`);