import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger Configuration
 * This file defines the OpenAPI 3.0 specification for the Securask API.
 * It provides a structured overview of all endpoints, including:
 * - Request body schemas
 * - Response formats
 * - Security requirements (JWT Bearer Auth)
 * - Parameter definitions
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Securask API',
      version: '1.0.0',
      description: 'Secure Task Management API supporting Kanban boards, Sticky Notes, and Calendars.',
    },
    // Global Security Configuration
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Endpoint Documentation
    paths: {
      // 1. Authentication Endpoints
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
      // 2. Task Management Endpoints
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get all tasks for the certified user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['active', 'progress', 'completed'] },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] },
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
              description: 'The MongoDB Object ID of the task',
            },
          ],
          responses: {
            200: { description: 'Success' },
            404: { description: 'Task not found' }
          },
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update a task document',
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
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string' },
                    priority: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Updated successfully' } },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Remove a task',
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
      // 3. Sticky Notes Endpoints
      '/api/sticky-notes': {
        get: {
          tags: ['Sticky Notes'],
          summary: 'List user notes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          tags: ['Sticky Notes'],
          summary: 'Pin a new note',
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
          summary: 'Save drag-and-drop order',
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
          summary: 'Modify note content',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
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
          summary: 'Discard note',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      // 4. Calendar Endpoints
      '/api/calendar-tasks': {
        get: {
          tags: ['Calendar Tasks'],
          summary: 'List user appointments',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          tags: ['Calendar Tasks'],
          summary: 'Schedule new event',
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
          summary: 'Edit event details',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
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
          summary: 'Cancel event',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
    },
  },
  apis: [],
};

export default swaggerJsdoc(options);