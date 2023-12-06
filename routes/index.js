const express = require("express");
const { normalResp, normalRespWithData } = require("../response");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// test error logging
router.get("/loggerError", function (req, res, next) {
  try {
    console.logg();
  } catch (err) {
    next(err);
  }
});

// test normal logging
router.get("/loggerNormal", function (req, res, next) {
  try {
    res.status = 200;
    res.send(normalResp());
    next();
  } catch (err) {
    next(err);
  }
});

router.post("/recog", function (req, res, next) {
  try {
    const emplo = "Godfrey";
    // const emploManager = 'Vince';
    res.status = 200;
    res.send(
      normalRespWithData({
        message: `感謝您的評價, ${emplo}及其直屬主管將會收到通知!`,
      })
    );
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
