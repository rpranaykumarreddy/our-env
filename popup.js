var DataSet = null;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //console.log(request, sender, sendResponse) // not listened 
        switch (request.message) {
            case 'SendingDataSet':
                //console.log("Init Call Data", request);
                DataSet = request.Dataset;
                InitCall(request.Dataset);
                sendResponse({ data: 'Thank you' });
        }
    }
);
document.addEventListener('DOMContentLoaded', () => {
    startTime();
    setInterval(() => { startTime(); }, 1000);
    chrome.runtime.sendMessage({ 'message': 'IAmReady' }, function (response) {
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
    var volumeMeter = document.getElementById("volumeMeter");
    var volumeRanger = document.getElementById("volumeRanger");
    volumeMeter.innerHTML = (data.sound.volume * 100);
    volumeRanger.value = (data.sound.volume * 100);
    bolSound = data.sound.play;
    if (data.sound.play) {
        playSoundScape.src = "icon\\pause-circle.svg";
    } else {
        playSoundScape.src = "icon\\play-circle.svg";
    }
    var work = document.getElementsByClassName("for-WSTG");
    for (var worki = 0; worki < 4; worki++) {
        work[worki].innerHTML = '<img class="ionIcon" data-color="#000000" src="' + data.workspaces[worki].icon + '" alt="">';
        work[worki].innerHTML += "<h3>" + data.workspaces[worki].name + "</h3>";
    }

    var cont = document.getElementsByClassName("for-Cont");
    for (var conti = 0; conti < 3; conti++) {
        cont[conti].innerHTML = '<img class="ionIcon" data-color="#000000" src="' + data.contact[conti].type + '" alt="">';
        cont[conti].innerHTML += "<h3>" + data.contact[conti].name + "</h3>";
    }

    var TopIcon = document.getElementsByClassName("for-TopIcon");
    for (var Topi = 0; Topi < 4; Topi++) {
        TopIcon[Topi].innerHTML = '<img class="ionIcon" data-color="#000000" src="' + data.topApps[Topi].icon + '" alt="">';
        TopIcon[Topi].innerHTML += "<h3>" + data.topApps[Topi].name + "</h3>";
    }

    var qtcl = document.getElementById("QTG");
    var qu = document.getElementById("TGQuoation");
    var au = document.getElementById("Author");
    var str = "https://www.google.com/search?q=explain \"" + data.quote + "\" by " + data.quoteAuthor;
    qtcl.addEventListener("click", () => { window.open(str, "_self") })
    qu.innerHTML = data.quote;
    au.innerHTML = data.quoteAuthor;
}

/*Top-4 icons Click*/
var Top1 = document.getElementById("T1Icon");
var Top2 = document.getElementById("T2Icon");
var Top3 = document.getElementById("T3Icon");
var Top4 = document.getElementById("T4Icon");
Top1.addEventListener("click", () => { TopClick(0); }, false);
Top2.addEventListener("click", () => { TopClick(1); }, false);
Top3.addEventListener("click", () => { TopClick(2); }, false);
Top4.addEventListener("click", () => { TopClick(3); }, false);

function TopClick(type) {
    console.log('Asking Top Icons Click', type);
    chrome.runtime.sendMessage({ 'message': 'openTopIcon', 'type': type }, function (response) {
        console.log('response', response);
    });
}

/*Contact Click*/
var cont1 = document.getElementById("Con1");
var cont2 = document.getElementById("Con2");
var cont2 = document.getElementById("Con3");
cont1.addEventListener("click", () => { contactClick(0); }, false);
cont2.addEventListener("click", () => { contactClick(1); }, false);
cont3.addEventListener("click", () => { contactClick(2); }, false);

function contactClick(type) {
    console.log('Asking contactClick', type);
    chrome.runtime.sendMessage({ 'message': 'openContact', 'type': type }, function (response) {
        console.log('response', response);
    });
}

/*SVG Filter*/
addSvgFilterToImages();
function addSvgFilterToImages() {
    const imagesWithDataColor = document.querySelectorAll('img[data-color]');
    var ind = 0;
    imagesWithDataColor.forEach(img => {
        const color = img.getAttribute('data-color');
        const svgFilter = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><filter id="colorFilter${ind}"><feColorMatrix type="matrix" values="0 0 0 0 ${hexToRgb(color).r / 255} 0 0 0 0 ${hexToRgb(color).g / 255} 0 0 0 0 ${hexToRgb(color).b / 255} 0 0 0 1 0"/></filter></svg>`;
        img.style.filter = 'url(#colorFilter' + ind + ')';
        img.insertAdjacentHTML('afterend', svgFilter);
        ind++;

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
    var time = setTimeout(function () { startTime() }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
/*Auto Focus*/
var playAutoFocus = document.getElementById("autoFocusBut");
var AutoFocusRangerHour = document.getElementById("AutoFocusRangerHour");
var AutoFocusRangerMin = document.getElementById("AutoFocusRangerMin");
var boolFocus = false;
playAutoFocus.addEventListener("click", () => {
    console.log("clicked on open button");
    if (boolFocus) {
        console.log("clicked on F open button");
        chrome.runtime.sendMessage({ 'message': 'StopFocus', 'time': 6000 }, function (response) {
            console.log('focus open response', response);
            if (response.data == 'Success') {
                boolFocus = false;
                playAutoFocus.src = "icon/lock-closed.svg";
            }
        });
    } else {
        console.log("clicked on F start button");
        chrome.runtime.sendMessage({ 'message': 'StartFocus', 'volume': (volumeRanger.value / 100) }, function (response) {
            console.log('focus close response', response);
            if (response.data == 'Success') {
                boolFocus = true;
                playAutoFocus.src = "icon/lock-open.svg";
            }
        });
    }
}, false);

/*SoundScape Play*/
var playSoundScape = document.getElementById("playSoundScape");
var volumeMeter = document.getElementById("volumeMeter");
var volumeRanger = document.getElementById("volumeRanger");
var bolSound = false;
volumeRanger.addEventListener("change", () => {
    volumeMeter.innerHTML = volumeRanger.value;
    chrome.runtime.sendMessage({ 'message': 'ChangeVolume', 'volume': (volumeRanger.value / 100) }, function (response) {
        //console.log('response', response);
    });
}, false);
playSoundScape.addEventListener("click", () => {
    console.log("clicked on play button");
    if (bolSound) {
        console.log("clicked on stop button");
        chrome.runtime.sendMessage({ 'message': 'StopPlay' }, function (response) {
            console.log('audio stop response', response);
            if (response.data == "Success") {
                bolSound = false;
                playSoundScape.src = "icon\\play-circle.svg";
            }
        });
    } else {
        console.log("clicked on play button");
        chrome.runtime.sendMessage({ 'message': 'StartPlay', 'volume': (volumeRanger.value / 100) }, function (response) {
            console.log('audio play response', response);
            if (response.data == "Success") {
                bolSound = true;
                playSoundScape.src = "icon\\pause-circle.svg";
            }
        });
    }
}, false);


/*Workspace opening & clicks */
var wrks1 = document.getElementById("WS1");
wrks1.addEventListener("click", () => { worksclick(0); }, false);
var wrks2 = document.getElementById("WS2");
wrks2.addEventListener("click", () => { worksclick(1); }, false);
var wrks3 = document.getElementById("WS3");
wrks3.addEventListener("click", () => { worksclick(2); }, false);
var wrks4 = document.getElementById("WS4");
wrks4.addEventListener("click", () => { worksclick(3); }, false);


function worksclick(type) {
    console.log('Asking Workclick', type);
    chrome.runtime.sendMessage({ 'message': 'openWorkspace', 'type': type }, function (response) {
        console.log('response', response);
    });
}