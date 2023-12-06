const express = require("express");
const { logger, normalLoggerFormat } = require("../vendor/winston");
const { normalRespWithData, errorResp } = require("../response");
const router = express.Router();

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/send-email", (req, res) => {
  const { emailAddress } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "my-email@gmail.com",
      pass: "my-email-password",
    },
  });

  const mailOptions = {
    from: "my-email@gmail.com",
    to: emailAddress,
    subject: "Test Email",
    text: "This is a test email from your application.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Email sent successfully!" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = router;
