const { makeExecutableSchema } = require('@graphql-tools/schema');

const products = [
  { id: 'prod_0001', name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { id: 'prod_0002', name: 'Smart Watch', price: 199.99, category: 'Electronics' },
];

const typeDefs = `
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
`;

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
      const p = { id: `prod_${Date.now()}`, name, price, category };
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