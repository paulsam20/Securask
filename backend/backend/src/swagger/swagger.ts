import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Securask API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    paths: {
      '/api/tasks': {
        get: {
          summary: 'Get all user tasks',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } }
        },
        post: {
          summary: 'Create a new task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Created' } }
        }
      }
    }
  },
  apis: [] // No longer searching for comments in routes
};

export default swaggerJsdoc(options);