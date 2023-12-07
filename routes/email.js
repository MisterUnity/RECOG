const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { logger, normalLoggerFormat } = require("../vendor/winston");
const { normalResp } = require("../response");

// Oracle SMTP Service
async function sendTo(emailAddress) {
  // let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.email.ap-singapore-1.oci.oraclecloud.com",
    port: 587,
    secure: false,
    auth: {
      user: "ocid1.user.oc1..aaaaaaaajse5osi4o5lczzh7pn7v7qsvkwrd7pudlsdlond5sthvpypx4gga@ocid1.tenancy.oc1..aaaaaaaa54nhvnh23daqcxt3srdt77urpr6s36rknb7namd2ixkgaibuexda.p5.com",
      pass: "ss5;m2Iak4]VnkZZCt(b",
    },
  });
  let info = await transporter
    .sendMail({
      from: "misterunity2000@oracletestmail.com",
      to: emailAddress,
      subject: "ssh access to 10.0.2.94",
      html: `<b>ssh -i
    deltakey - o ProxyCommand =\"ssh -i
    deltakey - W % h:% p - p 22
    ocid1.bast...oud.com\" -p 22
    opc@10.0.2.94</b > `,
    })
    .catch((err) => {
      logger.error(normalLoggerFormat(`SEND-EMAIL-ERROR:${err}`));
      throw err;
    });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/send-email", async (req, res, next) => {
  try {
    logger.info(normalLoggerFormat(`SEND-EMAIL-START`));
    const { emailAddress } = req.body;
    await sendTo(emailAddress);
    logger.info(normalLoggerFormat(`SEND-EMAIL-END`));
    res.status = 200;
    res.send(normalResp());
    next();
  } catch (err) {
    next(err);
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = router;
