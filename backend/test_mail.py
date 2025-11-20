import smtplib, ssl
from email.mime.text import MIMEText

host, port, user, pwd = "smtp.gmail.com", 587, "dolo786313@gmail.com", "lonfuqjvkknlobnz"
to = "dolo786313@gmail.com"

msg = MIMEText("Test email from Botnet Detection backend.")
msg["Subject"] = "SMTP Test"
msg["From"] = user
msg["To"] = to

ctx = ssl.create_default_context()
with smtplib.SMTP(host, port) as s:
    s.starttls(context=ctx)
    s.login(user, pwd)
    s.sendmail(user, [to], msg.as_string())
print("OK")
