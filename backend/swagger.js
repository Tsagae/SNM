import swaggerAutogen from 'swagger-autogen';
import config from "config";

const doc = {
    info: {
        version: "1.0.0",
        title: "SNM API",
        description: "SNM Rest API."
    },
    host: `${config.get('server.host')}:${config.get('server.port')}`,
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [],
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc);