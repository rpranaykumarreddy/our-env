//   life, philosophy, wisdom, death, mind, truth                   => Life
//   inspiration, hope, success, motivation, purpose, positive      => Positive
//   soul, happiness                                                => Happiness
//   books, education, knowledge, science                           => Education
//   humor, funny                                                   => Funny
//   love, romance, relationship, friendship                        => Love
//   arts, poetry, writing                                          => Arts
//   god, religion, faith, quotes                                   => Other
const fs = require("fs");
var OutputData;
fs.readFile("./filteredData1.json", "utf8", (error, inpdata) => {
    if (error) throw error;
    const data = JSON.parse(inpdata);
    let newData = {};
    let cat = {};

    newData["Life"] = [...(data["life"]), ...(data["philosophy"]), ...(data["wisdom"]), ...(data["death"]), ...(data["mind"]), ...(data["truth"])]; // Life
    newData["Positive"] = [...(data["inspiration"]), ...(data["hope"]), ...(data["success"]), ...(data["motivation"]), ...(data["purpose"]), ...(data["positive"])]; // Positive
    newData["Happiness"] = [...(data["soul"]), ...(data["happiness"])]; // Happiness
    newData["Education"] = [...(data["books"]), ...(data["education"]), ...(data["knowledge"]), ...(data["science"])]; // Education
    newData["Funny"] = [...(data["humor"]), ...(data["funny"])]; // Funny
    newData["Love"] = [...(data["love"]), ...(data["romance"]), ...(data["relationship"]), ...(data["friendship"])]; // Love
    newData["Arts"] = [...(data["arts"]), ...(data["poetry"]), ...(data["writing"])]; // Arts
    newData["Other"] = [...(data["god"]), ...(data["religion"]), ...(data["faith"]), ...(data["quotes"])]; // Other
    cat["Life"] = newData["Life"].length;
    cat["Positive"] = newData["Positive"].length;
    cat["Happiness"] = newData["Happiness"].length;
    cat["Education"] = newData["Education"].length;
    cat["Funny"] = newData["Funny"].length;
    cat["Love"] = newData["Love"].length;
    cat["Arts"] = newData["Arts"].length;
    cat["Other"] = newData["Other"].length;

    let str = JSON.stringify(newData);
    fs.writeFile("./filteredData2.json", str, error => {
        if (error) throw error;
        console.log("Data written to file successfully!\nwith letter count of " + str.length);
    });
    OutputData = newData;
    //console.log(newData);
    console.log(cat);
});

