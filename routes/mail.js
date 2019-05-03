const nodemailer = require('nodemailer');

module.exports.sendMail = (userid, subject, body) => {
    console.log("reached")

    var smtpConfig = {
        pool: true,
        host: 'mail.jeraldvictor.co.in',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'math@jeraldvictor.co.in',
            pass: 'Johnpeter@17'
        }
    }

    let transporter = nodemailer.createTransport(smtpConfig);
  
    let mailOptions = {
      from: 'math@jeraldvictor.co.in',
      to: userid,
      subject: subject,
      html: body
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

// let subject = "Jerald's config"
// let body = "hey its jerald from new mail"
// sendMail("fly2jeraldvictor1999@gmail.com", subject, body)