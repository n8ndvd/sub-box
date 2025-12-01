import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { type DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";

export type Database = DrizzleD1Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  client?: D1Database;
};

export let client: D1Database | undefined;

export const db = async () => {
  // 1. 尝试获取 Cloudflare 上下文
  let context;
  try {
    context = await getCloudflareContext({ async: true });
  } catch (e) {
    console.error("❌ Failed to get Cloudflare context:", e);
  }

  // 2. 尝试从上下文中获取 DB binding
  const dbBinding = context?.env?.DB;

  // 3. 复用连接或创建新连接
  client = globalForDb.client ?? dbBinding;

  if (!client) {
    // ⚠️ 如果这里打印出来了，说明 wrangler.toml 里的 binding 没生效，或者 context 获取失败
    console.error("❌ CRITICAL ERROR: D1 Database binding 'DB' is undefined!");
    console.error("Available env keys:", context?.env ? Object.keys(context.env) : "no env");
    
    // 抛出一个更清晰的错误，而不是让 drizzle 报 'run' undefined
    throw new Error("Database binding is missing. Please check wrangler.toml binding name.");
  }

  // 开发环境下缓存连接
  if (process.env.NODE_ENV !== "production") {
    globalForDb.client = client;
  }

  return drizzle(client, { schema });
};
```

---

### 操作步骤

1.  **修改代码**：按上面的内容更新这两个文件。
2.  **提交代码**：
    ```bash
    git add .
    git commit -m "fix: relax env validation and improve db connection logging"
    git push
