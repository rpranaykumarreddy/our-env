const fs = require("fs");
var OutputData;
fs.readFile("./quotes.json", "utf8", (error, data) => {
    if (error) throw error;
    const parsedData = JSON.parse(data);
    let newData = {};
    let cat = {};
    let count = 0;
    let Tcount = 0;
    parsedData.forEach(item => {
        Tcount += 1;
        delete item.Tags;
        delete item.Popularity;
        if (item.Quote.length < 60 && item.Category != "") {
            if (newData.hasOwnProperty(item.Category) == false) {
                newData[item.Category] = [];
            }
            var temp = item.Category;
            if (!(cat.hasOwnProperty(item.Category))) {
                cat[item.Category] = 1;
            } else {
                cat[item.Category] += 1;
            }
            count++;
            delete item.Category;
            newData[temp].push(item);

        }
    });
    let str = JSON.stringify(newData);
    fs.writeFile("./filteredData1.json", str, error => {
        if (error) throw error;
        console.log("Data written to file successfully!\nwith letter count of " + str.length);
    });
    OutputData = newData;
    //console.log(newData);
    console.log(cat);
    console.log("Total no of Output Records: " + count + "\nTotal no of Input Records: " + Tcount + "\nTotal no of category: " + Object.keys(cat).length);
});
