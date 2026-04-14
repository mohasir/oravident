import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { notFoundMiddleware } from './middlewares/notFound.ts';
import { errorHandlerMiddleware } from './middlewares/errorHandler.ts';

// Load OpenAPI
// const openapiPath = path.join(process.cwd(), 'openapi.yaml');
// const openapiDocument = YAML.load(openapiPath);

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiDocument));

import v1Router from '@/routes/v1/index.ts';

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo' });
});

app.use('/api/v1', v1Router);

//globals middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Docs available at http://localhost:${port}/docs`);
});
