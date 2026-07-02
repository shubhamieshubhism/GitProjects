const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadApp(filePath) {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  const url = `https://api-cloud.browserstack.com/app-automate/upload`;
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  const response = await axios.post(url, formData, {
    auth: { username, password: accessKey },
    headers: formData.getHeaders()
  });
  return response.data.app_url;
}

module.exports = { uploadApp };
