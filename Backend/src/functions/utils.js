const nodemailer = require("nodemailer");

function generatePasswordCode(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}


async function sendEmail(to, code, type) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Papas.GDDMaker2023@gmail.com",
      pass: "xsothefipygozntn",
    },
  });

  var msg = ["", "", "", "", ""];
  switch (type) {
    case "reset":
      msg = ["Welcome back to GDD Maker!", "Thank you for being a part of the GDD Maker community. We're excited to see you again!", `Your one-time use code is: <strong>{${code}}</strong>`, "This one-time use code will expire immediately after use.", "If you have any questions or need any assistance, please don't hesitate to contact us."]
      break;
    case "welcome":
      msg = ["Welcome to GDD Maker!","Thank you for joining our community of game developers. We're excited to have you on board!", "Welcome to our website. We want to inform you that for your convenience, we do not use passwords on our platform. Instead, each time you log in, you will be sent a one-time use code.",  "This code will expire immediately after use.", "If you have any questions or need any assistance, please don't hesitate to contact us." ]
  }

  var mailOptions = {
    from: "Papas.GDDMaker2023@gmail.com",
    to: to,
    subject: msg[0],
    html: `
    <table cellpadding="0" cellspacing="0" border="0" width="70%"  bgcolor="#DAD7CD" style="margin: 0 auto;">
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" width="90%" align="center" bgcolor="#ffffff">
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <h1 style="color: #344e41; font-size: 36px; margin: 0;">${msg[0]}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <p style="color: #344e41; font-size: 18px; margin: 0 0 30px;">${msg[1]}</p>
              <p style="color: #666666; font-size: 16px; margin: 0 0 30px;">${msg[2]}</p>
              <p style="color: #666666; font-size: 18px;">${msg[3]}</p>
              <p style="color: #666666; font-size: 16px; margin: 0 0 30px;">${msg[4]}</p>
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

module.exports = { generatePasswordCode, sendEmail };
