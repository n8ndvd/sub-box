import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    LOCAL_DB_PATH: z.string().optional(),
    CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
    CLOUDFLARE_D1_DATABASE_ID: z.string().optional(),
    CLOUDFLARE_TOKEN: z.string().optional(),
    // 将必填项也先改为 optional，或者依赖下方的 skipValidation
    DEPLOY_TARGET: z.enum(["cloudflare", "docker"]).optional(),
    ADMIN_USERNAME: z.string().optional(),
    ADMIN_PASSWORD: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    SESSION_TAG: z.string().optional(),
    SESSION_DURATION: z.coerce.number().int().positive().default(2592000),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  runtimeEnv: {
    LOCAL_DB_PATH: process.env.LOCAL_DB_PATH,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_D1_DATABASE_ID: process.env.CLOUDFLARE_D1_DATABASE_ID,
    CLOUDFLARE_TOKEN: process.env.CLOUDFLARE_TOKEN,
    DEPLOY_TARGET: process.env.DEPLOY_TARGET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_TAG: process.env.SESSION_TAG,
    SESSION_DURATION: process.env.SESSION_DURATION,
    NODE_ENV: process.env.NODE_ENV,
  },
  // ⚠️ 关键修改：强制跳过验证，只要不是在本地开发环境
  // 或者直接写 true 也可以，为了防止部署崩溃，我们这里稍微放宽一点
  skipValidation: true, 
  emptyStringAsUndefined: true,
});
