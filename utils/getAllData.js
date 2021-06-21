const fs = require('fs');
const functions = require('./functions.js'); 
const { getData, findMaxPageNum, jsonToCSV } = functions;

const getAllData = async (searchStringList, fromDate, toDate, fileName = "") => {

    for(let i = 0; i < searchStringList.length; ++i) 
        await crawlOneThing(searchStringList[i],fromDate, toDate, fileName)
  
}

const crawlOneThing = async (searchString, fromDate, toDate, fileName = "") => {

    const nowSearchString = searchString === "" ? "[전체 검색]" : searchString;

    console.log(`검색어 : ${nowSearchString}`);
    console.log(`검색 기간 : ${fromDate} ~ ${toDate}`);
  
    console.log(`검색 조건에 따른 최대 페이지 조회중...`);
    const maxPage = await findMaxPageNum(searchString,fromDate, toDate);
    console.log(`조회 완료! (MaxPageNum : ${maxPage})`)
  
    const promises = [];
    for(let pageNum = 1; pageNum <= maxPage; ++pageNum) {
      promises.push(getData(searchString,fromDate, toDate, pageNum));
    }
  
    const result = await Promise.all(promises);
    const totalDataArray = result.reduce((acc, item) => [...acc, ...item],[]);

    const fnStr = fileName !== "" ? fileName : `./files/${nowSearchString} (${dateFormat(fromDate)}~${dateFormat(toDate)}).csv`;
  
    fs.writeFileSync(fnStr, '\uFEFF' + jsonToCSV(totalDataArray));
  
}

const dateFormat = str => str.split('/').join('.');

module.exports = { getAllData, crawlOneThing };