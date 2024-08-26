import { Hono } from "hono"
import { verify } from "jsonwebtoken"

import { auth } from "@/routes/auth"

export type Variables = {
  id: string
}

const app = new Hono<{ Variables: Variables }>()

app.use("/api/*", async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1]

  if (!token)
    return c.json({ success: false, error: [{ name: "Unauthorized" }] }, 401)

  verify(token, process.env.JWT_SECRET!, (err, payload: any) => {
    if (err)
      return c.json({ success: false, error: [{ name: "Unauthorized" }] }, 403)

    c.set("id", payload.id)
  })

  await next()
})

app.route("/auth", auth)

export default app
