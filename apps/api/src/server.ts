import app from './app.ts';
import { ENV } from '@/core/config/env.ts';
import { testDatabaseConnection } from '@/core/db/index.ts';

async function startServer() {
  await testDatabaseConnection();

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
    console.log(`Docs available at http://localhost:${ENV.PORT}/docs`);
  });
}

startServer();