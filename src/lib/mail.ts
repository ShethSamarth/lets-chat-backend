import { createTransport } from "nodemailer"

import {
  PASSWORD_RESET_EMAIL,
  RESET_CODE_EMAIL,
  VERIFICATION_CODE_EMAIL,
  WELCOME_EMAIL,
} from "@/constants/email-templates"

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const from = "'Samarth Sheth 😎' <socialmediaapp07@gmail.com>"

export const sendWelcomeEmail = async ({ email }: { email: string }) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Welcome! 🎉 Your Journey Starts Here",
      html: WELCOME_EMAIL,
    })
  } catch (error) {
    console.error("Error sending welcome email: ", error)
  }
}

export const sendVerificationCode = async ({
  email,
  code,
}: {
  email: string
  code: string
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_CODE_EMAIL.replace("{code}", code),
    })
  } catch (error) {
    console.error("Error sending verification code email: ", error)
  }
}

export const sendResetPasswordEmail = async ({
  email,
  code,
}: {
  email: string
  code: string
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Password reset",
      html: RESET_CODE_EMAIL.replace("{code}", code),
    })
  } catch (error) {
    console.error("Error sending reset password code email: ", error)
  }
}

export const sendResetPasswordSuccessEmail = async ({
  email,
}: {
  email: string
}) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Password reset successful",
      html: PASSWORD_RESET_EMAIL,
    })
  } catch (error) {
    console.error("Error sending success reset password email: ", error)
  }
}
