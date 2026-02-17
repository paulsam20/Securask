import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Securask API",
      version: "1.0.0"
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
