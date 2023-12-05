const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const {logger, normalLoggerFormat} = require('../winston');

// logger
logger.info(normalLoggerFormat('===== GoogleSheet module is loading. ====='));

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
//1Xv2i33xZgM2jKWWWjeymGwGwzumDAUeICbWoldFYAKE
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log('Name, Major:');
  rows.forEach((row) => {
    // Print columns A and E, which correspond to indices 0 and 4.
    console.log(`${row[0]}, ${row[4]}`);
  });
}

// authorize().then(listMajors).catch(console.error);
authorize();
// 上面是原生googlesheet文件初始化範例

// sheets & list - 1
const RecogSheet = '1WvnyaR9E9Aefab02Bwnx5rs-1FGPfSjBcFs8Xbd2P1Y';
const EmployeeList = 'eplyList';
const ManagerList = 'managerList';

// sheets & list - 2 (maybe in the future will be exist)


// 來自官方文黨 - 讀取單一範圍
// 1. 程式碼來源 
// https://developers.google.com/sheets/api/guides/values?hl=zh-tw#read_a_single_range
// 2. 參數怎麼傳
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get?hl=zh-tw
// 3. range如何指定
// https://developers.google.com/sheets/api/guides/concepts?hl=zh-tw#cell
/**
 * Gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 * @return {obj} spreadsheet information
 */
async function getValues(spreadsheetId, range) {
  logger.info(normalLoggerFormat(JSON.stringify({spreadsheetId, range})));
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const numRows = result.data.values ? result.data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

// 來自官方文黨 - 寫入單一範圍
// 1. 程式碼來源 
// https://developers.google.com/sheets/api/guides/values?hl=zh-tw#write_to_a_single_range
// 2. 參數規格
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update?hl=zh-tw&apix_params=%7B%22spreadsheetId%22%3A%221WvnyaR9E9Aefab02Bwnx5rs-1FGPfSjBcFs8Xbd2P1Y%22%2C%22range%22%3A%22%27eplyList%27!A2%3AC2%22%2C%22includeValuesInResponse%22%3Atrue%2C%22valueInputOption%22%3A%22RAW%22%2C%22resource%22%3A%7B%22values%22%3A%5B%5B1%2C2%2C3%5D%5D%2C%22range%22%3A%22%27eplyList%27!A2%3AC2%22%7D%7D
// 3. range如何指定
// https://developers.google.com/sheets/api/guides/concepts?hl=zh-tw#cell
/**
 * Updates values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
async function updateValues(spreadsheetId, range, valueInputOption, _values) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  // WEICHE: 目前我不懂原本程式這麼寫的用意
  // let values = [
  //   [
  //     // Cell values ...
  //   ],
  //   // Additional rows ...
  // ];
  let values = _values;
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log('%d cells updated.', result.data.updatedCells);
    return result;
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err;
  }
}

module.exports = {
  // sheets & list - 1
  RecogSheet,
  EmployeeList,
  ManagerList,
  //sheets & list - 2 ...
  // ...
  //
  getValues,
  updateValues
};