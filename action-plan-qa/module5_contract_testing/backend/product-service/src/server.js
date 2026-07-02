// // const express = require('express');
// // const { ApolloServer } = require('@apollo/server');
// // const { expressMiddleware } = require('@apollo/server/express4');
// // const grpc = require('@grpc/grpc-js');
// // const protoLoader = require('@grpc/proto-loader');
// // const path = require('path');
// // const restRoutes = require('./routes/rest');
// // const graphqlSchema = require('./routes/graphql');
// // const { productProtoPath } = require('./proto/product.proto');

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // REST API
// // app.use(express.json());
// // app.use('/api', restRoutes);

// // // GraphQL
// // const server = new ApolloServer({ schema: graphqlSchema });
// // await server.start();
// // app.use('/graphql', expressMiddleware(server));

// // // OpenAPI docs
// // const swaggerJsdoc = require('swagger-jsdoc');
// // const swaggerUi = require('swagger-ui-express');
// // const options = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: { title: 'Product API', version: '1.0.0' },
// //   },
// //   apis: ['./backend/product-service/src/routes/rest.js'],
// // };
// // const specs = swaggerJsdoc(options);
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// // // gRPC server
// // const packageDefinition = protoLoader.loadSync(productProtoPath, {
// //   keepCase: true,
// //   longs: String,
// //   enums: String,
// //   defaults: true,
// //   oneofs: true,
// // });
// // const productProto = grpc.loadPackageDefinition(packageDefinition).product;
// // const grpcServer = new grpc.Server();
// // grpcServer.addService(productProto.ProductService.service, {
// //   getProduct: (call, callback) => {
// //     const product = products.find(p => p.id === call.request.id);
// //     callback(null, product);
// //   },
// //   listProducts: (call) => {
// //     products.forEach(p => call.write(p));
// //     call.end();
// //   },
// // });
// // grpcServer.bindAsync(`0.0.0.0:50051`, grpc.ServerCredentials.createInsecure(), () => {
// //   console.log('gRPC server running on port 50051');
// // });

// // app.listen(PORT, () => console.log(`REST/GraphQL server running on port ${PORT}`));

// const express = require('express');
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const path = require('path');
// const restRoutes = require('./routes/rest');
// const graphqlSchema = require('./routes/graphql');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Shared product data (used by REST and gRPC)
// const products = [
//   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
//   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
// ];

// // REST API
// app.use(express.json());
// app.use('/api', restRoutes);

// // OpenAPI docs (Swagger UI)
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

// // gRPC server setup (no await needed here – bindAsync is async with callback)
// const productProtoPath = path.join(__dirname, 'proto', 'product.proto');
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
// grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
//   console.log('gRPC server running on port 50051');
// });

// // Async function to start Apollo Server and HTTP server
// async function startServer() {
//   const server = new ApolloServer({ schema: graphqlSchema });
//   await server.start();
//   app.use('/graphql', expressMiddleware(server));

//   app.listen(PORT, () => {
//     console.log(`REST/GraphQL server running on port ${PORT}`);
//     console.log(`OpenAPI docs available at http://localhost:${PORT}/api-docs`);
//   });
// }

// // Call the async function and handle errors
// startServer().catch(err => {
//   console.error('Failed to start server:', err);
//   process.exit(1);
// });

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const restRoutes = require('./routes/rest');
const graphqlSchema = require('./routes/graphql');

const PORT = process.env.PORT || 3000;

// Shared product data (used by REST and gRPC)
const products = [
  { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
];

// gRPC server (doesn't affect HTTP tests, but we can start it conditionally)
const productProtoPath = path.join(__dirname, 'proto', 'product.proto');
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

/**
 * Creates and initializes the Express app with all middleware
 * (REST, GraphQL, OpenAPI docs) but does NOT start the HTTP server.
 * Returns the fully configured app instance.
 */
async function initializeApp() {
  const app = express();

  // REST API
  app.use(express.json());
  app.use('/api', restRoutes);

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

  // GraphQL
  const server = new ApolloServer({ schema: graphqlSchema });
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  return app;
}

// Start the server only if this file is run directly
if (require.main === module) {
  initializeApp()
    .then(app => {
      // Start gRPC server
      grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running on port 50051');
      });

      // Start HTTP server
      app.listen(PORT, () => {
        console.log(`REST/GraphQL server running on port ${PORT}`);
        console.log(`OpenAPI docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch(err => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
}

// Export the initializer for tests
module.exports = { initializeApp };