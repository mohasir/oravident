import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { notFoundMiddleware } from '@middlewares/notFound.ts';
import { errorHandlerMiddleware } from '@middlewares/errorHandler.ts';
import v1Router from '@/routes/v1/index.ts';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

const swaggerDocument = YAML.load(path.join(__dirname, './docs/openapi.yaml'));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo' });
});

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', v1Router);

// globals middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
