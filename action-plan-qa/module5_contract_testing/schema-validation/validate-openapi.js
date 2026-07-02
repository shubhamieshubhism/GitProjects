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