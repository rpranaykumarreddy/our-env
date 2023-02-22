var DataSet = null;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request, sender, sendResponse) // not listened 
        switch (request.message) {
            case 'SendingDataSet':
                console.log("Init Call Data", request);
                DataSet = request.Dataset;
                InitCall(request.Dataset);
                sendResponse({ data: 'Thank you' });
        }
    }
);
document.addEventListener('DOMContentLoaded', () => {
    startTime();
    setInterval(() => { startTime(); }, 1000);
    chrome.runtime.sendMessage({ 'message': 'IAmReady' }, function(response) {
        console.log('response', response);
    });
});

/*Audio settings*/
function startPlay() {
    chrome.runtime.sendMessage({ 'message': 'StartPlay' }, function (response) {
        console.log('response', response);
    });
}
function stopPlay() {
    chrome.runtime.sendMessage({ 'message': 'StopPlay' }, function (response) {
        console.log('response', response);
    });
}

function changeVolume() {
    chrome.runtime.sendMessage({ 'message': 'ChangeVolume', 'volume': 100 }, function (response) {
        console.log('response', response);
    });
}

function InitCall(data) {
    console.log("Dataset:", data);
    var wrks1 = document.getElementById("WS1TG");
    var wrks2 = document.getElementById("WS2TG");
    var wrks3 = document.getElementById("WS3TG");
    var wrks4 = document.getElementById("WS4TG");
    wrks1.innerHTML += data.workspaces[0].name;
    wrks2.innerHTML += data.workspaces[1].name;
    wrks3.innerHTML += data.workspaces[2].name;
    wrks4.innerHTML += data.workspaces[3].name;
    var qtcl = document.getElementById("QTG");
    var qu = document.getElementById("TGQuoation");
    var au = document.getElementById("Author");
    var str = "https://www.google.com/search?q=explain \"" + data.quote + "\" by " + data.quoteAuthor;
    qtcl.addEventListener("click", () => { window.open(str, "_self") })
    qu.innerHTML = data.quote;
    au.innerHTML = data.quoteAuthor;
}
/*SVG Filter*/
addSvgFilterToImages();
function addSvgFilterToImages() {
    const imagesWithDataColor = document.querySelectorAll('img[data-color]');

    imagesWithDataColor.forEach(img => {
        const color = img.getAttribute('data-color');
        const svgFilter = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><filter id="colorFilter"><feColorMatrix type="matrix" values="0 0 0 0 ${hexToRgb(color).r / 255} 0 0 0 0 ${hexToRgb(color).g / 255} 0 0 0 0 ${hexToRgb(color).b / 255} 0 0 0 1 0"/></filter></svg>`;
        img.style.filter = 'url(#colorFilter)';
        img.insertAdjacentHTML('afterend', svgFilter);
    });

    function hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
    }
}

/*Time setting*/
function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + ap;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
    document.getElementById("date").innerHTML = date;
    var time = setTimeout(function() { startTime() }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/*Workspace opening & clicks */
var wrks1 = document.getElementById("WS1TG");
wrks1.addEventListener("click", () => { worksclick(0); }, false);
var wrks2 = document.getElementById("WS2TG");
wrks2.addEventListener("click", () => { worksclick(1); }, false);
var wrks3 = document.getElementById("WS3TG");
wrks3.addEventListener("click", () => { worksclick(2); }, false);
var wrks4 = document.getElementById("WS4TG");
wrks4.addEventListener("click", () => { worksclick(3); }, false);


function worksclick(type) {
    console.log('Asking Workclick', type);
    chrome.runtime.sendMessage({ 'message': 'openWorkspace', 'type': type }, function(response) {
        console.log('response', response);
    });
}