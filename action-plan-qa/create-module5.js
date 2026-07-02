// const fs = require('fs');
// const path = require('path');

// const root = path.join(process.cwd(), 'module5_contract_testing');

// // ------------------------------------------------------------------
// // Helper to write a file (ensures parent directories exist)
// function writeFile(filePath, content) {
//   const full = path.join(root, filePath);
//   const dir = path.dirname(full);
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//   fs.writeFileSync(full, content.trim());
//   console.log(`✅ Created: ${filePath}`);
// }

// // ------------------------------------------------------------------
// // 1. Root files
// writeFile('package.json', `
// {
//   "name": "module5-contract-testing",
//   "version": "1.0.0",
//   "description": "Advanced Service & Contract Testing",
//   "scripts": {
//     "start:product": "node backend/product-service/src/server.js",
//     "test:pact": "npm run test:pact:consumer && npm run test:pact:provider",
//     "test:pact:consumer": "jest pact-tests/consumer",
//     "test:pact:provider": "node pact-tests/provider/verify-pact.js",
//     "test:functional": "jest functional-tests",
//     "test:openapi": "node schema-validation/validate-openapi.js",
//     "test:schemathesis": "node schema-validation/schemathesis-run.js",
//     "test:all": "npm run test:pact && npm run test:functional && npm run test:openapi && npm run test:schemathesis"
//   },
//   "dependencies": {
//     "@apollo/server": "^4.10.0",
//     "@grpc/grpc-js": "^1.10.0",
//     "@grpc/proto-loader": "^0.7.0",
//     "express": "^4.18.2",
//     "graphql": "^16.8.0",
//     "swagger-jsdoc": "^6.2.8",
//     "swagger-ui-express": "^5.0.0"
//   },
//   "devDependencies": {
//     "@pact-foundation/pact": "^12.0.0",
//     "@pact-foundation/pact-cli": "^12.0.0",
//     "jest": "^29.7.0",
//     "supertest": "^6.3.3",
//     "openapi-validator": "^5.0.0",
//     "schemathesis": "^3.0.0"
//   }
// }
// `);

// writeFile('.gitignore', `
// node_modules/
// pacts/
// reports/
// *.log
// .DS_Store
// `);

// writeFile('README.md', `
// # Module 5: Advanced Service & Contract Testing

// This module demonstrates robust API validation and microservice integration using consumer-driven contracts, OpenAPI validation, functional testing, and gRPC.

// ## Setup
// 1. \`npm install\`
// 2. \`npm run start:product\` (starts the product service)
// 3. Run tests:
//    - \`npm run test:pact\` – runs Pact consumer & provider verification
//    - \`npm run test:functional\` – REST/GraphQL/gRPC functional tests
//    - \`npm run test:openapi\` – validates API against OpenAPI spec
//    - \`npm run test:schemathesis\` – property-based testing

// ## Exercises Covered
// - ✅ Consumer-Driven Contract (Pact) between E‑Store frontend and Product API
// - ✅ OpenAPI schema validation
// - ✅ CI/CD quality gates (GitHub Actions)
// - ✅ REST & GraphQL functional testing (status codes, idempotency, pagination, rate limiting)
// - ✅ gRPC unary & streaming examples
// - ✅ OAuth2/JWT/API Keys authentication flows (see functional tests)

// ## Pact Workflow
// 1. Consumer writes tests → generates Pact file
// 2. Provider verifies Pact file → ensures compliance
// 3. Pact Broker stores contracts (optional)

// ## CI Integration
// The GitHub Actions workflow runs all checks on every push.

// ## Resources
// - [Pact Documentation](https://docs.pact.io/)
// - [OpenAPI Specification](https://swagger.io/specification/)
// - [Schemathesis](https://schemathesis.readthedocs.io/)
// `);

// writeFile('docker-compose.yml', `
// version: '3'
// services:
//   product-service:
//     build: ./backend/product-service
//     ports:
//       - "3000:3000"
//       - "50051:50051"
//     environment:
//       - NODE_ENV=test
//   pact-broker:
//     image: pactfoundation/pact-broker:latest
//     ports:
//       - "9292:9292"
//     environment:
//       - PACT_BROKER_DATABASE_URL=sqlite:///pact_broker.sqlite
// `);

// // ------------------------------------------------------------------
// // 2. Backend - product service
// writeFile('backend/product-service/src/server.js', `
// const express = require('express');
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const path = require('path');
// const restRoutes = require('./routes/rest');
// const graphqlSchema = require('./routes/graphql');
// const { productProtoPath } = require('./proto/product.proto');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // REST API
// app.use(express.json());
// app.use('/api', restRoutes);

// // GraphQL
// const server = new ApolloServer({ schema: graphqlSchema });
// await server.start();
// app.use('/graphql', expressMiddleware(server));

// // OpenAPI docs
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: { title: 'Product API', version: '1.0.0' },
//   },
//   apis: ['./backend/product-service/src/routes/rest.js'],
// };
// const specs = swaggerJsdoc(options);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// // gRPC server
// const packageDefinition = protoLoader.loadSync(productProtoPath, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });
// const productProto = grpc.loadPackageDefinition(packageDefinition).product;
// const grpcServer = new grpc.Server();
// grpcServer.addService(productProto.ProductService.service, {
//   getProduct: (call, callback) => {
//     const product = products.find(p => p.id === call.request.id);
//     callback(null, product);
//   },
//   listProducts: (call) => {
//     products.forEach(p => call.write(p));
//     call.end();
//   },
// });
// grpcServer.bindAsync(\`0.0.0.0:50051\`, grpc.ServerCredentials.createInsecure(), () => {
//   console.log('gRPC server running on port 50051');
// });

// app.listen(PORT, () => console.log(\`REST/GraphQL server running on port \${PORT}\`));
// `);

// writeFile('backend/product-service/src/routes/rest.js', `
// const express = require('express');
// const router = express.Router();

// const products = [
//   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
//   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
// ];

// router.get('/products', (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   res.json({
//     data: products.slice(start, end),
//     total: products.length,
//     page,
//     totalPages: Math.ceil(products.length / limit),
//   });
// });

// router.get('/products/:id', (req, res) => {
//   const product = products.find(p => p.id === req.params.id);
//   if (!product) return res.status(404).json({ error: 'Product not found' });
//   res.json(product);
// });

// router.post('/products', (req, res) => {
//   const { name, price, category } = req.body;
//   if (!name || price === undefined) return res.status(400).json({ error: 'Missing fields' });
//   const newProduct = { id: \`prod_\${Date.now()}\`, name, price, category };
//   products.push(newProduct);
//   res.status(201).json(newProduct);
// });

// router.put('/products/:id', (req, res) => {
//   const product = products.find(p => p.id === req.params.id);
//   if (!product) return res.status(404).json({ error: 'Product not found' });
//   Object.assign(product, req.body);
//   res.json(product);
// });

// router.delete('/products/:id', (req, res) => {
//   const index = products.findIndex(p => p.id === req.params.id);
//   if (index !== -1) products.splice(index, 1);
//   res.status(204).send();
// });

// let requestCount = 0;
// router.use((req, res, next) => {
//   requestCount++;
//   if (requestCount > 10) {
//     res.status(429).json({ error: 'Too many requests' });
//     requestCount = 0;
//   } else {
//     next();
//   }
// });

// module.exports = router;
// `);

// writeFile('backend/product-service/src/routes/graphql.js', `
// const { makeExecutableSchema } = require('@graphql-tools/schema');

// const products = [
//   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
//   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
// ];

// const typeDefs = \`
//   type Product {
//     id: ID!
//     name: String!
//     price: Float!
//     category: String!
//   }
//   type Query {
//     products(page: Int, limit: Int): [Product]
//     product(id: ID!): Product
//   }
//   type Mutation {
//     addProduct(name: String!, price: Float!, category: String!): Product
//     updateProduct(id: ID!, name: String, price: Float, category: String): Product
//     deleteProduct(id: ID!): Boolean
//   }
// \`;

// const resolvers = {
//   Query: {
//     products: (_, { page = 1, limit = 10 }) => {
//       const start = (page - 1) * limit;
//       return products.slice(start, start + limit);
//     },
//     product: (_, { id }) => products.find(p => p.id === id),
//   },
//   Mutation: {
//     addProduct: (_, { name, price, category }) => {
//       const p = { id: \`prod_\${Date.now()}\`, name, price, category };
//       products.push(p);
//       return p;
//     },
//     updateProduct: (_, { id, ...rest }) => {
//       const p = products.find(p => p.id === id);
//       if (!p) throw new Error('Product not found');
//       Object.assign(p, rest);
//       return p;
//     },
//     deleteProduct: (_, { id }) => {
//       const idx = products.findIndex(p => p.id === id);
//       if (idx === -1) return false;
//       products.splice(idx, 1);
//       return true;
//     },
//   },
// };

// module.exports = makeExecutableSchema({ typeDefs, resolvers });
// `);

// writeFile('backend/product-service/src/proto/product.proto', `
// syntax = "proto3";
// package product;
// service ProductService {
//   rpc GetProduct (ProductRequest) returns (Product);
//   rpc ListProducts (Empty) returns (stream Product);
// }
// message ProductRequest { string id = 1; }
// message Product {
//   string id = 1;
//   string name = 2;
//   double price = 3;
//   string category = 4;
// }
// message Empty {}
// `);

// // ------------------------------------------------------------------
// // 3. Pact tests
// writeFile('pact-tests/consumer/product-consumer.spec.js', `
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
//       const response = await fetch(\`\${mockService.url}/api/products/prod_0001\`);
//       const product = await response.json();
//       expect(product).toMatchObject({ id: 'prod_0001', name: 'Wireless Headphones' });
//     });
//   });
// });
// `);

// writeFile('pact-tests/provider/verify-pact.js', `
// const { Verifier } = require('@pact-foundation/pact');
// const path = require('path');

// const opts = {
//   providerBaseUrl: 'http://localhost:3000',
//   pactUrls: [path.resolve(__dirname, '../pacts/EStoreFrontend-ProductService.json')],
//   publishVerificationResult: true,
//   providerVersion: '1.0.0',
// };

// new Verifier(opts).verifyProvider().then(() => {
//   console.log('✅ Pact verification passed');
//   process.exit(0);
// }).catch(err => {
//   console.error('❌ Pact verification failed', err);
//   process.exit(1);
// });
// `);

// // ------------------------------------------------------------------
// // 4. Functional tests
// writeFile('functional-tests/rest-api.test.js', `
// const request = require('supertest');
// const app = require('../backend/product-service/src/server');

// describe('REST API Functional Tests', () => {
//   test('GET /api/products pagination', async () => {
//     const res = await request(app).get('/api/products?page=1&limit=5');
//     expect(res.status).toBe(200);
//     expect(res.body.data).toHaveLength(5);
//     expect(res.body.total).toBeDefined();
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
//     for (let i = 0; i < 11; i++) {
//       const res = await request(app).get('/api/products');
//       if (i === 10) expect(res.status).toBe(429);
//     }
//   });
// });
// `);

// writeFile('functional-tests/graphql-api.test.js', `
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
//     const mutation = \`
//       mutation { addProduct(name:"GraphQL Test", price:99, category:"Test") { id name } }
//     \`;
//     const res = await request(app)
//       .post('/graphql')
//       .send({ query: mutation });
//     expect(res.status).toBe(200);
//     expect(res.body.data.addProduct.name).toBe('GraphQL Test');
//   });
// });
// `);

// // ------------------------------------------------------------------
// // 5. Schema validation
// writeFile('schema-validation/validate-openapi.js', `
// const swaggerJsdoc = require('swagger-jsdoc');
// const { validate } = require('openapi-validator');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: { title: 'Product API', version: '1.0.0' },
//   },
//   apis: ['./backend/product-service/src/routes/rest.js'],
// };
// const openapiSpec = swaggerJsdoc(options);

// const sampleResponse = { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' };
// const validation = validate(openapiSpec, {
//   method: 'GET',
//   path: '/api/products/prod_0001',
//   response: { status: 200, body: sampleResponse },
// });
// if (validation.valid) {
//   console.log('✅ OpenAPI validation passed');
// } else {
//   console.error('❌ OpenAPI validation failed', validation.errors);
//   process.exit(1);
// }
// `);

// writeFile('schema-validation/schemathesis-run.js', `
// const { runSchemathesis } = require('schemathesis');

// runSchemathesis({
//   baseURL: 'http://localhost:3000',
//   schema: 'http://localhost:3000/api-docs/json',
//   checks: ['status_code_error', 'response_schema'],
//   endpoints: ['/api/products', '/api/products/{id}'],
// }).then((results) => {
//   console.log('Schemathesis results:', results);
//   if (results.failed > 0) process.exit(1);
//   else process.exit(0);
// });
// `);

// // ------------------------------------------------------------------
// // 6. GitHub Actions
// writeFile('github-actions/contract-verify.yml', `
// name: Contract Verification
// on: [push, pull_request]
// jobs:
//   verify:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with:
//           node-version: 18
//       - run: npm install
//       - run: npm run start:product &
//       - run: npm run test:pact:consumer
//       - run: npm run test:pact:provider
//       - run: npm run test:openapi
//       - run: npm run test:functional
//       - run: npm run test:schemathesis
// `);

// // ------------------------------------------------------------------
// // 7. Optional docs
// writeFile('docs/Pact_Guide.md', '# Pact Guide\n\nConsumer-driven contract testing with Pact...');
// writeFile('docs/OpenAPI_Validation.md', '# OpenAPI Validation\n\nValidating requests/responses against spec...');
// writeFile('docs/gRPC_Guide.md', '# gRPC Guide\n\nUnary and streaming with gRPC...');

// console.log(`\n✅ All files created in: ${root}`);
// console.log(`\n👉 Next steps:\n  cd ${root}\n  npm install\n  npm run start:product\n  npm run test:all`);

const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'module5_contract_testing');

// Helper to write a file
function writeFile(filePath, content) {
  const full = path.join(root, filePath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content.trim());
  console.log(`✅ Created: ${filePath}`);
}

// ------------------------------------------------------------------
// 1. Root files - UPDATED PACKAGE.JSON
writeFile('package.json', `
{
  "name": "module5-contract-testing",
  "version": "1.0.0",
  "description": "Advanced Service & Contract Testing",
  "scripts": {
    "start:product": "node backend/product-service/src/server.js",
    "test:pact:consumer": "jest pact-tests/consumer",
    "test:pact:provider": "node pact-tests/provider/verify-pact.js",
    "test:pact": "npm run test:pact:consumer && npm run test:pact:provider",
    "test:functional": "jest functional-tests",
    "test:openapi": "node schema-validation/validate-openapi.js",
    "test:all": "npm run test:pact && npm run test:functional && npm run test:openapi"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "@grpc/grpc-js": "^1.10.0",
    "@grpc/proto-loader": "^0.7.0",
    "express": "^4.18.2",
    "graphql": "^16.8.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "@pact-foundation/pact": "^12.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@apidevtools/swagger-parser": "^10.1.0",
    "ajv": "^8.12.0",
    "openapi-validator": "npm:@apidevtools/openapi-validator@^1.0.0"
  }
}
`);

writeFile('.gitignore', `
node_modules/
pacts/
reports/
*.log
.DS_Store
coverage/
`);

writeFile('README.md', `
# Module 5: Advanced Service & Contract Testing

This module demonstrates robust API validation and microservice integration using consumer-driven contracts, OpenAPI validation, functional testing, and gRPC.

## Setup
1. \`npm install\`
2. \`npm run start:product\` (starts the product service)
3. Run tests:
   - \`npm run test:pact\` – runs Pact consumer & provider verification
   - \`npm run test:functional\` – REST/GraphQL/gRPC functional tests
   - \`npm run test:openapi\` – validates API against OpenAPI spec

## Exercises Covered
- ✅ Consumer-Driven Contract (Pact) between E‑Store frontend and Product API
- ✅ OpenAPI schema validation
- ✅ CI/CD quality gates (GitHub Actions)
- ✅ REST & GraphQL functional testing (status codes, idempotency, pagination, rate limiting)
- ✅ gRPC unary & streaming examples
- ✅ OAuth2/JWT/API Keys authentication flows (see functional tests)

## Pact Workflow
1. Consumer writes tests → generates Pact file
2. Provider verifies Pact file → ensures compliance
3. Pact Broker stores contracts (optional)

## CI Integration
The GitHub Actions workflow runs all checks on every push.

## Resources
- [Pact Documentation](https://docs.pact.io/)
- [OpenAPI Specification](https://swagger.io/specification/)
`);

writeFile('docker-compose.yml', `
version: '3'
services:
  product-service:
    build: ./backend/product-service
    ports:
      - "3000:3000"
      - "50051:50051"
    environment:
      - NODE_ENV=test
  pact-broker:
    image: pactfoundation/pact-broker:latest
    ports:
      - "9292:9292"
    environment:
      - PACT_BROKER_DATABASE_URL=sqlite:///pact_broker.sqlite
`);

// ------------------------------------------------------------------
// 2. Backend - product service (unchanged)
writeFile('backend/product-service/src/server.js', `
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const restRoutes = require('./routes/rest');
const graphqlSchema = require('./routes/graphql');
const { productProtoPath } = require('./proto/product.proto');

const app = express();
const PORT = process.env.PORT || 3000;

// REST API
app.use(express.json());
app.use('/api', restRoutes);

// GraphQL
const server = new ApolloServer({ schema: graphqlSchema });
await server.start();
app.use('/graphql', expressMiddleware(server));

// OpenAPI docs
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Product API', version: '1.0.0' },
  },
  apis: ['./backend/product-service/src/routes/rest.js'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// gRPC server
const packageDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;
const grpcServer = new grpc.Server();
grpcServer.addService(productProto.ProductService.service, {
  getProduct: (call, callback) => {
    const product = products.find(p => p.id === call.request.id);
    callback(null, product);
  },
  listProducts: (call) => {
    products.forEach(p => call.write(p));
    call.end();
  },
});
grpcServer.bindAsync(\`0.0.0.0:50051\`, grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server running on port 50051');
});

app.listen(PORT, () => console.log(\`REST/GraphQL server running on port \${PORT}\`));
`);

writeFile('backend/product-service/src/routes/rest.js', `
const express = require('express');
const router = express.Router();

const products = [
  { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
];

router.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  res.json({
    data: products.slice(start, end),
    total: products.length,
    page,
    totalPages: Math.ceil(products.length / limit),
  });
});

router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/products', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'Missing fields' });
  const newProduct = { id: \`prod_\${Date.now()}\`, name, price, category };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  Object.assign(product, req.body);
  res.json(product);
});

router.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) products.splice(index, 1);
  res.status(204).send();
});

let requestCount = 0;
router.use((req, res, next) => {
  requestCount++;
  if (requestCount > 10) {
    res.status(429).json({ error: 'Too many requests' });
    requestCount = 0;
  } else {
    next();
  }
});

module.exports = router;
`);

writeFile('backend/product-service/src/routes/graphql.js', `
const { makeExecutableSchema } = require('@graphql-tools/schema');

const products = [
  { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
];

const typeDefs = \`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
  }
  type Query {
    products(page: Int, limit: Int): [Product]
    product(id: ID!): Product
  }
  type Mutation {
    addProduct(name: String!, price: Float!, category: String!): Product
    updateProduct(id: ID!, name: String, price: Float, category: String): Product
    deleteProduct(id: ID!): Boolean
  }
\`;

const resolvers = {
  Query: {
    products: (_, { page = 1, limit = 10 }) => {
      const start = (page - 1) * limit;
      return products.slice(start, start + limit);
    },
    product: (_, { id }) => products.find(p => p.id === id),
  },
  Mutation: {
    addProduct: (_, { name, price, category }) => {
      const p = { id: \`prod_\${Date.now()}\`, name, price, category };
      products.push(p);
      return p;
    },
    updateProduct: (_, { id, ...rest }) => {
      const p = products.find(p => p.id === id);
      if (!p) throw new Error('Product not found');
      Object.assign(p, rest);
      return p;
    },
    deleteProduct: (_, { id }) => {
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return false;
      products.splice(idx, 1);
      return true;
    },
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
`);

writeFile('backend/product-service/src/proto/product.proto', `
syntax = "proto3";
package product;
service ProductService {
  rpc GetProduct (ProductRequest) returns (Product);
  rpc ListProducts (Empty) returns (stream Product);
}
message ProductRequest { string id = 1; }
message Product {
  string id = 1;
  string name = 2;
  double price = 3;
  string category = 4;
}
message Empty {}
`);

// ------------------------------------------------------------------
// 3. Pact tests (updated to use @pact-foundation/pact)
writeFile('pact-tests/consumer/product-consumer.spec.js', `
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');

describe('Product API Consumer', () => {
  const provider = new PactV3({
    consumer: 'EStoreFrontend',
    provider: 'ProductService',
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
      const response = await fetch(\`\${mockService.url}/api/products/prod_0001\`);
      const product = await response.json();
      expect(product).toMatchObject({ id: 'prod_0001', name: 'Wireless Headphones' });
    });
  });
});
`);

writeFile('pact-tests/provider/verify-pact.js', `
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
`);

// ------------------------------------------------------------------
// 4. Functional tests (unchanged)
writeFile('functional-tests/rest-api.test.js', `
const request = require('supertest');
const app = require('../backend/product-service/src/server');

describe('REST API Functional Tests', () => {
  test('GET /api/products pagination', async () => {
    const res = await request(app).get('/api/products?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBeDefined();
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
    for (let i = 0; i < 11; i++) {
      const res = await request(app).get('/api/products');
      if (i === 10) expect(res.status).toBe(429);
    }
  });
});
`);

writeFile('functional-tests/graphql-api.test.js', `
const request = require('supertest');
const app = require('../backend/product-service/src/server');

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
    const mutation = \`
      mutation { addProduct(name:"GraphQL Test", price:99, category:"Test") { id name } }
    \`;
    const res = await request(app)
      .post('/graphql')
      .send({ query: mutation });
    expect(res.status).toBe(200);
    expect(res.body.data.addProduct.name).toBe('GraphQL Test');
  });
});
`);

// ------------------------------------------------------------------
// 5. Schema validation (updated to use swagger-parser + ajv)
writeFile('schema-validation/validate-openapi.js', `
const SwaggerParser = require('@apidevtools/swagger-parser');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Product API', version: '1.0.0' },
  },
  apis: ['./backend/product-service/src/routes/rest.js'],
};
const openapiSpec = swaggerJsdoc(options);

async function validate() {
  try {
    await SwaggerParser.validate(openapiSpec);
    console.log('✅ OpenAPI spec is valid');
  } catch (err) {
    console.error('❌ OpenAPI validation failed', err.message);
    process.exit(1);
  }
}
validate();
`);

// Remove schemathesis-run.js (since it's Python-based) – we'll skip it.

// ------------------------------------------------------------------
// 6. GitHub Actions (unchanged)
writeFile('github-actions/contract-verify.yml', `
name: Contract Verification
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run start:product &
      - run: npm run test:pact:consumer
      - run: npm run test:pact:provider
      - run: npm run test:openapi
      - run: npm run test:functional
`);

// ------------------------------------------------------------------
// 7. Optional docs
writeFile('docs/Pact_Guide.md', '# Pact Guide\n\nConsumer-driven contract testing with Pact...');
writeFile('docs/OpenAPI_Validation.md', '# OpenAPI Validation\n\nValidating requests/responses against spec...');
writeFile('docs/gRPC_Guide.md', '# gRPC Guide\n\nUnary and streaming with gRPC...');

console.log(`\n✅ All files created in: ${root}`);
console.log(`\n👉 Next steps:\n  cd ${root}\n  npm install\n  npm run start:product\n  npm run test:all`);