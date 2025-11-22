from flask_mail import Message
from flask import current_app
import os
from ..extensions import mail


def _branding_context():
    return {
        'app_name': os.getenv('APP_NAME', 'ESG Analytics'),
        'support_email': os.getenv('SUPPORT_EMAIL', os.getenv('MAIL_USERNAME')),
    }


def send_verification_email(user_email, token):
    frontend = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    verification_url = f"{frontend}/verify-email?token={token}"

    msg = Message(
        subject='Verify Your Email - ESG Analytics',
        sender=os.getenv('MAIL_USERNAME'),
        recipients=[user_email],
    )

    msg.body = f"Verify your email by opening: {verification_url}\nIf you did not request this, ignore this email."
    msg.html = f"""
      <div style="background:#0b1220;padding:24px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#e5e7eb">
          <tr>
            <td style="padding:24px 24px 0 24px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="display:inline-block;padding:8px;border-radius:10px;background:#0ea5e91a;border:1px solid #0ea5e933"></span>
                <div>
                  <div style="font-weight:700;color:#f3f4f6">ESG Analytics</div>
                  <div style="font-size:12px;color:#9ca3af">AI‑Powered Insights</div>
                </div>
              </div>
              <h2 style="margin:18px 0 8px;font-size:22px;color:#f3f4f6">Verify your email</h2>
              <p style="margin:0 0 16px;color:#cbd5e1">Please confirm your email address to finish setting up your account.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px 24px">
              <a href="{verification_url}" style="display:inline-block;background:#0ea5e9;color:#0b1220;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:10px">Verify Email</a>
              <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;word-break:break-all">If the button doesn’t work, copy and paste this link into your browser:<br/>{verification_url}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px 24px;color:#64748b;font-size:12px">If you didn’t request this, you can safely ignore this email.</td>
          </tr>
        </table>
      </div>
    """

    try:
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Email send error: {e}")
        return False


def send_reset_otp_email(user_email, otp):
    msg = Message(
        subject='Password Reset OTP - ESG Analytics',
        sender=os.getenv('MAIL_USERNAME'),
        recipients=[user_email],
    )
    msg.body = f"Your password reset OTP is: {otp}\nIt expires in 15 minutes."
    msg.html = f"""
      <div style="background:#0b1220;padding:24px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#e5e7eb">
          <tr><td style="padding:24px 24px 0 24px"><h2 style="margin:0 0 8px;font-size:22px;color:#f3f4f6">Password reset OTP</h2>
          <p style="margin:0 0 14px;color:#cbd5e1">Use this 6‑digit code to reset your password. It expires in 15 minutes.</p></td></tr>
          <tr><td style="padding:0 24px 20px 24px">
            <div style="display:inline-block;padding:12px 16px;background:#111827;color:#60a5fa;border-radius:10px;border:1px solid #1f2937;letter-spacing:6px;font-weight:800">{otp}</div>
          </td></tr>
        </table>
      </div>
    """

    try:
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Email send error: {e}")
        return False


def send_verify_otp_email(user_email, otp):
    msg = Message(
        subject='Verify Your Email - OTP',
        sender=os.getenv('MAIL_USERNAME'),
        recipients=[user_email],
    )
    msg.body = f"Your email verification OTP is: {otp}\nIt expires in 15 minutes."
    msg.html = f"""
      <div style="background:#0b1220;padding:24px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#e5e7eb">
          <tr><td style="padding:24px 24px 0 24px"><h2 style="margin:0 0 8px;font-size:22px;color:#f3f4f6">Verify your email</h2>
          <p style="margin:0 0 14px;color:#cbd5e1">Enter the following 6‑digit code to verify your email address.</p></td></tr>
          <tr><td style="padding:0 24px 20px 24px">
            <div style="display:inline-block;padding:12px 16px;background:#111827;color:#60a5fa;border-radius:10px;border:1px solid #1f2937;letter-spacing:6px;font-weight:800">{otp}</div>
          </td></tr>
        </table>
      </div>
    """

    try:
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Email send error: {e}")
        return False


def send_welcome_email(user_email, company_name=None):
    frontend = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    msg = Message(
        subject='Welcome to ESG Analytics Dashboard!',
        sender=os.getenv('MAIL_USERNAME'),
        recipients=[user_email],
    )
    msg.body = f"Welcome to ESG Analytics! You can log in here: {frontend}/login"
    msg.html = f"""
      <div style="background:#0b1220;padding:24px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#e5e7eb">
          <tr><td style="padding:24px 24px 0 24px">
            <h2 style="margin:0 0 8px;font-size:22px;color:#f3f4f6">Welcome to ESG Analytics!</h2>
            <p style="margin:0 0 14px;color:#cbd5e1">{'Hi ' + company_name + ',' if company_name else 'Hi,'} your account is verified. You can now sign in and start exploring insights.</p>
          </td></tr>
          <tr><td style="padding:0 24px 20px 24px">
            <a href="{frontend}/login" style="display:inline-block;background:#0ea5e9;color:#0b1220;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:10px">Go to Login</a>
          </td></tr>
        </table>
      </div>
    """

    try:
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Email send error: {e}")
        return False
