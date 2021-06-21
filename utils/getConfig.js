const fetchURL = `http://www.g2b.go.kr:8101/ep/tbid/tbidList.do`;

const getConfig = (params) => {
    return {
        method : "get",
        url : fetchURL + params,
        responseType : "arraybuffer"
    }
}

module.exports = { getConfig }

