import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Securask API',
      version: '1.0.0',
      description: 'Secure Task Management API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register user',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Success' } },
        },
      },
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get all tasks',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get a single task by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'The Task ID',
            },
          ],
          responses: {
            200: { description: 'Success' },
            404: { description: 'Task not found' }
          },
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'The Task ID (copy this from the GET response)',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    completed: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Updated successfully' } },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'The Task ID',
            },
          ],
          responses: { 200: { description: 'Deleted successfully' } },
        },
      },
      '/api/sticky-notes': {
        get: {
          tags: ['Sticky Notes'],
          summary: 'Get all sticky notes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          tags: ['Sticky Notes'],
          summary: 'Create sticky note',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    color: { type: 'string', enum: ['yellow', 'pink', 'blue', 'green', 'purple', 'gray'] },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/sticky-notes/reorder': {
        put: {
          tags: ['Sticky Notes'],
          summary: 'Reorder sticky notes',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orderedIds: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Reordered' } },
        },
      },
      '/api/sticky-notes/{id}': {
        put: {
          tags: ['Sticky Notes'],
          summary: 'Update sticky note',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    color: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          tags: ['Sticky Notes'],
          summary: 'Delete sticky note',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/calendar-tasks': {
        get: {
          tags: ['Calendar Tasks'],
          summary: 'Get all calendar tasks',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          tags: ['Calendar Tasks'],
          summary: 'Create calendar task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'time', 'date'],
                  properties: {
                    title: { type: 'string' },
                    time: { type: 'string' },
                    date: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/calendar-tasks/{id}': {
        put: {
          tags: ['Calendar Tasks'],
          summary: 'Update calendar task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    time: { type: 'string' },
                    date: { type: 'string' },
                    description: { type: 'string' },
                    completed: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          tags: ['Calendar Tasks'],
          summary: 'Delete calendar task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: { 200: { description: 'Deleted' } },
        },
      },
    },
  },
  apis: [],
};

export default swaggerJsdoc(options);