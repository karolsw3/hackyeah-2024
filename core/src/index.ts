import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(swagger)
  .get("/", () => "Hello Elysia", {
    body: t.Object({
      message: t.String({
        maxLength: 100,
        minLength: 0
      })
    })
  })
  .listen(3000);

export type CoreApp = typeof app

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
