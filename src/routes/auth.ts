import { z } from "zod"
import { Hono } from "hono"
import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { zValidator } from "@hono/zod-validator"

import {
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
  sendVerificationCode,
  sendWelcomeEmail,
} from "@/lib/mail"
import { db } from "@/lib/db"
import { Variables } from "@/index"
import { generateOtp } from "@/lib/utils"

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters" }),
})

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const tokenSchema = z.object({
  refreshToken: z.string(),
})

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string(),
  password: z.string(),
})

export const auth = new Hono<{ Variables: Variables }>()
  .post("/sign-up", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = await c.req.json()

    try {
      const user = await db.user.findUnique({
        where: { email },
        select: { email: true },
      })

      if (user?.email)
        return c.json(
          { success: false, error: [{ name: "Email already in use" }] },
          406
        )

      const hash_password = await hash(
        password,
        parseInt(process.env.BCRYPT_SALT!)
      )

      const code = generateOtp()

      await db.user.create({
        data: {
          name,
          email,
          password: hash_password,
          verificationCode: code,
          verificationExp: new Date(new Date().getTime() + 15 * 60000),
        },
      })

      await sendVerificationCode({ email, code })

      return c.json({ success: true, message: "User created" }, 201)
    } catch (error) {
      console.log("Auth Register", error)
      return c.json(
        { success: false, error: [{ name: "Something went wrong" }] },
        500
      )
    }
  })
  .post("/verify-email", zValidator("json", verifySchema), async (c) => {
    const { email, code } = await c.req.json()

    try {
      const user = await db.user.findUnique({
        where: { email },
        select: { verificationCode: true, verificationExp: true },
      })

      if (!user?.verificationExp || !user.verificationCode)
        return c.json(
          { success: false, error: [{ name: "User doesn't exist" }] },
          404
        )

      if (new Date() > user.verificationExp)
        return c.json(
          { success: false, error: [{ name: "Verification code expired" }] },
          406
        )

      if (code === user.verificationCode) {
        await db.user.update({
          where: { email },
          data: {
            verificationCode: null,
            verificationExp: null,
            isVerified: true,
          },
        })

        await sendWelcomeEmail({ email })

        return c.json({ success: true, message: "Email verified" }, 200)
      } else {
        return c.json(
          {
            success: false,
            error: [{ name: "Verification code doesn't match" }],
          },
          406
        )
      }
    } catch (error) {
      console.log("Auth Verify Email", error)
      return c.json(
        { success: false, error: [{ name: "Something went wrong" }] },
        500
      )
    }
  })
  .post("/sign-in", zValidator("json", loginSchema), async (c) => {
    const { email, password } = await c.req.json()

    try {
      const user = await db.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true },
      })

      if (!user)
        return c.json(
          { success: false, error: [{ name: "User not found" }] },
          404
        )

      const valid = await compare(password, user.password)

      if (!valid)
        return c.json(
          { success: false, error: [{ name: "Incorrect password" }] },
          401
        )

      const accessToken = sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      })

      const refreshToken = sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!
      )

      await db.user.update({
        where: { id: user.id },
        data: { refreshToken: { push: refreshToken } },
      })

      return c.json(
        {
          success: true,
          message: "User authenticated",
          accessToken,
          refreshToken,
        },
        200
      )
    } catch (error) {
      console.log("Auth Login", error)
      return c.json(
        { success: false, error: [{ name: "Something went wrong" }] },
        500
      )
    }
  })
  .post("/refresh-token", zValidator("json", tokenSchema), async (c) => {
    const { refreshToken } = await c.req.json()

    if (!refreshToken)
      return c.json({ success: false, error: [{ name: "Unauthorized" }] }, 401)

    try {
      verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
        (err: any, payload: any) => {
          if (err)
            return c.json(
              { success: false, error: [{ name: "Unauthorized" }] },
              403
            )

          c.set("id", payload.id)
        }
      )

      const id = c.get("id")

      if (!id)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const user = await db.user.findUnique({
        where: { id },
        select: { refreshToken: true },
      })

      if (!user)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const tokenPresent = user.refreshToken.includes(refreshToken)

      if (!tokenPresent)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const accessToken = sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      })

      const newRefreshToken = sign({ id }, process.env.JWT_REFRESH_SECRET!)

      await db.user.update({
        where: { id },
        data: {
          refreshToken: {
            set: user.refreshToken.filter((t) => t !== refreshToken),
          },
        },
      })

      await db.user.update({
        where: { id },
        data: { refreshToken: { push: newRefreshToken } },
      })

      return c.json(
        {
          success: true,
          message: "Token refreshed",
          accessToken,
          newRefreshToken,
        },
        200
      )
    } catch (error) {
      console.log("Auth Refresh Token", error)
      return c.json(
        { success: false, error: [{ name: "Something went wrong" }] },
        500
      )
    }
  })
  .post("/sign-out", zValidator("json", tokenSchema), async (c) => {
    const { refreshToken } = await c.req.json()

    if (!refreshToken)
      return c.json({ success: false, error: [{ name: "Unauthorized" }] }, 401)

    try {
      verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
        (err: any, payload: any) => {
          if (err)
            return c.json(
              { success: false, error: [{ name: "Unauthorized" }] },
              403
            )

          c.set("id", payload.id)
        }
      )

      const id = c.get("id")

      if (!id)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const user = await db.user.findUnique({
        where: { id },
        select: { refreshToken: true },
      })

      if (!user)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const tokenPresent = user.refreshToken.includes(refreshToken)

      if (!tokenPresent)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      await db.user.update({
        where: { id },
        data: {
          refreshToken: {
            set: user.refreshToken.filter((t) => t !== refreshToken),
          },
        },
      })

      return c.json({ success: true, message: "User Logged Out" }, 200)
    } catch (error) {
      console.log("Auth Logout", error)
      return c.json(
        { success: false, error: [{ name: "Something went wrong" }] },
        500
      )
    }
  })
  .post("/sign-out-all", zValidator("json", tokenSchema), async (c) => {
    const { refreshToken } = await c.req.json()

    if (!refreshToken)
      return c.json({ success: false, error: [{ name: "Unauthorized" }] }, 401)

    try {
      verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
        (err: any, payload: any) => {
          if (err)
            return c.json(
              { success: false, error: [{ name: "Unauthorized" }] },
              403
            )

          c.set("id", payload.id)
        }
      )

      const id = c.get("id")

      if (!id)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const user = await db.user.findUnique({
        where: { id },
        select: { refreshToken: true },
      })

      if (!user)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      const tokenPresent = user.refreshToken.includes(refreshToken)

      if (!tokenPresent)
        return c.json(
          { success: false, error: [{ name: "Unauthorized" }] },
          403
        )

      await db.user.update({
        where: { id },
        data: { refreshToken: { set: [] } },
      })

      return c.json({ success: true, message: "User Logged Out" }, 200)
    } catch (error) {
      console.log("Auth Logout", error)
      return c.json(
        { success: false, error: [{ name: "Something went wrong" }] },
        500
      )
    }
  })
  .post(
    "/forgot-password",
    zValidator("json", forgotPasswordSchema),
    async (c) => {
      const { email } = await c.req.json()

      try {
        const user = await db.user.findUnique({
          where: { email },
          select: { id: true },
        })

        if (!user)
          return c.json(
            { success: false, error: [{ name: "User not found" }] },
            404
          )

        const code = generateOtp()

        await db.user.update({
          where: { email },
          data: {
            verificationCode: code,
            verificationExp: new Date(new Date().getTime() + 30 * 60000),
          },
        })

        await sendResetPasswordEmail({ email, code })

        return c.json({ success: true, message: "OTP sent to email" }, 200)
      } catch (error) {
        console.log("Auth Forgot Password", error)
        return c.json(
          { success: false, error: [{ name: "Something went wrong" }] },
          500
        )
      }
    }
  )
  .post(
    "/reset-password",
    zValidator("json", resetPasswordSchema),
    async (c) => {
      const { email, code, password } = await c.req.json()

      try {
        const user = await db.user.findUnique({
          where: { email },
          select: { verificationCode: true, verificationExp: true },
        })

        if (!user?.verificationExp || !user.verificationCode)
          return c.json(
            { success: false, error: [{ name: "User doesn't exist" }] },
            404
          )

        if (new Date() > user.verificationExp)
          return c.json(
            { success: false, error: [{ name: "Verification code expired" }] },
            406
          )

        if (code === user.verificationCode) {
          const hash_password = await hash(
            password,
            parseInt(process.env.BCRYPT_SALT!)
          )

          await db.user.update({
            where: { email },
            data: {
              verificationCode: null,
              verificationExp: null,
              password: hash_password,
            },
          })

          await sendResetPasswordSuccessEmail({ email })

          return c.json(
            { success: true, message: "Password reset successfully" },
            200
          )
        } else {
          return c.json(
            {
              success: false,
              error: [{ name: "Verification code doesn't match" }],
            },
            406
          )
        }
      } catch (error) {
        console.log("Auth Reset Password", error)
        return c.json(
          { success: false, error: [{ name: "Something went wrong" }] },
          500
        )
      }
    }
  )
