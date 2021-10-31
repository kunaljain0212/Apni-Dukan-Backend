import * as nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.gmailID,
    pass: process.env.gmailPassword,
  },
});

class MailerService {
  /**
   *
   * @param {string} mail - mailId of user
   * @param {integer} otp - otp
   */
  async sendPasswordResetEmail(email: string, name: string, otp: number) {
    try {
      const mailOptions = {
        from: process.env.gmailId,
        to: email,
        subject: `OTP to Reset Apni Dukan Account Password`,
        text: `Dear ${name}, \n OTP to reset your account password is ${otp}. \n OTP expires after 1 hour.`,
      };
      this.triggerMail(mailOptions);
    } catch (err) {
      throw err;
    }
  }

  async triggerMail(mailOptions: object) {
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      throw err;
    }
  }
}

export default new MailerService();
