const fs = require('fs');

const getStringFromTxt = (fn) => {
    const textString = fs.readFileSync(fn, "utf-8");

    const textStringList = textString.split('\n').reduce((acc,curr) => acc.includes(curr) ? acc : [...acc,curr],[]); 

    const returnStringList = textStringList.map(item => item.trim())

    return returnStringList;
}

module.exports = { getStringFromTxt };