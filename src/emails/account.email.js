const sgMail = require("@sendgrid/mail");
require('dotenv').config();

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
  .send({
    to: email,
    from: "oluwatunmiseadenuga@gmail.com",
    subject: "Thanks for joining in!!",
    text: `Welcome to the app, ${name}`,
  })
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
}

module.exports = {
  sendWelcomeEmail
}
