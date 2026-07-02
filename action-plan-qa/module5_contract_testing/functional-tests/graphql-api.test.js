// const request = require('supertest');
// const app = require('../backend/product-service/src/server');

// describe('GraphQL API Functional Tests', () => {
//   test('Query products', async () => {
//     const query = '{ products(page:1, limit:2) { id name price } }';
//     const res = await request(app)
//       .post('/graphql')
//       .send({ query });
//     expect(res.status).toBe(200);
//     expect(res.body.data.products).toHaveLength(2);
//   });

//   test('Mutation addProduct', async () => {
//     const mutation = `
//       mutation { addProduct(name:"GraphQL Test", price:99, category:"Test") { id name } }
//     `;
//     const res = await request(app)
//       .post('/graphql')
//       .send({ query: mutation });
//     expect(res.status).toBe(200);
//     expect(res.body.data.addProduct.name).toBe('GraphQL Test');
//   });
// });

const request = require('supertest');
const { initializeApp } = require('../backend/product-service/src/server');

let app;

beforeAll(async () => {
  app = await initializeApp();
});

describe('GraphQL API Functional Tests', () => {
  test('Query products', async () => {
    const query = '{ products(page:1, limit:2) { id name price } }';
    const res = await request(app)
      .post('/graphql')
      .send({ query });
    expect(res.status).toBe(200);
    expect(res.body.data.products).toHaveLength(2);
  });

  test('Mutation addProduct', async () => {
    const mutation = `
      mutation { addProduct(name:"GraphQL Test", price:99, category:"Test") { id name } }
    `;
    const res = await request(app)
      .post('/graphql')
      .send({ query: mutation });
    expect(res.status).toBe(200);
    expect(res.body.data.addProduct.name).toBe('GraphQL Test');
  });

  test('Query product by id', async () => {
    const query = '{ product(id: "prod_0001") { id name price } }';
    const res = await request(app)
      .post('/graphql')
      .send({ query });
    expect(res.status).toBe(200);
    expect(res.body.data.product.id).toBe('prod_0001');
  });
});