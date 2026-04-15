import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if(!_env.success){
  console.error('Missing or invalid env');
  console.error(z.treeifyError(_env.error));
  process.exit(1);
}

export const ENV = _env.data;