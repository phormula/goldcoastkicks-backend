import nodemailer, { TestAccount, createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer'
import LoggerService from '@app/services/Logger.service'
import Mail from 'nodemailer/lib/mailer'

class MailService {
  private transporter!: nodemailer.Transporter

  constructor() {
    this.getTransporter()
  }

  async verifyConnection() {
    return this.transporter.verify()
  }

  async getTransporter() {
    if (process.env.NODE_ENV !== 'production') {
      const testAccount = await createTestAccount()
      this.transporter = createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    } else {
      let account: TestAccount = {
        user: String(process.env.SMTP_USER),
        pass: String(process.env.SMTP_PASSWORD),
        smtp: {
          host: String(process.env.SMTP_HOST),
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465,
        },
        imap: {
          host: String(process.env.IMAP_HOST),
          port: Number(process.env.IMAP_PORT),
          secure: Number(process.env.IMAP_PORT) === 993,
        },
        pop3: {
          host: String(process.env.POP3_HOST),
          port: Number(process.env.POP3_PORT),
          secure: Number(process.env.POP3_PORT) === 995,
        },
        web: '',
      }
      this.transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      })
    }
  }

  async sendMail(mail: Mail.Options) {
    // If there is no sender in payload, set default sender
    const payload = mail
    if (!payload.from) {
      payload.from = process.env.DEFAULT_MAIL_SENDER
    }

    // Send mail
    const mailInfo = await this.transporter.sendMail(payload)

    if (process.env.NODE_ENV !== 'production') {
      LoggerService.logEvents(`Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(mailInfo)}`, 'mail_log.log')
      console.log(`Mail Preview URL is ${getTestMessageUrl(mailInfo)}`)
    } else {
      LoggerService.logEvents(`Mail sent successfully!!`, 'mail_log.log')
      LoggerService.logEvents(`[MailResponse]=${mailInfo.response} [MessageID]=${mailInfo.messageId}`, 'mail_log.log')
    }

    // Return mail response
    return mailInfo
  }
}

export default new MailService()
