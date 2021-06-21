const axios = require("axios");
const iconv = require('iconv-lite')

async function fetchEncodedData(config) {
    const { data } = await axios(config);

    const encodedData = iconv.decode(data, "EUC-KR").toString();

    return encodedData;
}

module.exports = { fetchEncodedData }