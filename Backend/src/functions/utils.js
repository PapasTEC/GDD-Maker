const nodemailer = require("nodemailer");

function generatePasswordCode(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567891!@#$%&_";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

async function sendPasswordCode(to, code) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Papas.GDDMaker2023@gmail.com",
      pass: "xsothefipygozntn",
    },
  });

  var mailOptions = {
    from: "Papas.GDDMaker2023@gmail.com",
    to: to,
    subject: "Welcome to GDD Maker",
    html: `
    <table cellpadding="0" cellspacing="0" border="0" width="70%"  bgcolor="#DAD7CD" style="margin: 0 auto;">
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" width="90%" align="center" bgcolor="#ffffff">
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <h1 style="color: #344e41; font-size: 36px; margin: 0;">Welcome to GDD Maker!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <p style="color: #344e41; font-size: 18px; margin: 0 0 30px;">Thank you for joining our community of game developers. We're excited to have you on board!</p>
              <p style="color: #666666; font-size: 16px; margin: 0 0 30px;">Your one-time use code is: <strong>{${code}}</strong></p>
              <p style="color: #666666; font-size: 18px;">This one-time use code will expire immediately after use.</p>
              <p style="color: #666666; font-size: 16px; margin: 0 0 30px;">If you have any questions or need any assistance, please don't hesitate to contact us.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to " + to + ": " + info.response);
    }
  });
}

module.exports = { generatePasswordCode, sendPasswordCode };
