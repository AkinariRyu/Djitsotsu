import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: Number(this.config.get('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendOtpCode(email: string, code: string) {
    const mailOptions = {
      from: `"Djitsotsu Admin" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: 'Verification Code // Djitsotsu',
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; border: 4px solid #000; padding: 20px; background-color: #f8f8f4;">
          <h1 style="text-transform: uppercase; border-bottom: 4px solid #000; padding-bottom: 10px;">Verification Step</h1>
          <p style="font-weight: bold; font-size: 16px;">Hello! Your one-time code to access Djitsotsu is:</p>
          <div style="background: #000; color: #fff; font-size: 32px; font-weight: 900; padding: 15px; text-align: center; letter-spacing: 10px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #666;">This code expires in 5 minutes. If you didn't request this, ignore this scroll.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Mail successfully sent to ${email}`);
    } catch (error) {
      this.logger.error(`Mail delivery failed to ${email}`, error);
    }
  }
}