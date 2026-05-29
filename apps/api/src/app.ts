import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { notFoundMiddleware } from '@middlewares/notFound.ts';
import { errorHandlerMiddleware } from '@middlewares/errorHandler.ts';
import v1Router from '@/routes/v1/index.ts';
import { ENV } from '@/core/config/env.ts';

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (ENV.ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({ message: 'Hola Mundo' });
});

app.use('/api/v1', v1Router);

// globals middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
