// src/server/router/_app.ts
import { router } from "../trpc";

import { codeforcesRouter } from "./codeforces";

export const appRouter = router({
  codeforces: codeforcesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
