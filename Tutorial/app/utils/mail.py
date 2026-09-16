import resend
from typing import List
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


async def send_otp_email(emails: List[str], otp: str):
    html = f"<p>Your OTP for CFUP is <strong>{otp}</strong>. It will expire in 5 minutes.</p>"
    resend.Emails.send({
        "from": "CFUpsolve <onboarding@resend.dev>",
        "to": emails,
        "subject": "Otp for CFUP",
        "html": html,
    })
    return {"status": "ok", "message": "email sent successfully"}


async def send_welcome_email(emails: List[str], username: str):
    html = f"""<html><body>
    <h2>Welcome to CFUpsolve! 🎉</h2>
    <p>Hi {username},</p>
    <p>Welcome to <strong>CFUpsolve (CFUP)</strong>! We're excited to have you join us.</p>
    <p>CFUP is built to help you practice Codeforces problems, improve your problem-solving skills, and track your progress.</p>
    <p>Your account has been successfully created and you're ready to get started.</p>
    <p><strong>Happy coding! 🚀</strong></p>
    <p>— The CFUpsolve Team</p>
    </body></html>"""
    resend.Emails.send({
        "from": "CFUpsolve <onboarding@resend.dev>",
        "to": emails,
        "subject": "Welcome To CFUP",
        "html": html,
    })
    return {"status": "ok", "message": "email sent successfully"}


async def send_forget_password_mail(emails: List[str], token: str):
    html = f"""<p>Your password reset link for CFUP is:</p>
    <p><a href="{settings.FRONTEND_API}/reset-password?token={token}">Reset your password</a></p>
    <p>This link will expire in 30 minutes.</p>"""
    resend.Emails.send({
        "from": "CFUpsolve <onboarding@resend.dev>",
        "to": emails,
        "subject": "Reset Password for CFUP",
        "html": html,
    })
    return {"status": "ok", "message": "email sent successfully"}