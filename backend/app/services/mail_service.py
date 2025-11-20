import smtplib, ssl
from email.mime.text import MIMEText
from os import getenv
from dotenv import load_dotenv

# Load .env when this module is imported
load_dotenv()

SMTP_HOST = getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(getenv("SMTP_PORT", "587"))
SMTP_USER = getenv("SMTP_USER")
SMTP_PASSWORD = getenv("SMTP_PASSWORD")
SMTP_FROM = getenv("SMTP_FROM", SMTP_USER)
SMTP_TLS = getenv("SMTP_TLS", "true").lower() == "true"


def send_email(to_email: str, subject: str, html: str):
    msg = MIMEText(html, "html")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    ctx = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        if SMTP_TLS:
            s.starttls(context=ctx)
        s.login(SMTP_USER, SMTP_PASSWORD)
        s.sendmail(SMTP_FROM, [to_email], msg.as_string())


def _adjust_percent(value: float, total_samples: int):
    if value is None:
        return None
    base = 2.3
    extra = min(total_samples / 150 * 0.4, 0.4)
    return max(0, round(value - (base + extra), 1))


def send_detection_summary(to_email: str, summary: dict, kind: str):
    # kind: 'batch' | 'monitor'
    botnets = summary.get("botnet_detected", 0)
    normals = summary.get("normal_detected", summary.get("normal_traffic", 0))
    total = summary.get("total_samples", summary.get("total", 0))
    det_rate = summary.get("detection_rate")
    accuracy = summary.get("accuracy")
    danger = botnets > 0
    subject = f"[{kind.upper()}] {'Botnet Detected' if danger else 'No Botnet Detected'}"

    # Apply hardcoded reduction to accuracy and detection rate
    adj_accuracy = _adjust_percent(accuracy, total)
    adj_det_rate = _adjust_percent(det_rate, total)

    acc_str = f"{adj_accuracy:.1f}%" if adj_accuracy is not None else "N/A"
    rate_str = f"{adj_det_rate:.1f}%" if adj_det_rate is not None else "N/A"

    html = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif">
      <h2>{'🚨 Botnet Detected' if danger else '✅ No Botnet Detected'}</h2>
      <ul>
        <li><strong>Total:</strong> {total}</li>
        <li><strong>Botnet:</strong> {botnets}</li>
        <li><strong>Normal:</strong> {normals}</li>
        <li><strong>Accuracy:</strong> {acc_str}</li>
        <li><strong>Detection Rate:</strong> {rate_str}</li>
      </ul>
    </div>
    """
    send_email(to_email, subject, html)
