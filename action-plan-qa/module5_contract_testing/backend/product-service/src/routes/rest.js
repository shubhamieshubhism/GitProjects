// // // // const express = require('express');
// // // // const router = express.Router();

// // // // const products = [
// // // //   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
// // // //   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
// // // // ];

// // // // router.get('/products', (req, res) => {
// // // //   const page = parseInt(req.query.page) || 1;
// // // //   const limit = parseInt(req.query.limit) || 10;
// // // //   const start = (page - 1) * limit;
// // // //   const end = start + limit;
// // // //   res.json({
// // // //     data: products.slice(start, end),
// // // //     total: products.length,
// // // //     page,
// // // //     totalPages: Math.ceil(products.length / limit),
// // // //   });
// // // // });

// // // // router.get('/products/:id', (req, res) => {
// // // //   const product = products.find(p => p.id === req.params.id);
// // // //   if (!product) return res.status(404).json({ error: 'Product not found' });
// // // //   res.json(product);
// // // // });

// // // // router.post('/products', (req, res) => {
// // // //   const { name, price, category } = req.body;
// // // //   if (!name || price === undefined) return res.status(400).json({ error: 'Missing fields' });
// // // //   const newProduct = { id: `prod_${Date.now()}`, name, price, category };
// // // //   products.push(newProduct);
// // // //   res.status(201).json(newProduct);
// // // // });

// // // // router.put('/products/:id', (req, res) => {
// // // //   const product = products.find(p => p.id === req.params.id);
// // // //   if (!product) return res.status(404).json({ error: 'Product not found' });
// // // //   Object.assign(product, req.body);
// // // //   res.json(product);
// // // // });

// // // // router.delete('/products/:id', (req, res) => {
// // // //   const index = products.findIndex(p => p.id === req.params.id);
// // // //   if (index !== -1) products.splice(index, 1);
// // // //   res.status(204).send();
// // // // });

// // // // let requestCount = 0;
// // // // router.use((req, res, next) => {
// // // //   requestCount++;
// // // //   if (requestCount > 10) {
// // // //     res.status(429).json({ error: 'Too many requests' });
// // // //     requestCount = 0;
// // // //   } else {
// // // //     next();
// // // //   }
// // // // });

// // // // module.exports = router;

// // // const express = require('express');
// // // const router = express.Router();

// // // // Initial products (now 6, enough for pagination tests)
// // // const products = [
// // //   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
// // //   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
// // //   { id: 'prod_0003', name: 'Cotton T-Shirt', price: 19.99, category: 'Clothing' },
// // //   { id: 'prod_0004', name: 'Coffee Mug', price: 9.99, category: 'Home' },
// // //   { id: 'prod_0005', name: 'Novel', price: 14.99, category: 'Books' },
// // //   { id: 'prod_0006', name: 'Backpack', price: 39.99, category: 'Clothing' },
// // // ];

// // // // Rate-limiting counter (shared across requests)
// // // let requestCount = 0;

// // // // ---- Routes ----
// // // router.get('/products', (req, res) => {
// // //   const page = parseInt(req.query.page) || 1;
// // //   const limit = parseInt(req.query.limit) || 10;
// // //   const start = (page - 1) * limit;
// // //   const end = start + limit;
// // //   res.json({
// // //     data: products.slice(start, end),
// // //     total: products.length,
// // //     page,
// // //     totalPages: Math.ceil(products.length / limit),
// // //   });
// // // });

// // // router.get('/products/:id', (req, res) => {
// // //   const product = products.find(p => p.id === req.params.id);
// // //   if (!product) return res.status(404).json({ error: 'Product not found' });
// // //   res.json(product);
// // // });

// // // router.post('/products', (req, res) => {
// // //   const { name, price, category } = req.body;
// // //   if (!name || price === undefined) return res.status(400).json({ error: 'Missing fields' });
// // //   const newProduct = { id: `prod_${Date.now()}`, name, price, category };
// // //   products.push(newProduct);
// // //   res.status(201).json(newProduct);
// // // });

// // // router.put('/products/:id', (req, res) => {
// // //   const product = products.find(p => p.id === req.params.id);
// // //   if (!product) return res.status(404).json({ error: 'Product not found' });
// // //   Object.assign(product, req.body);
// // //   res.json(product);
// // // });

// // // router.delete('/products/:id', (req, res) => {
// // //   const index = products.findIndex(p => p.id === req.params.id);
// // //   if (index !== -1) products.splice(index, 1);
// // //   res.status(204).send();
// // // });

// // // // Rate limiting middleware
// // // router.use((req, res, next) => {
// // //   requestCount++;
// // //   if (requestCount > 10) {
// // //     res.status(429).json({ error: 'Too many requests' });
// // //     requestCount = 0; // reset after triggering
// // //   } else {
// // //     next();
// // //   }
// // // });

// // // // Export both the router and the counter (for testing)
// // // module.exports = router;
// // // module.exports.requestCount = requestCount;
// // // module.exports.resetRequestCount = () => { requestCount = 0; };

// // const express = require('express');
// // const router = express.Router();

// // // More products for pagination tests
// // const products = [
// //   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
// //   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
// //   { id: 'prod_0003', name: 'Cotton T-Shirt', price: 19.99, category: 'Clothing' },
// //   { id: 'prod_0004', name: 'Coffee Mug', price: 9.99, category: 'Home' },
// //   { id: 'prod_0005', name: 'Novel', price: 14.99, category: 'Books' },
// //   { id: 'prod_0006', name: 'Backpack', price: 39.99, category: 'Clothing' },
// // ];

// // let requestCount = 0;

// // // ---- Routes ----
// // router.get('/products', (req, res) => {
// //   const page = parseInt(req.query.page) || 1;
// //   const limit = parseInt(req.query.limit) || 10;
// //   const start = (page - 1) * limit;
// //   const end = start + limit;
// //   res.json({
// //     data: products.slice(start, end),
// //     total: products.length,
// //     page,
// //     totalPages: Math.ceil(products.length / limit),
// //   });
// // });

// // router.get('/products/:id', (req, res) => {
// //   const product = products.find(p => p.id === req.params.id);
// //   if (!product) return res.status(404).json({ error: 'Product not found' });
// //   res.json(product);
// // });

// // router.post('/products', (req, res) => {
// //   const { name, price, category } = req.body;
// //   if (!name || price === undefined) return res.status(400).json({ error: 'Missing fields' });
// //   const newProduct = { id: `prod_${Date.now()}`, name, price, category };
// //   products.push(newProduct);
// //   res.status(201).json(newProduct);
// // });

// // router.put('/products/:id', (req, res) => {
// //   const product = products.find(p => p.id === req.params.id);
// //   if (!product) return res.status(404).json({ error: 'Product not found' });
// //   Object.assign(product, req.body);
// //   res.json(product);
// // });

// // router.delete('/products/:id', (req, res) => {
// //   const index = products.findIndex(p => p.id === req.params.id);
// //   if (index !== -1) products.splice(index, 1);
// //   res.status(204).send();
// // });

// // // Hidden reset endpoint for testing only
// // if (process.env.NODE_ENV === 'test') {
// //   router.post('/test/reset-counter', (req, res) => {
// //     requestCount = 0;
// //     res.status(200).json({ message: 'Counter reset' });
// //   });
// // }

// // // Rate limiting middleware (applied after all routes, so it runs for every /api request)
// // router.use((req, res, next) => {
// //   requestCount++;
// //   if (requestCount > 10) {
// //     res.status(429).json({ error: 'Too many requests' });
// //     requestCount = 0; // reset after triggering
// //   } else {
// //     next();
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();

// // Product data (6 items for pagination tests)
// const products = [
//   { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
//   { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
//   { id: 'prod_0003', name: 'Cotton T-Shirt', price: 19.99, category: 'Clothing' },
//   { id: 'prod_0004', name: 'Coffee Mug', price: 9.99, category: 'Home' },
//   { id: 'prod_0005', name: 'Novel', price: 14.99, category: 'Books' },
//   { id: 'prod_0006', name: 'Backpack', price: 39.99, category: 'Clothing' },
// ];

// let requestCount = 0;

// // ---- Rate limiting middleware (applies to all /api requests, except /test/reset-counter) ----
// router.use((req, res, next) => {
//   // Skip counting for the reset endpoint (only in test mode)
//   if (req.path === '/test/reset-counter' && req.method === 'POST') {
//     return next();
//   }
//   requestCount++;
//   if (requestCount > 10) {
//     res.status(429).json({ error: 'Too many requests' });
//     requestCount = 0; // reset after triggering
//     return; // stop processing
//   }
//   next();
// });

// // ---- Routes ----
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
//   const newProduct = { id: `prod_${Date.now()}`, name, price, category };
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

// // ---- Test-only reset endpoint (exempt from rate limiting) ----
// if (process.env.NODE_ENV === 'test') {
//   router.post('/test/reset-counter', (req, res) => {
//     requestCount = 0;
//     res.status(200).json({ message: 'Counter reset' });
//   });
// }

// module.exports = router;

const express = require('express');
const router = express.Router();

// Product data (6 items for pagination)
const products = [
  { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
  { id: 'prod_0003', name: 'Cotton T-Shirt', price: 19.99, category: 'Clothing' },
  { id: 'prod_0004', name: 'Coffee Mug', price: 9.99, category: 'Home' },
  { id: 'prod_0005', name: 'Novel', price: 14.99, category: 'Books' },
  { id: 'prod_0006', name: 'Backpack', price: 39.99, category: 'Clothing' },
];

let requestCount = 0;

// ---- Rate limiting middleware (applies to all /api requests) ----
router.use((req, res, next) => {
  requestCount++;
  if (requestCount > 10) {
    res.status(429).json({ error: 'Too many requests' });
    requestCount = 0; // reset after triggering
    return;
  }
  next();
});

// ---- Routes ----
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
  const newProduct = { id: `prod_${Date.now()}`, name, price, category };
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

// ---- Export counter and reset function for testing ----
module.exports = router;
module.exports.requestCount = requestCount;
module.exports.resetCounter = () => { requestCount = 0; };