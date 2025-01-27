import YAML from 'yamljs';
import path from 'path';

// Charger la spécification Swagger
export const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));