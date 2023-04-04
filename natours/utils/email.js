const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text')


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `siddhant paudel <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            //sendgrid
            return 1
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }
    // send the actual email
    async send(template, subject) {
        //1 render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstname: this.firstname,
            url: this.url,
            subject
        })

        //2 define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
            //html:
        };

        //3 create a transport and send email
        this.newTransport();
        await this.newTransport().sendMail(mailOptions);

    }

    async sendWelcome() {
        await this.send('welcome', 'welcome to the natours family!')
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'your password reset token ( valid for 10 min only)')
    }
};


