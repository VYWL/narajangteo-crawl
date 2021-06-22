const iconv = require("iconv-lite");

function getParams(searchString, fromDate, toDate, pageNum) {
  const tempString = iconv.encode(searchString, "euc-kr");
  const encodedString = escape(tempString.toString("binary"));

  const obj = {
    area: "",
    areaNm: "",
    bidNm: encodedString,
    bidSearchType: 1,
    budget: "",
    budgetCompare: "up",
    detailPrdnm: "",
    detailPrdnmNo: "",
    fromBidDt: fromDate,
    fromOpenBidDt: "",
    industry: "",
    industryCd: "",
    instNm: "",
    instSearchRangeType: "",
    intbidYn: "",
    procmntReqNo: "",
    radOrgan: 1,
    recordCountPerPage: 100, // fix!!
    refNo: "",
    regYn: "Y",
    searchDtType: 1,
    searchType: 1,
    taskClCds: "",
    toBidDt: toDate,
    toOpenBidDt: "",
    currentPageNo: pageNum,
    maxPageViewNoByWshan: 500, // fix!!
  };

  const queryString = getQueryString(obj);

  return queryString;
}

module.exports = { getParams };

const getQueryString = obj => {
  const entries = Object.entries(obj);
  const url = entries.reduce((queryString, item) => queryString + `${item[0]}=${item[1]}&`, "?");

  return url;
};
