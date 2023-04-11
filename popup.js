var urlist = ["https://wethinc.in/blog", "https://www.geeksforgeeks.org", "https://youtube.com", "https://wethinc.in", "https://www.geeksforgeeks.org", "https://youtube.com"];


var DataSet = null;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //console.log(request, sender, sendResponse) // not listened 
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
    setAutoFocusIcon(data.autoFocus.active);
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
    console.log("Dataset:", data);
    var qtcl = document.getElementById("QTG");
    var qu = document.getElementById("TGQuoation");
    var au = document.getElementById("Author");
    var str = "https://www.google.com/search?q=explain \"" + data.quote + "\" by " + data.quoteAuthor;
    qtcl.addEventListener("click", () => { window.open(str, "_self") })
    qu.innerHTML = data.quote;
    au.innerHTML = data.quoteAuthor;
    var inpBatLow = document.getElementById("bat-low-level"),
        inpBatHigh = document.getElementById("bat-high-level")
    inpStep = document.getElementById("bat-step");
    inpAlarm = document.getElementById("bat-alarm");
    inpBatLow.value = data.battery.lowLevel;
    inpBatHigh.value = data.battery.highLevel;
    inpStep.value = data.battery.step;
    inpAlarm.value = data.battery.alarmMin;
    changeBattery();
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
    settingsUpdate(data);
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
var boolFocus = false;
playAutoFocus.addEventListener("click", () => {
    console.log("clicked on open button");
    if (boolFocus) {
        console.log("clicked on F open button");
        chrome.runtime.sendMessage({ 'message': 'StopFocus' }, function (response) {
            console.log('focus open response', response);
            if (response.data == 'Success') {
                boolFocus = false;
                playAutoFocus.src = "icon/lock-open.svg";
            }
        });
    } else {
        console.log("clicked on F start button");
        chrome.runtime.sendMessage({ 'message': 'StartFocus' }, function (response) {
            console.log('focus close response', response);
            if (response.data == 'Success') {
                boolFocus = true;
                playAutoFocus.src = "icon/lock-closed.svg";
            }
        });
    }
}, false);
function setAutoFocusIcon(inpBool) {
    boolFocus = inpBool;
    if (inpBool) {
        playAutoFocus.src = "icon/lock-closed.svg";
    } else {
        playAutoFocus.src = "icon/lock-open.svg";
    }


}
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

/*Settings */
var setng = document.getElementById("sett");
var setmain = document.getElementById("setmain");
var setclose = document.getElementById("close-fun");

setclose.addEventListener("click", settingsclose, false);
setng.addEventListener("click", settingsbut, false);

function settingsbut() {
    setmain.classList.add("sett-open");
}

function settingsclose() {
    setmain.classList.remove("sett-open");
}

displayget = document.getElementsByClassName("scrll-item");
for (i = 0; i < displayget.length; i++) {
    displayget[i].addEventListener("click", (evt) => { displayfun(evt.target.dataset.menuId) }, false);
}
displayfun(0);

function displayfun(input) {
    // console.log(evt.target.dataset.menuId);
    //input = evt.target.dataset.menuId;
    console.log(input, "display fun");
    var displayquick = document.getElementsByClassName("flex-con-setset");
    for (i = 0; i < displayquick.length; i++) {
        displayquick[i].classList.add("dispnone");
        displayquick[i].classList.remove("disblock");
    }
    displayquick[input].classList.remove("dispnone");
    displayquick[input].classList.add("disblock");
    // if (input == 0) {
    //     displayquick[0].classList.add("dispnone");
    // }
}

function addwebsidelist(arr, inx, mainpos) {
    var websites = document.getElementById("displist-" + inx);
    console.log(arr);
    websites.innerHTML = "";
    for (inp = 0; inp < arr.length; inp++) {
        var div = document.createElement('div');
        div.setAttribute('class', 'listadd');
        div.innerHTML = `
        <div class="listaddtext">${arr[inp]}</div>
        <div class="listsideaddmark" data-form-id = "${mainpos}" data-menu-id = "${inp}" data-text="${arr[inp]}">remove</div>`;
        websites.appendChild(div);
    }
    console.log("1 calleddddd");
    addremoveSidebar();
}

//addwebworkspacelist(data.workspaces[0].urls, 1, "workspaces", 0);
function addwebworkspacelist(arr, inx, mainpos, arraypos) {
    var websites = document.getElementById("displist-" + inx);
    console.log(arr);
    websites.innerHTML = "";
    for (inp = 0; inp < arr.length; inp++) {
        var div = document.createElement('div');
        div.setAttribute('class', 'listadd');
        div.innerHTML = `
        <div class="listaddtext">${arr[inp]}</div>
        <div class="listworkaddmark" data-form-id = "${mainpos}" data-menu-id = "${inp}" data-text="${arr[inp]}" data-link-id="${arraypos}">remove</div>`;
        websites.appendChild(div);
    }
    addremoveworkspace();
}

function addremoveworkspace() {
    var cla = document.getElementsByClassName("listworkaddmark");
    console.log(cla[0]);
    console.log("2 remove workspace called");
    for (inp = 0; inp < cla.length; inp++) {
        console.log("for loop remove");
        cla[inp].addEventListener("click", (evt) => {
            removeworkspace(evt.target.dataset.formId, evt.target.dataset.menuId, evt.target.dataset.text, evt.target.dataset.linkId)
        }, false);
    }
}

function addremoveSidebar() {
    var cla1 = document.getElementsByClassName("listsideaddmark");
    console.log(cla1[0]);
    console.log("2 remove sidebar calleddddd");
    for (inp = 0; inp < cla1.length; inp++) {
        console.log("for loop remove");
        cla1[inp].addEventListener("click", (evt) => {
            removesidebar(evt.target.dataset.formId, evt.target.dataset.menuId, evt.target.dataset.text)
        }, false);
    }
}

function removeworkspace(arrname, arrindex, text, arrlink) {
    console.log(arrname, arrindex, text, arrlink);
    console.log("3 remove workspace added");
    console.log(DataSet[arrname][arrlink].urls[arrindex], text);
    if (text == DataSet[arrname][arrlink].urls[arrindex]) {
        DataSet[arrname][arrlink].urls.splice(arrindex, 1);
    }
    settingsUpdate(DataSet);
    SetDateset(DataSet);
}

function removesidebar(arrname, arrindex, text) {
    console.log(arrname);
    console.log("3 remove Sidebar added");
    //if (text == DataSet[arrname][arrindex]) { DataSet[arrname].splice(arrindex, 1); }
    if (arrname == "autoFocus.block") {
        if (text == DataSet.autoFocus.block[arrindex]) { DataSet.autoFocus.block.splice(arrindex, 1); }
    } else {
        if (text == DataSet[arrname][arrindex]) { DataSet[arrname].splice(arrindex, 1); }
    }
    settingsUpdate(DataSet);
    SetDateset(DataSet);
}

function settingsUpdate(data) {
    console.log("settings update called");
    addwebsidelist(data.sidebar, 0, "sidebar");
    addwebworkspacelist(data.workspaces[0].urls, 1, "workspaces", 0);
    addwebworkspacelist(data.workspaces[1].urls, 2, "workspaces", 1);
    addwebworkspacelist(data.workspaces[2].urls, 3, "workspaces", 2);
    addwebworkspacelist(data.workspaces[3].urls, 4, "workspaces", 3);
    addwebsidelist(data.autoFocus.block, 5, "autoFocus.block");
}


var buttonsideclick = document.getElementById("sidebutton");
buttonsideclick.addEventListener("click", (evt) => { updateEndForm(evt.target.dataset.inputId) }, false);

var blockclick = document.getElementById("blockbutton");
blockclick.addEventListener("click", (evt) => { updateEndForm(evt.target.dataset.inputId) }, false);

var buttonworkclick = document.getElementById("workbutton-0");
buttonworkclick.addEventListener("click", (evt) => { updateworkEndForm(evt.target.dataset.inputId) }, false);

var buttonworkclick = document.getElementById("workbutton-1");
buttonworkclick.addEventListener("click", (evt) => { updateworkEndForm(evt.target.dataset.inputId) }, false);

var buttonworkclick = document.getElementById("workbutton-2");
buttonworkclick.addEventListener("click", (evt) => { updateworkEndForm(evt.target.dataset.inputId) }, false);

var buttonworkclick = document.getElementById("workbutton-3");
buttonworkclick.addEventListener("click", (evt) => { updateworkEndForm(evt.target.dataset.inputId) }, false);


// for (i = 0; i < 4; i++) {
//     var buttonworkclick = document.getElementById("workbutton-" + i);
//     buttonworkclick.addEventListener("click", (evt) => { updateworkEndForm(evt.target.dataset.inputId) }, false);
// }

function updateEndForm(evt) {
    console.log(evt)
    console.log("called data update");
    input = document.getElementById(evt);
    invalue = input.value;
    indir = input.getAttribute("data-form-link");
    if (indir == "autoFocus.block") {
        leng = DataSet.autoFocus.block.length;
        let testUrl = new URL(invalue);
        DataSet.autoFocus.block[leng] = testUrl.hostname;
    } else {
        leng = DataSet[indir].length;
        DataSet[indir][leng] = invalue;
    }
    settingsUpdate(DataSet);
    SetDateset(DataSet);
}

function updateworkEndForm(evt) {
    console.log(evt);
    console.log("called data update");
    input = document.getElementById(evt);
    invalue = input.value;
    indir = input.getAttribute("data-form-link");
    console.log(DataSet.workspaces[indir].urls);
    leng = DataSet.workspaces[indir].urls.length;
    console.log(DataSet[indir]);
    DataSet.workspaces[indir].urls[leng] = invalue;
    settingsUpdate(DataSet);
    SetDateset(DataSet);
}

function SetDateset(data) {
    chrome.runtime.sendMessage({ 'message': 'updateSettings', 'data': data }, function (response) {
        console.log('Set Data response', response);
    });
}

function listQ() {
    console.log("SoundScape Called");
    DataSet.sound.music = "soundScapes\Jungle Rain.mp3";
    console.log(DataSet.sound.music);
    SetDateset(DataSet);
}
document.getElementById("soundsettng").addEventListener("change", listQ);

function listcontact() {
    console.log("contact change Called");
    var elem = document.getElementById("contactsite1");
    console.log(contactdrop.selectedIndex);
    if (contactdrop.selectedIndex == 0) {
        elem.setAttribute("placeholder", "Enter Phone Number");
    } else if (contactdrop.selectedIndex == 1) {
        elem.setAttribute("placeholder", "Enter Mail");
    }
} {
    /* <select name="consiteset" data-form-id="0" class="ContactType" id="contactsettng1">
    <option value="1">Whatsapp Chat</option>
    <option value="2">Mail to </option>
    </select>
    <input type="text" data-form-id="0" class="contactInput" name="Contact" placeholder="Website Link.."> */
}

// contform = document.getElementById("contactsite");
// contform.addEventListener("change", (evt) => { contac
contactDrop = document.getElementsByClassName("ContactType");
contactInput = document.getElementsByClassName("contactInput");
for (i = 0; i < contactDrop.length; i++) {
    contactDrop[i].addEventListener("change", (evt) => { contactfun(evt.target.dataset.formId) }, false);
    contactInput[i].addEventListener("change", (evt) => { contactfun(evt.target.dataset.formId) }, false);
}

function contactfun(evt) {

    console.log("contact fun called", evt, contactDrop[evt].selectedIndex, contactInput[evt].value);
    if (contactDrop[evt].selectedIndex == 0) {
        contactInput[evt].setAttribute("placeholder", "Enter Phone Number with country code");
    } else if (contactDrop[evt].selectedIndex == 1) {
        contactInput[evt].setAttribute("placeholder", "Enter Mail");
    }
    if (contactDrop[evt].selectedIndex == 0) {
        DataSet.contact[evt].link = "https://wa.me/" + contactInput[evt].value;
    } else if (contactDrop[evt].selectedIndex == 1) {
        DataSet.contact[evt].link = "https://mailto:" + contactInput[evt].value;
    }
    console.log(DataSet.contact[evt].link);
    SetDateset(DataSet);
}


iconform = document.getElementById("top4");
iconform.addEventListener("change", (evt) => { topfun(evt.target.dataset.formId) }, false);

function topfun(evt) {
    console.log(evt);
    console.log(DataSet.topApps[evt].link);
    DataSet.topApps[evt].link = iconform.value;
    console.log(DataSet.topApps[evt].link);
    SetDateset(DataSet);
}

/*Battery Level*/



navigator.getBattery().then((battery) => {
    console.log("success battery");
    var batterySupported = document.getElementById("bat-stats"),
        batteryLevel = document.getElementById("bat-level"),
        chargingStatus = document.getElementById("bat-sat"),
        batteryCharged = document.getElementById("bat-full"),
        batteryDischarged = document.getElementById("bat-dis"),
        inpBatLow = document.getElementById("bat-low-level"),
        inpBatHigh = document.getElementById("bat-high-level"),
        inpStep = document.getElementById("bat-step"), prevBatLevel = 0, boolPlug = true;
    function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
    }

    updateAllBatteryInfo();

    battery.addEventListener("chargingchange", () => {
        updateChargeInfo();
    });

    function updateChargeInfo() {
        chargingStatus.innerHTML = battery.charging ? "Yes" : "No";
        prevBatLevel = battery.level;
        console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
    }

    battery.addEventListener("levelchange", () => {
        updateLevelInfo();
    });
    function updateLevelInfo() {
        batteryLevel.innerHTML = Math.floor(battery.level * 100) + "%";
        console.log(`Battery level: ${battery.level * 100}%`);
        let bat = battery.level;
        console.log(inpBatHigh);
        if ((bat > (inpBatHigh.value))) {
            chrome.runtime.sendMessage({ 'message': 'notifyBat', 'tit': 'Battery is high', 'msg': 'Remove the charging for a better battery' }, function (response) {
                console.log('response', response);
            });
        } else if ((bat < inpBatLow.value)) {
            chrome.runtime.sendMessage({ 'message': 'notifyBat', 'tit': 'Plug in the charger', 'msg': 'Plug in the charger for a better battery' }, function (response) {
                console.log('response', response);
            });
        } else if ((bat - prevBatLevel > inpStep.value)) {
            chrome.runtime.sendMessage({ 'message': 'notifyBat', 'tit': 'No single charge', 'msg': 'Remove the charging for a better battery' }, function (response) {
                console.log('response', response);
            });
        }
    }

    battery.addEventListener("chargingtimechange", () => {
        updateChargingInfo();
    });
    function updateChargingInfo() {
        batteryCharged.innerHTML = Math.floor((battery.chargingTime) / 60) + " mins";
        console.log(`Battery charging time: ${battery.chargingTime} seconds`);
    }

    battery.addEventListener("dischargingtimechange", () => {
        updateDischargingInfo();
    });
    function updateDischargingInfo() {
        batteryDischarged.innerHTML = Math.floor(battery.dischargingTime / 60) + " mins";
        console.log(`Battery discharging time: ${battery.dischargingTime} seconds`);
    }
});

function changeBattery() {
    var cla1 = document.getElementsByClassName("bat-Inp");
    console.log("added battery change");
    for (inp = 0; inp < cla1.length; inp++) {
        cla1[inp].addEventListener("change", (evt) => {
            updateBatteryBG(evt);
        }, false);
    }
}

function updateBatteryBG(evt) {
    console.log("call battery change", evt);
    var inpBatLow = document.getElementById("bat-low-level"),
        inpBatHigh = document.getElementById("bat-high-level")
    inpStep = document.getElementById("bat-step");
    inpAlarm = document.getElementById("bat-alarm");
    DataSet.battery.lowLevel = inpBatLow.value;
    DataSet.battery.highLevel = inpBatHigh.value;
    DataSet.battery.step = inpStep.value;
    DataSet.battery.alarmMin = inpAlarm.value;
    SetDateset(DataSet);
}