const { crawlAllContents } = require("./crawlAllContents.js");
const { fetchEncodedData } = require("./fetchEncodedData.js");
const { getParams } = require("./getParams.js");
const { getConfig } = require("./getConfig.js");
const cheerio = require("cheerio");

let count = 0;
let maxPage = 1000;

const loadPageContent = async (searchString, fromDate, toDate, pageNum) => {
  const params = await getParams(searchString, fromDate, toDate, pageNum);
  const config = await getConfig(params);
  const content = await fetchEncodedData(config);

  return content;
};

const isValidPage = async (searchString, fromDate, toDate, pageNum) => {
  const content = await loadPageContent(searchString, fromDate, toDate, pageNum);

  const $ = cheerio.load(content);

  const title = $("#resultForm > div.results > table > tbody")["0"].attribs.class ?? "";

  return title === "tb_data_none" ? false : true;
};

const getData = async (searchString, fromDate, toDate, pageNum) => {
  return new Promise(async (res, rej) => {
    const content = await loadPageContent(searchString, fromDate, toDate, pageNum);

    const allDataPerPage = await crawlAllContents(content, pageNum);
    count++;

    console.log(`현재 ${Number((count / maxPage) * 100).toFixed(2)} % 진행됨`);

    res(allDataPerPage);
  });
};

const findMaxPageNum = async (searchString, fromDate, toDate) => {
  let L = 1;
  let R = 2000;
  count = 0;

  while (L < R) {
    const mid = parseInt((L + R) / 2);

    const isValid = await isValidPage(searchString, fromDate, toDate, mid);

    if (isValid) L = mid + 1;
    else R = mid;

    if (L === R) maxPage = L - 1;
  }

  return maxPage;
};

const jsonToCSV = jsonData => {
  const json_array = jsonData;

  // json을 csv로 변환한 문자열이 담길 변수
  let csv_string = "";

  // 머릿글 추출
  // const titles = Object.keys(json_array[0].content);
  const titles = [
    "업무",
    "공고번호-차수",
    "공고상세정보",
    "분류",
    "공고명",
    "공고기관",
    "수요기관",
    "계약방법",
    "입력일시",
    "입찰마감일시",
    "공동수급",
    "투찰",
  ];

  // CSV문자열에 제목 삽입. 각 제목은 컴마로 구분
  titles.forEach((title, index) => {
    csv_string += index !== titles.length - 1 ? `${title},` : `${title}\r\n`;
  });

  // 내용 추출
  json_array.forEach((item, index) => {
    const content = item.content;
    let row = "";

    for (let title in content) {
      row += row === "" ? `${content[title].replace(/,/g, "")}` : `,${content[title].replace(/,/g, "")}`;
    }

    csv_string += index !== json_array.length - 1 ? `${row}\r\n` : `${row}`;
  });

  return csv_string;
};

module.exports = {
  loadPageContent,
  isValidPage,
  getData,
  findMaxPageNum,
  jsonToCSV,
};
