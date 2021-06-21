const {getStringFromTxt} = require('./utils/getStringFromTxt.js')
const {getAllData, crawlOneThing} = require('./utils/getAllData.js');

const searchStringList = getStringFromTxt('./keywords.txt');
const [ fromDate = "", toDate = "" ] = getStringFromTxt('./date.txt'); 

if(fromDate === "" || toDate === ""){
    console.log("날짜 입력 오류!\n텍스트를 다시 확인해주세요.");

    return 1;
}

// getAllData(searchStringList,fromDate,toDate);


const testString = searchStringList[0];

crawlOneThing(testString, fromDate, toDate)