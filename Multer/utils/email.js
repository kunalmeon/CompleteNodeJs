/*
Node.js provides nodemailer package to use services that carry or trasnsport out email. So
let us import it and use it.
*/
const nodemailer = require("nodemailer");

/*Now it has transport method that uses the service like gmail,mailgun and anyone we want. For testing purspose 
we will use mailtrap which is free and all the mail sent will placed inside it. */

//Note sending email is async function
const sendEmail = async (options) => {
  /*while creating transport we need to specify multiple things like infromation about the service provider.
   We also need to specify the one who is using this service in order to send email inside the auth object.
   In this case i am sending so i will put my username and password.Summary sender ,serviceProvider and reciever
    Best place is to save them inside the settings.env file. 
    */
  //createTransport() method return value so we saved it.
  console.log(options.message);
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2 define mailOption or let us say details about the email. VVIMP: order of mailOption object must be as
  // from ,to ,subject,text otherwise we not see the fields if they are missmatched.
  const mailOptions = {
    from: "Admin <admin@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //let us trigger transporter
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

/*Summary:pass email contnet message and etc as option in a function that will send the email.
FIrst we crate transporter and then we extract the detail from the option and finally we trigger transporter 
with the details.  */
