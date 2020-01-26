const path = require("path");
const fs = require("fs");
const HTML5ToPDF = require("html5-to-pdf");
const orderHTML = require("../files/orderHTML");
const uniqid = require("uniqid");
const nodemailer = require("nodemailer");
const keys = require("../files/keys");

module.exports = order => {
  return new Promise(async (resolve, reject) => {
    const id = uniqid.time();
    const pdfPath = path.join(__dirname, "..", "..", "tmp", `${id}.pdf`);

    try {
      const htmlString = await orderHTML(order);

      const html5ToPDF = new HTML5ToPDF({
        inputBody: htmlString,
        outputPath: pdfPath,
        include: [path.join(__dirname, "..", "files", "order.css")],
        pdf: {
          scale: 0.8
        },
        launchOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
      });

      await html5ToPDF.start();
      await html5ToPDF.build();
      await html5ToPDF.close();
      console.log("PDF CREATED");

      // Send email

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 25,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: keys.user,
          pass: keys.pass
        }
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `microtilesconfigurator@gmail.com`, // sender address
        to: `info@progettomicro.it`, // list of receivers
        subject: `Microtiles Order ${order.customer.name} ${order.customer.surname}`, // Subject line
        attachments: [
          {
            filename: `${id}.pdf`,
            path: pdfPath
          }
        ]
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      fs.unlinkSync(pdfPath);

      resolve();
    } catch (e) {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }

      reject(e);
    } finally {
    }
  });
};
