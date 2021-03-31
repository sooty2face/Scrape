import { RxJsonSchema } from 'rxdb';

const dailyTrendsSchema: RxJsonSchema = {
    version: 0,
    title: 'daily-trends schema no compression',
    keyCompression: true,
    type: 'array',
    properties: {
        items: {
            type: 'number'
        }
    },
    required: [''],
    indexes: [
        'toDoID', // <- this will create a simple index for the `firstName` field
        ['toDoID', 'title'] // <- this will create a compound-index for these two fields
    ]
};

export default dailyTrendsSchema;
