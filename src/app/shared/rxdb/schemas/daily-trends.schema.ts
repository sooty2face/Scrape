import { RxJsonSchema } from 'rxdb';

const dailyTrendsSchema: RxJsonSchema = {
    version: 0,
    title: 'daily-trends schema no compression',
    keyCompression: true,
    type: 'object',
    properties: {
        toDoID: {
            type: 'number'
        },
        employeeID: {
            type: 'number'
        },
        title: {
            type: 'string',
            primary: true
        },
        description: {
            type: 'string'
        },
        status: {
            type: 'string',
            enum: ['open', 'completed']
        },
        seq: {
            type: 'number'
        }
    },
    required: ['employeeID', 'title', 'description', 'status'],
    indexes: [
        'toDoID', // <- this will create a simple index for the `firstName` field
        ['toDoID', 'title'] // <- this will create a compound-index for these two fields
    ]
};

export default dailyTrendsSchema;
