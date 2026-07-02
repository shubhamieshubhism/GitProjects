const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

const opts = {
  providerBaseUrl: 'http://localhost:3000',
  pactUrls: [path.resolve(__dirname, '../pacts/EStoreFrontend-ProductService.json')],
  publishVerificationResult: true,
  providerVersion: '1.0.0',
};

new Verifier(opts).verifyProvider().then(() => {
  console.log('✅ Pact verification passed');
  process.exit(0);
}).catch(err => {
  console.error('❌ Pact verification failed', err);
  process.exit(1);
});