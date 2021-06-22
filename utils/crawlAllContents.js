const cheerio = require("cheerio");

const crawlAllContents = (content, pageNum) => {
  const collectedDatas = [];
  const $ = cheerio.load(content);

  const rawData = Object.entries($("#resultForm > div.results > table > tbody > tr"));

  const dataDummy = [];
  for (let i = 0; i < 100; ++i) {
    const [key, value] = rawData[i];
    if (key === "options" || key === "length") break;
    dataDummy.push(value);
  }

  dataDummy.forEach((row, idx) => {
    const contentList = [];
    const item = row.children;

    for (let tagID = 0; tagID < item.length; ++tagID) {
      if (item[tagID].type !== "tag") continue;
      contentList.push(item[tagID]);
    }

    const [
      bsnsNm,
      bidNtceNoWithOrd,
      bidNtceDetailLink,
      bsnsType,
      bidNtceNm,
      ntceInstNm,
      dmInstNm,
      cntrctMthdNm,
      insertTime,
      dueTime,
      cmmnSpldmd,
      bid,
    ] = valueByIdx(contentList);

    const data = {
      bsnsNm,
      bidNtceNoWithOrd,
      bidNtceDetailLink,
      bsnsType,
      bidNtceNm,
      ntceInstNm,
      dmInstNm,
      cntrctMthdNm,
      insertTime,
      dueTime,
      cmmnSpldmd,
      bid,
    };
    collectedDatas.push({ id: (pageNum - 1) * 100 + idx + 1, content: data });
  });

  return collectedDatas;
};

const valueByIdx = contentList => {
  const valueList = [];

  for (let idx = 0; idx < 10; ++idx) {
    let valueDir = childOf(contentList[idx]);
    let metaDir;

    // Dir 설정 관련 예외처리 :: Idx 1이랑 3이 접근 구조가 다름.
    if (idx === 1 || idx === 3)
      valueDir = childOf(contentList[idx]).children ? childOf(contentList[idx]).children[0] : childOf(contentList[idx]);

    if (idx === 1) metaDir = childOf(contentList[1]).attribs;
    if (idx === 7) metaDir = childOf(contentList[7]).next.next.children[0];

    let valueData, metaData;

    // Data 예외처리
    if (idx === 1 || idx === 7) {
      valueData = valueDir ? valueDir.data : "";
      metaData = idx === 1 ? (metaDir ? metaDir["href"] : "") : metaDir ? metaDir.data.match(/\((.*?)\)/)[1] : "";
    } else if (idx === 8 || idx === 9) {
      valueData = valueDir ? valueDir.title ?? valueDir.data ?? "" : "";
    } else {
      valueData = valueDir ? valueDir.data ?? valueDir.children[0].data : "";
    }

    // 조건부 삽입
    valueList.push(valueData);
    if (idx === 1 || idx === 7) valueList.push(metaData);
  }

  // 2021.06.21 추가 :: 링크를 타고 들어가서 입찰사항제한을 받고, 첨부파일 역시 저장할 수 있어야함.

  return valueList;
};

const childOf = parent => parent.children[0].children[0];

module.exports = { crawlAllContents };
