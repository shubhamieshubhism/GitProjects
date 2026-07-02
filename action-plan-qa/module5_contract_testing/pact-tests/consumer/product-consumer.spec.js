// const { PactV3, MatchersV3 } = require('@pact-foundation/pact');

// describe('Product API Consumer', () => {
//   const provider = new PactV3({
//     consumer: 'EStoreFrontend',
//     provider: 'ProductService',
//   });

//   it('returns product details', async () => {
//     provider
//       .given('product exists with ID prod_0001')
//       .uponReceiving('a request for product prod_0001')
//       .withRequest({
//         method: 'GET',
//         path: '/api/products/prod_0001',
//       })
//       .willRespondWith({
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//         body: MatchersV3.like({
//           id: 'prod_0001',
//           name: 'Wireless Headphones',
//           price: 99.99,
//           category: 'Electronics',
//         }),
//       });

//     await provider.executeTest(async (mockService) => {
//       const response = await fetch(`${mockService.url}/api/products/prod_0001`);
//       const product = await response.json();
//       expect(product).toMatchObject({ id: 'prod_0001', name: 'Wireless Headphones' });
//     });
//   });
// });

const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const path = require('path');
const fs = require('fs');

// Ensure the pact directory exists
const pactDir = path.resolve(__dirname, '../pacts');
if (!fs.existsSync(pactDir)) {
  fs.mkdirSync(pactDir, { recursive: true });
}

describe('Product API Consumer', () => {
  const provider = new PactV3({
    consumer: 'EStoreFrontend',
    provider: 'ProductService',
    pactDir: pactDir,   // <-- writes pact to pact-tests/pacts/
  });

  it('returns product details', async () => {
    provider
      .given('product exists with ID prod_0001')
      .uponReceiving('a request for product prod_0001')
      .withRequest({
        method: 'GET',
        path: '/api/products/prod_0001',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: MatchersV3.like({
          id: 'prod_0001',
          name: 'Wireless Headphones',
          price: 99.99,
          category: 'Electronics',
        }),
      });

    await provider.executeTest(async (mockService) => {
      const response = await fetch(`${mockService.url}/api/products/prod_0001`);
      const product = await response.json();
      expect(product).toMatchObject({ id: 'prod_0001', name: 'Wireless Headphones' });
    });
  });
});