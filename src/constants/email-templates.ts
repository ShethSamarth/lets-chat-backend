export const WELCOME_EMAIL = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome</title>
    </head>
    <body
        style="
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        "
    >
        <div
        style="
            background: linear-gradient(to right, #4caf50, #45a049);
            padding: 20px;
            text-align: center;
        "
        >
        <h1 style="color: white; margin: 0">Welcome</h1>
        </div>
        <div
        style="
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        "
        >
        <p>Hello,</p>
        <p>
            Thank you for signing up. We&apos;re thrilled to have you join our community.
        </p>
        <div style="text-align: center; margin: 30px 0">
            <div
            style="
                background-color: #4caf50;
                color: white;
                width: 50px;
                height: 50px;
                line-height: 50px;
                border-radius: 50%;
                display: inline-block;
                font-size: 30px;
            "
            >
            ✓
            </div>
        </div>
        <p>
            We look forward to seeing you around and hope you enjoy your experience
            with us.
        </p>
        <p style="font-weight: bold">Best regards,<br />Samarth Sheth</p>
        </div>
        <div
        style="
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 0.8em;
        "
        >
        <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>
`

export const VERIFICATION_CODE_EMAIL = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
    </head>
    <body
        style="
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        "
    >
        <div
        style="
            background: linear-gradient(to right, #4caf50, #45a049);
            padding: 20px;
            text-align: center;
        "
        >
        <h1 style="color: white; margin: 0">Verify Your Email</h1>
        </div>
        <div
        style="
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        "
        >
        <p>Hello,</p>
        <p>Thank you for signing up! Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0">
            <span
            style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #4caf50;
            "
            >{code}</span
            >
        </div>
        <p>
            Enter this code on the verification page to complete your registration.
        </p>
        <p>This code will expire in 15 minutes for security reasons.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p style="font-weight: bold">Best regards,<br />Samarth Sheth</p>
        </div>
        <div
        style="
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 0.8em;
        "
        >
        <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>
`

export const RESET_CODE_EMAIL = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
    </head>
    <body
        style="
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        "
    >
        <div
        style="
            background: linear-gradient(to right, #4caf50, #45a049);
            padding: 20px;
            text-align: center;
        "
        >
        <h1 style="color: white; margin: 0">Password Reset</h1>
        </div>
        <div
        style="
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        "
        >
        <p>Hello,</p>
        <p>
            We received a request to reset your password. If you didn't make this
            request, please ignore this email.
        </p>
        <p>Enter this code on the verification page to reset your password:</p>
        <div style="text-align: center; margin: 30px 0">
            <span
            style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #4caf50;
            "
            >{code}</span
            >
        </div>
        <p>This code will expire in 15 minutes for security reasons.</p>
        <p style="font-weight: bold">Best regards,<br />Samarth Sheth</p>
        </div>
        <div
        style="
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 0.8em;
        "
        >
        <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>
`

export const PASSWORD_RESET_EMAIL = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Successful</title>
    </head>
    <body
        style="
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        "
    >
        <div
        style="
            background: linear-gradient(to right, #4caf50, #45a049);
            padding: 20px;
            text-align: center;
        "
        >
        <h1 style="color: white; margin: 0">Password Reset Successful</h1>
        </div>
        <div
        style="
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        "
        >
        <p>Hello,</p>
        <p>
            We're writing to confirm that your password has been successfully reset.
        </p>
        <div style="text-align: center; margin: 30px 0">
            <div
            style="
                background-color: #4caf50;
                color: white;
                width: 50px;
                height: 50px;
                line-height: 50px;
                border-radius: 50%;
                display: inline-block;
                font-size: 30px;
            "
            >
            ✓
            </div>
        </div>
        <p>
            If you did not initiate this password reset, please contact our support
            team immediately.
        </p>
        <p>For security reasons, we recommend that you:</p>
        <ul>
            <li>Use a strong, unique password</li>
            <li>Avoid using the same password across multiple sites</li>
        </ul>
        <p>Thank you for helping us keep your account secure.</p>
        <p style="font-weight: bold">Best regards,<br />Samarth Sheth</p>
        </div>
        <div
        style="
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 0.8em;
        "
        >
        <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>
`
