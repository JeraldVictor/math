const nodemailer = require('nodemailer');

module.exports.sendMail = (userid, subject, body) => {
    console.log("reached")
    let transporter = nodemailer.createTransport({
      // pool: true,
      host: "gains.arrowappscloud.com",
      port: 465,
      secure: true,
      auth: {
        user: "_mainaccount@victorwebtec.in", // generated ethereal user
        pass: "?oa7#A&,4WGW" // generated ethereal password
      }
    });
  
    let mailOptions = {
      from: 'victorwebtec@victorwebtec.in',
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