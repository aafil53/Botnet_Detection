import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional
import os


class EmailService:
    """Service for sending email alerts"""
    
    def __init__(self):
        # Gmail SMTP settings (you can use other providers)
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        # These should be environment variables in production
        self.sender_email = os.getenv("SENDER_EMAIL", "your-email@gmail.com")
        self.sender_password = os.getenv("SENDER_PASSWORD", "your-app-password")
        
    async def send_botnet_alert(
        self,
        recipient_email: str,
        detection_details: dict
    ) -> bool:
        """Send botnet detection alert email"""
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = "🚨 ALERT: Botnet Activity Detected!"
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # Create HTML email body
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; border-radius: 10px;">
                        <h1>🚨 Botnet Activity Detected</h1>
                        <p style="font-size: 16px;">Critical security alert from your Botnet Detection System</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; margin-top: 20px; border-radius: 10px;">
                        <h2>Detection Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">{detection_details.get('timestamp', 'N/A')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Model Used:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">{detection_details.get('model', 'N/A')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Confidence:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">{detection_details.get('confidence', 0):.2%}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Probability:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">{detection_details.get('probability', 0):.2%}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                        <strong>⚠️ Recommended Actions:</strong>
                        <ul>
                            <li>Isolate affected network segments</li>
                            <li>Review firewall rules</li>
                            <li>Check for suspicious connections</li>
                            <li>Monitor system logs</li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center; color: #666;">
                        <p>This is an automated alert from your Botnet Detection System</p>
                        <p style="font-size: 12px;">Powered by AI-Driven Network Security</p>
                    </div>
                </body>
            </html>
            """
            
            # Attach HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_server,
                port=self.smtp_port,
                start_tls=True,
                username=self.sender_email,
                password=self.sender_password,
            )
            
            print(f"✅ Alert email sent to {recipient_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False


# Global instance
email_service = EmailService()
