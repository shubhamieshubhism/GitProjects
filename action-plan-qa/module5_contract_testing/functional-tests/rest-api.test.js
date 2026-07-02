// // // // const request = require('supertest');
// // // // const app = require('../backend/product-service/src/server');

// // // // describe('REST API Functional Tests', () => {
// // // //   test('GET /api/products pagination', async () => {
// // // //     const res = await request(app).get('/api/products?page=1&limit=5');
// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.data).toHaveLength(5);
// // // //     expect(res.body.total).toBeDefined();
// // // //   });

// // // //   test('GET /api/products/:id returns product', async () => {
// // // //     const res = await request(app).get('/api/products/prod_0001');
// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.id).toBe('prod_0001');
// // // //   });

// // // //   test('GET /api/products/:id returns 404 for missing', async () => {
// // // //     const res = await request(app).get('/api/products/nonexistent');
// // // //     expect(res.status).toBe(404);
// // // //   });

// // // //   test('POST /api/products creates product', async () => {
// // // //     const newProd = { name: 'Test', price: 10, category: 'Test' };
// // // //     const res = await request(app).post('/api/products').send(newProd);
// // // //     expect(res.status).toBe(201);
// // // //     expect(res.body.name).toBe('Test');
// // // //   });

// // // //   test('PUT /api/products/:id is idempotent', async () => {
// // // //     const res1 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
// // // //     expect(res1.status).toBe(200);
// // // //     const res2 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
// // // //     expect(res2.status).toBe(200);
// // // //     expect(res2.body.price).toBe(99.99);
// // // //   });

// // // //   test('DELETE /api/products/:id is idempotent (204)', async () => {
// // // //     const res1 = await request(app).delete('/api/products/prod_9999');
// // // //     expect(res1.status).toBe(204);
// // // //     const res2 = await request(app).delete('/api/products/prod_9999');
// // // //     expect(res2.status).toBe(204);
// // // //   });

// // // //   test('Rate limiting returns 429 after 10 requests', async () => {
// // // //     for (let i = 0; i < 11; i++) {
// // // //       const res = await request(app).get('/api/products');
// // // //       if (i === 10) expect(res.status).toBe(429);
// // // //     }
// // // //   });
// // // // });

// // // const request = require('supertest');
// // // const { initializeApp } = require('../backend/product-service/src/server');

// // // let app;

// // // beforeAll(async () => {
// // //   app = await initializeApp();
// // // });

// // // describe('REST API Functional Tests', () => {
// // //   test('GET /api/products pagination', async () => {
// // //     const res = await request(app).get('/api/products?page=1&limit=5');
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.data).toHaveLength(5);
// // //     expect(res.body.total).toBeDefined();
// // //   });

// // //   test('GET /api/products/:id returns product', async () => {
// // //     const res = await request(app).get('/api/products/prod_0001');
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.id).toBe('prod_0001');
// // //   });

// // //   test('GET /api/products/:id returns 404 for missing', async () => {
// // //     const res = await request(app).get('/api/products/nonexistent');
// // //     expect(res.status).toBe(404);
// // //   });

// // //   test('POST /api/products creates product', async () => {
// // //     const newProd = { name: 'Test', price: 10, category: 'Test' };
// // //     const res = await request(app).post('/api/products').send(newProd);
// // //     expect(res.status).toBe(201);
// // //     expect(res.body.name).toBe('Test');
// // //   });

// // //   test('PUT /api/products/:id is idempotent', async () => {
// // //     const res1 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
// // //     expect(res1.status).toBe(200);
// // //     const res2 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
// // //     expect(res2.status).toBe(200);
// // //     expect(res2.body.price).toBe(99.99);
// // //   });

// // //   test('DELETE /api/products/:id is idempotent (204)', async () => {
// // //     const res1 = await request(app).delete('/api/products/prod_9999');
// // //     expect(res1.status).toBe(204);
// // //     const res2 = await request(app).delete('/api/products/prod_9999');
// // //     expect(res2.status).toBe(204);
// // //   });

// // //   test('Rate limiting returns 429 after 10 requests', async () => {
// // //     // Reset the counter by making 11 requests and checking the 11th
// // //     for (let i = 0; i < 11; i++) {
// // //       const res = await request(app).get('/api/products');
// // //       if (i === 10) {
// // //         expect(res.status).toBe(429);
// // //       } else {
// // //         expect(res.status).toBe(200);
// // //       }
// // //     }
// // //   });
// // // });
// // const request = require('supertest');
// // const { initializeApp } = require('../backend/product-service/src/server');
// // // Import the reset function from rest.js (we need to get it from the module)
// // // Since it's not exported directly, we'll get it via require and then access the export.
// // // Actually we can modify the export above to include it. Let's assume we have it.
// // // We'll directly require the module to access exports.
// // const restModule = require('../backend/product-service/src/routes/rest');

// // let app;

// // beforeAll(async () => {
// //   app = await initializeApp();
// // });

// // describe('REST API Functional Tests', () => {
// //   test('GET /api/products pagination', async () => {
// //     const res = await request(app).get('/api/products?page=1&limit=5');
// //     expect(res.status).toBe(200);
// //     // Now we expect 5 items because we added more products
// //     expect(res.body.data).toHaveLength(5);
// //     expect(res.body.total).toBe(6); // total 6 products
// //   });

// //   test('GET /api/products/:id returns product', async () => {
// //     const res = await request(app).get('/api/products/prod_0001');
// //     expect(res.status).toBe(200);
// //     expect(res.body.id).toBe('prod_0001');
// //   });

// //   test('GET /api/products/:id returns 404 for missing', async () => {
// //     const res = await request(app).get('/api/products/nonexistent');
// //     expect(res.status).toBe(404);
// //   });

// //   test('POST /api/products creates product', async () => {
// //     const newProd = { name: 'Test', price: 10, category: 'Test' };
// //     const res = await request(app).post('/api/products').send(newProd);
// //     expect(res.status).toBe(201);
// //     expect(res.body.name).toBe('Test');
// //   });

// //   test('PUT /api/products/:id is idempotent', async () => {
// //     const res1 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
// //     expect(res1.status).toBe(200);
// //     const res2 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
// //     expect(res2.status).toBe(200);
// //     expect(res2.body.price).toBe(99.99);
// //   });

// //   test('DELETE /api/products/:id is idempotent (204)', async () => {
// //     const res1 = await request(app).delete('/api/products/prod_9999');
// //     expect(res1.status).toBe(204);
// //     const res2 = await request(app).delete('/api/products/prod_9999');
// //     expect(res2.status).toBe(204);
// //   });

// //   test('Rate limiting returns 429 after 10 requests', async () => {
// //     // Reset the counter before this test to get a clean state
// //     restModule.resetRequestCount();

// //     // Make 11 requests; the 11th should return 429
// //     for (let i = 0; i < 11; i++) {
// //       const res = await request(app).get('/api/products');
// //       if (i === 10) {
// //         expect(res.status).toBe(429);
// //       } else {
// //         expect(res.status).toBe(200);
// //       }
// //     }
// //   });
// // });

// const request = require('supertest');
// const { initializeApp } = require('../backend/product-service/src/server');

// let app;

// beforeAll(async () => {
//   process.env.NODE_ENV = 'test'; // Enable test endpoints
//   app = await initializeApp();
// });

// describe('REST API Functional Tests', () => {
//   test('GET /api/products pagination', async () => {
//     const res = await request(app).get('/api/products?page=1&limit=5');
//     expect(res.status).toBe(200);
//     expect(res.body.data).toHaveLength(5);
//     expect(res.body.total).toBe(6);
//   });

//   test('GET /api/products/:id returns product', async () => {
//     const res = await request(app).get('/api/products/prod_0001');
//     expect(res.status).toBe(200);
//     expect(res.body.id).toBe('prod_0001');
//   });

//   test('GET /api/products/:id returns 404 for missing', async () => {
//     const res = await request(app).get('/api/products/nonexistent');
//     expect(res.status).toBe(404);
//   });

//   test('POST /api/products creates product', async () => {
//     const newProd = { name: 'Test', price: 10, category: 'Test' };
//     const res = await request(app).post('/api/products').send(newProd);
//     expect(res.status).toBe(201);
//     expect(res.body.name).toBe('Test');
//   });

//   test('PUT /api/products/:id is idempotent', async () => {
//     const res1 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
//     expect(res1.status).toBe(200);
//     const res2 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
//     expect(res2.status).toBe(200);
//     expect(res2.body.price).toBe(99.99);
//   });

//   test('DELETE /api/products/:id is idempotent (204)', async () => {
//     const res1 = await request(app).delete('/api/products/prod_9999');
//     expect(res1.status).toBe(204);
//     const res2 = await request(app).delete('/api/products/prod_9999');
//     expect(res2.status).toBe(204);
//   });

//   test('Rate limiting returns 429 after 10 requests', async () => {
//     // Reset the counter using the hidden test endpoint
//     await request(app).post('/test/reset-counter').send();

//     // Send 11 requests; the 11th should be 429
//     for (let i = 0; i < 11; i++) {
//       const res = await request(app).get('/api/products');
//       if (i === 10) {
//         expect(res.status).toBe(429);
//       } else {
//         expect(res.status).toBe(200);
//       }
//     }
//   });
// });

const request = require('supertest');
const { initializeApp } = require('../backend/product-service/src/server');
const restModule = require('../backend/product-service/src/routes/rest');

let app;

beforeAll(async () => {
  app = await initializeApp();
});

describe('REST API Functional Tests', () => {
  test('GET /api/products pagination', async () => {
    const res = await request(app).get('/api/products?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(6);
  });

  test('GET /api/products/:id returns product', async () => {
    const res = await request(app).get('/api/products/prod_0001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('prod_0001');
  });

  test('GET /api/products/:id returns 404 for missing', async () => {
    const res = await request(app).get('/api/products/nonexistent');
    expect(res.status).toBe(404);
  });

  test('POST /api/products creates product', async () => {
    const newProd = { name: 'Test', price: 10, category: 'Test' };
    const res = await request(app).post('/api/products').send(newProd);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test');
  });

  test('PUT /api/products/:id is idempotent', async () => {
    const res1 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
    expect(res1.status).toBe(200);
    const res2 = await request(app).put('/api/products/prod_0001').send({ price: 99.99 });
    expect(res2.status).toBe(200);
    expect(res2.body.price).toBe(99.99);
  });

  test('DELETE /api/products/:id is idempotent (204)', async () => {
    const res1 = await request(app).delete('/api/products/prod_9999');
    expect(res1.status).toBe(204);
    const res2 = await request(app).delete('/api/products/prod_9999');
    expect(res2.status).toBe(204);
  });

  test('Rate limiting returns 429 after 10 requests', async () => {
    // Reset the counter directly via the exported function
    restModule.resetCounter();

    // Send 11 requests; the 11th should be 429
    for (let i = 0; i < 11; i++) {
      const res = await request(app).get('/api/products');
      if (i === 10) {
        expect(res.status).toBe(429);
      } else {
        expect(res.status).toBe(200);
      }
    }
  });
});