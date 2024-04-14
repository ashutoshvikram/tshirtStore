const nodemailer=require("nodemailer")

const emailHelper=(option)=>{
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "31771dff12a151",
      pass: "8bbc27fe642063"
    }
  });
      
      const message={
        from: "hi@mailtrap.io", // sender address
        to:  option.to, // list of receivers
        subject: option.subject, // Subject line
        text: option.text, // plain text body
        html: `<h3><a href="${option.myURL}">Click here</a> to reset your password</h3>`, // html body
      }

      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail(message);
       
}
main().catch(console.error);
}

module.exports=emailHelper