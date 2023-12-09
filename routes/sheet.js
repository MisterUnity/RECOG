const express = require("express");
const { logger, normalLoggerFormat } = require("../vendor/winston");
const { getValues, updateValues } = require("../vendor/googlesheet");
const { normalRespWithData, errorResp } = require("../response");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("sheet apis");
});

router.get("/getdata", async function (req, res, next) {
  try {
    const { query } = req;
    const { sheetID, range } = query;

    logger.info(normalLoggerFormat(JSON.stringify({ sheetID, range })));
    const oRes = await getValues(sheetID, range).catch((err) => {
      throw err;
    });

    if (oRes) {
      res.status = 200;
      res.send(normalRespWithData(oRes));
      next();
    } else {
      res.status = 500;
      res.send(errorResp());
      next();
    }
  } catch (err) {
    next(err);
  }
});

router.put("/updatedata", async function (req, res, next) {
  try {
    const { sheetID, range, valueInputOpt, values } = req.body;
    logger.info(
      normalLoggerFormat(
        JSON.stringify({ sheetID, range, valueInputOpt, values })
      )
    );
    const oRes = await updateValues(
      sheetID,
      range,
      valueInputOpt,
      values
    ).catch((err) => {
      throw err;
    });

    if (oRes) {
      res.status = 200;
      res.send(normalRespWithData(oRes));
      next();
    } else {
      res.status = 500;
      res.send(errorResp());
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
