var urlist = ["https://wethinc.in/blog", "https://www.geeksforgeeks.org", "https://youtube.com", "https://wethinc.in", "https://www.geeksforgeeks.org", "https://youtube.com"];


var DataSet = null;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
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
    chrome.runtime.sendMessage({ 'message': 'IAmReady' }, function(response) {
        console.log('response', response);
    });
});

/*Audio settings*/
function startPlay() {
    chrome.runtime.sendMessage({ 'message': 'StartPlay' }, function(response) {
        console.log('response', response);
    });
}

function stopPlay() {
    chrome.runtime.sendMessage({ 'message': 'StopPlay' }, function(response) {
        console.log('response', response);
    });
}

function changeVolume() {
    chrome.runtime.sendMessage({ 'message': 'ChangeVolume', 'volume': 100 }, function(response) {
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
    settingsUpdate(data);
    tododisp(data);
    notifi(data);
    profilefetch(data);
    selectinner(data);
    quotecheck(data);
    contactdisp(data);
    top4fetch(data);
    sounddisable(data);
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
    chrome.runtime.sendMessage({ 'message': 'openTopIcon', 'type': type }, function(response) {
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
    chrome.runtime.sendMessage({ 'message': 'openContact', 'type': type }, function(response) {
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
    var time = setTimeout(function() { startTime() }, 500);
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
        chrome.runtime.sendMessage({ 'message': 'StopFocus', 'time': 6000 }, function(response) {
            console.log('focus open response', response);
            if (response.data == 'Success') {
                boolFocus = false;
                playAutoFocus.src = "icon/lock-closed.svg";
            }
        });
    } else {
        console.log("clicked on F start button");
        chrome.runtime.sendMessage({ 'message': 'StartFocus', 'volume': (volumeRanger.value / 100) }, function(response) {
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
    chrome.runtime.sendMessage({ 'message': 'ChangeVolume', 'volume': (volumeRanger.value / 100) }, function(response) {
        //console.log('response', response);
    });
}, false);
playSoundScape.addEventListener("click", () => {
    console.log("clicked on play button");
    if (bolSound) {
        console.log("clicked on stop button");
        chrome.runtime.sendMessage({ 'message': 'StopPlay' }, function(response) {
            console.log('audio stop response', response);
            if (response.data == "Success") {
                bolSound = false;
                playSoundScape.src = "icon\\play-circle.svg";
            }
        });
    } else {
        console.log("clicked on play button");
        chrome.runtime.sendMessage({ 'message': 'StartPlay', 'volume': (volumeRanger.value / 100) }, function(response) {
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
    chrome.runtime.sendMessage({ 'message': 'openWorkspace', 'type': type }, function(response) {
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


// var sidebarclk = document.getElementById("sidebarset");
// var workspaceclk1 = document.getElementById("workspaceset1");
// var workspaceclk2 = document.getElementById("workspaceset2");
// var workspaceclk3 = document.getElementById("workspaceset3");
// var workspaceclk4 = document.getElementById("workspaceset4");

// var contactmain = document.getElementById("contactclick");
// var blockmain = document.getElementById("blockclick");
// var dropclk = document.getElementById("dropdownset");
// var contclk = document.getElementById("contactset");
// var blockclk = document.getElementById("blockedset");
// contactmain.addEventListener("click", contactclk, false);
// blockmain.addEventListener("click", blockedclk, false);

// function contactclk() {
//     dropclk.setAttribute("style", "display:none;");
//     contclk.setAttribute("style", "display:block;");
//     blockclk.setAttribute("style", "display:none;");
// }

// function blockedclk() {
//     dropclk.setAttribute("style", "display:none;");
//     contclk.setAttribute("style", "display:none;");
//     blockclk.setAttribute("style", "display:block;");
// }

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
        DataSet.autoFocus.block[leng] = invalue;
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
    chrome.runtime.sendMessage({ 'message': 'updateSettings', 'data': data }, function(response) {
        console.log('Set Data response', response);
    });
}

document.getElementById("soundsettng").addEventListener("change", listQ);

function listQ() {
    soundelm = document.getElementById("soundsettng");
    console.log("sound scape called");
    if (soundelm.value == 1) {
        DataSet.sound.music = "soundScapes\Adventure.mp3";
    } else if (soundelm.value == 2) {
        DataSet.sound.music = "soundScapes\Calming Raindrops.mp3";
    } else if (soundelm.value == 3) {
        DataSet.sound.music = "soundScapes\Deep Ambience.mp3";
    } else if (soundelm.value == 4) {
        DataSet.sound.music = "soundScapes\Downpours.mp3";
    } else if (soundelm.value == 5) {
        DataSet.sound.music = "soundScapes\Jungle Rain.mp3";
    } else if (soundelm.value == 6) {
        DataSet.sound.music = "soundScapes\Like The Flowing River.mp3";
    } else if (soundelm.value == 7) {
        DataSet.sound.music = "soundScapes\Morning Birds Singing.mp3";
    } else if (soundelm.value == 8) {
        DataSet.sound.music = "soundScapes\Ocean Waves On The Beach.mp3";
    } else if (soundelm.value == 9) {
        DataSet.sound.music = "soundScapes\Rain And Distant Thunder Sounds.mp3";
    } else if (soundelm.value == 10) {
        DataSet.sound.music = "Water Dripping In a Cave.mp3";
    }
    // DataSet.sound.music = "soundScapes\Jungle Rain.mp3";
    console.log(DataSet.sound.music);
    SetDateset(DataSet);
}



searchdrop = document.getElementsByClassName("searchType");
searchdrop[0].addEventListener("change", searchlist);

function selectinner(data) {
    searchtext = document.getElementById("searchselect");
    if (data.search == "http://www.google.com/search") {
        searchtext.innerHTML = "google";
    }
}

function sounddisable(data) {
    soundtext = document.getElementById("sounddisable");
    soundtext.innerHTML = data.sound.music;
}

function searchlist() {
    console.log(searchdrop[0].value)
    if (searchdrop[0].value == 1) {
        DataSet.search = "http://www.google.com/search";
    } else if (searchdrop[0].value == 2) {
        console.log("not google");
    }
    SetDateset(DataSet);
    console.log("called google");
}

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
console.log(contactInput);
for (i = 0; i < contactDrop.length; i++) {
    contactDrop[i].addEventListener("change", (evt) => { contactfun(evt.target.dataset.formId) }, false);
    // contactInput[i].addEventListener("change", (evt) => { contactfun(evt.target.dataset.formId) }, false);
}
for (i = 0; i < contactInput.length; i++) {
    contactInput[i].addEventListener("change", (evt) => { contactfun(evt.target.dataset.formId) }, false);
}


function contactdisp(data) {
    console.log("contact display")
    contactInput = document.getElementsByClassName("contactInput");
    contactInput[0].setAttribute("placeholder", data.contact[0].link);
    contactInput[1].setAttribute("placeholder", data.contact[1].link);
    contactInput[2].setAttribute("placeholder", data.contact[2].link);
    console.log(data.contact);
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
    contactdisp(DataSet);
}


iconform = document.getElementsByClassName("top4");

for (i = 0; i < iconform.length; i++) {
    iconform[i].addEventListener("change", (evt) => { topfun(evt.target.dataset.formId) }, false);
}

function topfun(evt) {
    console.log(evt);
    console.log(DataSet.topApps[evt].link);
    DataSet.topApps[evt].link = iconform[evt].value;
    console.log(DataSet.topApps[evt].link);
    SetDateset(DataSet);
    top4fetch(DataSet);
}

function top4fetch(data) {
    console.log("top4 fetch called");
    iconform = document.getElementsByClassName("top4");
    iconform[0].value = data.topApps[0].link;
    iconform[1].value = data.topApps[1].link;
    iconform[2].value = data.topApps[2].link;
    iconform[3].value = data.topApps[3].link;
    console.log(data.topApps);
}


profileform = document.getElementsByClassName("profile");
console.log(profileform);
for (i = 0; i < profileform.length; i++) {
    console.log("for loop called");
    profileform[i].addEventListener("change", (evt) => { profilefun(evt.target.dataset.formId) }, false);
}

function profilefetch(data) {
    console.log("profile fetch called");
    profileform = document.getElementsByClassName("profile");
    profileform[0].value = data.firstName;
    profileform[1].value = data.lastName;
    profileform[2].value = data.nickName;
}

// profileform = document.getElementById("profile");
// profileform.addEventListener("change", (evt) => { profilefun(evt.target.dataset.formId) }, false);



function profilefun(evt) {
    console.log("profile settings called");
    // console.log(DataSet.topApps[evt].link);
    // DataSet.topApps[evt].link = iconform.value;
    console.log(profileform[0].value);
    if (evt == 0) {
        DataSet.firstName = profileform[0].value;
    } else if (evt == 1) {
        DataSet.lastName = profileform[1].value;
    } else if (evt == 2) {
        DataSet.nickName = profileform[2].value;
    }

    SetDateset(DataSet);
    profilefetch(DataSet);
    // console.log(DataSet.topApps[evt].link);
    // SetDateset(DataSet);
}

var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

todoform = document.getElementById("myInput");
todoform.addEventListener("keypress", (evt) => { newElement(evt) }, false);
// Create a new list item when clicking on the "Add" button
function newElement(evt) {
    console.log("form submit called");
    console.log(evt.keyCode);
    if (evt.keyCode == 13) {
        var valueinp = document.getElementById("myInput").value;
        console.log("new element called")
        if (inputValue === '') {
            alert("You must write something!");
        } else {
            DataSet.todo[DataSet.todo.length] = valueinp;
            tododisp(DataSet);
            SetDateset(DataSet);
        }

    }

}

function tododisp(data) {
    // inputValue = document.getElementById("myInput").value;
    var todosite = document.getElementById("myUL");
    todosite.innerHTML = "";
    console.log("todo called")
    inputValue = data.todo;
    console.log(data.todo);
    for (i = 0; i < inputValue.length; i++) {
        // var div = document.createElement('div');
        // div.setAttribute('class', 'listadd');
        // div.innerHTML = `
        // <div class="listaddtext">${arr[inp]}</div>
        // <div class="listworkaddmark" data-form-id = "${mainpos}" data-menu-id = "${inp }" data-text="${arr[inp]}" data-link-id="${arraypos}">remove</div>`;
        // websites.appendChild(div);
        var li = document.createElement("li");
        li.innerHTML = `
        <div data-form-id = "${i}" >${inputValue[i]}</div>`;
        todosite.appendChild(li);
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);
    }
    for (i = 0; i < close.length; i++) {
        close[i].addEventListener("click", (evt) => {
            removetodo(evt.target.dataset.formId);
        }, false);
    }
}

function removetodo(arrindex) {
    console.log(arrindex);
    console.log(" remove todo added");
    console.log(DataSet.todo[arrindex]);
    DataSet.todo.splice(arrindex, 1);
    tododisp(DataSet);
    SetDateset(DataSet);
}

var myDate = new Date();
var hrs = myDate.getHours();

var greet;

function notifi(data) {
    if (hrs < 12)
        greet = 'Good Morning,' + data.firstName;
    else if (hrs >= 12 && hrs <= 17) {
        console.log(data.firstName);
        greet = 'Good Afternoon,' + data.firstName;
    } else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening,' + data.firstName;

    document.getElementById('notification').innerHTML = '<b>' + greet + '</b>';
}

checkselect = document.getElementsByClassName("checkbox1");

for (i = 0; i < checkselect.length; i++) {
    checkselect[i].addEventListener("change", (evt) => { checkfun(evt.target.dataset.formId) }, false);
}


function checkfun(evt) {
    console.log("checkbox called");
    console.log(checkselect[0].checked);
    if (evt == 0) {
        var quote = "Life";
    } else if (evt == 1) {
        var quote = "Positive";
    } else if (evt == 2) {
        var quote = "Happiness";
    } else if (evt == 3) {
        var quote = "Education";
    } else if (evt == 4) {
        var quote = "Funny";
    } else if (evt == 5) {
        var quote = "Love";
    } else if (evt == 6) {
        var quote = "Arts";
    } else if (evt == 7) {
        var quote = "Other";
    }
    if (checkselect[evt].checked) {
        DataSet.quoteCat[evt] = quote;
        console.log("checkbox over");
    } else {
        DataSet.quoteCat[evt] = " ";
        console.log("checkbox another over");
    }
    console.log(DataSet.quoteCat);
    SetDateset(DataSet);
    quotecheck(DataSet);
}


function quotecheck(data) {
    console.log("quote called");
    console.log(data.quoteCat.includes("Life"));
    if (data.quoteCat.includes("Life")) {
        document.getElementsByClassName("checkbox1")[0].checked = true;
    }
    if (data.quoteCat.includes("Positive")) {
        document.getElementsByClassName("checkbox1")[1].checked = true;
    }
    if (data.quoteCat.includes("Happiness")) {
        document.getElementsByClassName("checkbox1")[2].checked = true;
    }
    if (data.quoteCat.includes("Education")) {
        document.getElementsByClassName("checkbox1")[3].checked = true;
    }
    if (data.quoteCat.includes("Funny")) {
        document.getElementsByClassName("checkbox1")[4].checked = true;
    }
    if (data.quoteCat.includes("Love")) {
        document.getElementsByClassName("checkbox1")[5].checked = true;
    }
    if (data.quoteCat.includes("Arts")) {
        document.getElementsByClassName("checkbox1")[6].checked = true;
    }
    if (data.quoteCat.includes("Other")) {
        document.getElementsByClassName("checkbox1")[7].checked = true;
    }
}

const IconListObject = [{ filePath: "icon\\accessibility.svg", fileName: "accessibility" }, { filePath: "icon\\add-circle.svg", fileName: "add-circle" }, { filePath: "icon\\add.svg", fileName: "add" }, { filePath: "icon\\airplane.svg", fileName: "airplane" }, { filePath: "icon\\alarm.svg", fileName: "alarm" }, { filePath: "icon\\albums.svg", fileName: "albums" }, { filePath: "icon\\alert-circle.svg", fileName: "alert-circle" }, { filePath: "icon\\alert.svg", fileName: "alert" }, { filePath: "icon\\american-football.svg", fileName: "american-football" }, { filePath: "icon\\analytics.svg", fileName: "analytics" }, { filePath: "icon\\aperture.svg", fileName: "aperture" }, { filePath: "icon\\apps.svg", fileName: "apps" }, { filePath: "icon\\archive.svg", fileName: "archive" }, { filePath: "icon\\arrow-back-circle.svg", fileName: "arrow-back-circle" }, { filePath: "icon\\arrow-back.svg", fileName: "arrow-back" }, { filePath: "icon\\arrow-down-circle.svg", fileName: "arrow-down-circle" }, { filePath: "icon\\arrow-down.svg", fileName: "arrow-down" }, { filePath: "icon\\arrow-forward-circle.svg", fileName: "arrow-forward-circle" }, { filePath: "icon\\arrow-forward.svg", fileName: "arrow-forward" }, { filePath: "icon\\arrow-redo-circle.svg", fileName: "arrow-redo-circle" }, { filePath: "icon\\arrow-redo.svg", fileName: "arrow-redo" }, { filePath: "icon\\arrow-undo-circle.svg", fileName: "arrow-undo-circle" }, { filePath: "icon\\arrow-undo.svg", fileName: "arrow-undo" }, { filePath: "icon\\arrow-up-circle.svg", fileName: "arrow-up-circle" }, { filePath: "icon\\arrow-up.svg", fileName: "arrow-up" }, { filePath: "icon\\at-circle.svg", fileName: "at-circle" }, { filePath: "icon\\at.svg", fileName: "at" }, { filePath: "icon\\attach.svg", fileName: "attach" }, { filePath: "icon\\backspace.svg", fileName: "backspace" }, { filePath: "icon\\bag-add.svg", fileName: "bag-add" }, { filePath: "icon\\bag-check.svg", fileName: "bag-check" }, { filePath: "icon\\bag-handle.svg", fileName: "bag-handle" }, { filePath: "icon\\bag-remove.svg", fileName: "bag-remove" }, { filePath: "icon\\bag.svg", fileName: "bag" }, { filePath: "icon\\balloon.svg", fileName: "balloon" }, { filePath: "icon\\ban.svg", fileName: "ban" }, { filePath: "icon\\bandage.svg", fileName: "bandage" }, { filePath: "icon\\bar-chart.svg", fileName: "bar-chart" }, { filePath: "icon\\barbell.svg", fileName: "barbell" }, { filePath: "icon\\barcode.svg", fileName: "barcode" }, { filePath: "icon\\baseball.svg", fileName: "baseball" }, { filePath: "icon\\basket.svg", fileName: "basket" }, { filePath: "icon\\basketball.svg", fileName: "basketball" }, { filePath: "icon\\battery-charging.svg", fileName: "battery-charging" }, { filePath: "icon\\battery-dead.svg", fileName: "battery-dead" }, { filePath: "icon\\battery-full.svg", fileName: "battery-full" }, { filePath: "icon\\battery-half.svg", fileName: "battery-half" }, { filePath: "icon\\beaker.svg", fileName: "beaker" }, { filePath: "icon\\bed.svg", fileName: "bed" }, { filePath: "icon\\beer.svg", fileName: "beer" }, { filePath: "icon\\bicycle.svg", fileName: "bicycle" }, { filePath: "icon\\bluetooth.svg", fileName: "bluetooth" }, { filePath: "icon\\boat.svg", fileName: "boat" }, { filePath: "icon\\body.svg", fileName: "body" }, { filePath: "icon\\bonfire.svg", fileName: "bonfire" }, { filePath: "icon\\book.svg", fileName: "book" }, { filePath: "icon\\bookmark.svg", fileName: "bookmark" }, { filePath: "icon\\bookmarks.svg", fileName: "bookmarks" }, { filePath: "icon\\bowling-ball.svg", fileName: "bowling-ball" }, { filePath: "icon\\briefcase.svg", fileName: "briefcase" }, { filePath: "icon\\browsers.svg", fileName: "browsers" }, { filePath: "icon\\brush.svg", fileName: "brush" }, { filePath: "icon\\bug.svg", fileName: "bug" }, { filePath: "icon\\build.svg", fileName: "build" }, { filePath: "icon\\bulb.svg", fileName: "bulb" }, { filePath: "icon\\bus.svg", fileName: "bus" }, { filePath: "icon\\business.svg", fileName: "business" }, { filePath: "icon\\cafe.svg", fileName: "cafe" }, { filePath: "icon\\calculator.svg", fileName: "calculator" }, { filePath: "icon\\calendar-clear.svg", fileName: "calendar-clear" }, { filePath: "icon\\calendar-number.svg", fileName: "calendar-number" }, { filePath: "icon\\calendar.svg", fileName: "calendar" }, { filePath: "icon\\call.svg", fileName: "call" }, { filePath: "icon\\camera-reverse.svg", fileName: "camera-reverse" }, { filePath: "icon\\camera.svg", fileName: "camera" }, { filePath: "icon\\car-sport.svg", fileName: "car-sport" }, { filePath: "icon\\car.svg", fileName: "car" }, { filePath: "icon\\card.svg", fileName: "card" }, { filePath: "icon\\caret-back-circle.svg", fileName: "caret-back-circle" }, { filePath: "icon\\caret-back.svg", fileName: "caret-back" }, { filePath: "icon\\caret-down-circle.svg", fileName: "caret-down-circle" }, { filePath: "icon\\caret-down.svg", fileName: "caret-down" }, { filePath: "icon\\caret-forward-circle.svg", fileName: "caret-forward-circle" }, { filePath: "icon\\caret-forward.svg", fileName: "caret-forward" }, { filePath: "icon\\caret-up-circle.svg", fileName: "caret-up-circle" }, { filePath: "icon\\caret-up.svg", fileName: "caret-up" }, { filePath: "icon\\cart.svg", fileName: "cart" }, { filePath: "icon\\cash.svg", fileName: "cash" }, { filePath: "icon\\cellular.svg", fileName: "cellular" }, { filePath: "icon\\chatbox-ellipses.svg", fileName: "chatbox-ellipses" }, { filePath: "icon\\chatbox.svg", fileName: "chatbox" }, { filePath: "icon\\chatbubble-ellipses.svg", fileName: "chatbubble-ellipses" }, { filePath: "icon\\chatbubble.svg", fileName: "chatbubble" }, { filePath: "icon\\chatbubbles.svg", fileName: "chatbubbles" }, { filePath: "icon\\checkbox.svg", fileName: "checkbox" }, { filePath: "icon\\checkmark-circle.svg", fileName: "checkmark-circle" }, { filePath: "icon\\checkmark-done-circle.svg", fileName: "checkmark-done-circle" }, { filePath: "icon\\checkmark-done.svg", fileName: "checkmark-done" }, { filePath: "icon\\checkmark.svg", fileName: "checkmark" }, { filePath: "icon\\chevron-back-circle.svg", fileName: "chevron-back-circle" }, { filePath: "icon\\chevron-back.svg", fileName: "chevron-back" }, { filePath: "icon\\chevron-down-circle.svg", fileName: "chevron-down-circle" }, { filePath: "icon\\chevron-down.svg", fileName: "chevron-down" }, { filePath: "icon\\chevron-forward-circle.svg", fileName: "chevron-forward-circle" }, { filePath: "icon\\chevron-forward.svg", fileName: "chevron-forward" }, { filePath: "icon\\chevron-up-circle.svg", fileName: "chevron-up-circle" }, { filePath: "icon\\chevron-up.svg", fileName: "chevron-up" }, { filePath: "icon\\clipboard.svg", fileName: "clipboard" }, { filePath: "icon\\close-circle.svg", fileName: "close-circle" }, { filePath: "icon\\close.svg", fileName: "close" }, { filePath: "icon\\cloud-circle.svg", fileName: "cloud-circle" }, { filePath: "icon\\cloud-done.svg", fileName: "cloud-done" }, { filePath: "icon\\cloud-download.svg", fileName: "cloud-download" }, { filePath: "icon\\cloud-offline.svg", fileName: "cloud-offline" }, { filePath: "icon\\cloud-upload.svg", fileName: "cloud-upload" }, { filePath: "icon\\cloud.svg", fileName: "cloud" }, { filePath: "icon\\cloudy-night.svg", fileName: "cloudy-night" }, { filePath: "icon\\cloudy.svg", fileName: "cloudy" }, { filePath: "icon\\code-download.svg", fileName: "code-download" }, { filePath: "icon\\code-slash.svg", fileName: "code-slash" }, { filePath: "icon\\code-working.svg", fileName: "code-working" }, { filePath: "icon\\code.svg", fileName: "code" }, { filePath: "icon\\cog.svg", fileName: "cog" }, { filePath: "icon\\color-fill.svg", fileName: "color-fill" }, { filePath: "icon\\color-filter.svg", fileName: "color-filter" }, { filePath: "icon\\color-palette.svg", fileName: "color-palette" }, { filePath: "icon\\color-wand.svg", fileName: "color-wand" }, { filePath: "icon\\compass.svg", fileName: "compass" }, { filePath: "icon\\construct.svg", fileName: "construct" }, { filePath: "icon\\contract.svg", fileName: "contract" }, { filePath: "icon\\contrast.svg", fileName: "contrast" }, { filePath: "icon\\copy.svg", fileName: "copy" }, { filePath: "icon\\create.svg", fileName: "create" }, { filePath: "icon\\crop.svg", fileName: "crop" }, { filePath: "icon\\cube.svg", fileName: "cube" }, { filePath: "icon\\cut.svg", fileName: "cut" }, { filePath: "icon\\desktop.svg", fileName: "desktop" }, { filePath: "icon\\diamond.svg", fileName: "diamond" }, { filePath: "icon\\dice.svg", fileName: "dice" }, { filePath: "icon\\disc.svg", fileName: "disc" }, { filePath: "icon\\document-attach.svg", fileName: "document-attach" }, { filePath: "icon\\document-lock.svg", fileName: "document-lock" }, { filePath: "icon\\document-text.svg", fileName: "document-text" }, { filePath: "icon\\document.svg", fileName: "document" }, { filePath: "icon\\documents.svg", fileName: "documents" }, { filePath: "icon\\download.svg", fileName: "download" }, { filePath: "icon\\duplicate.svg", fileName: "duplicate" }, { filePath: "icon\\ear.svg", fileName: "ear" }, { filePath: "icon\\earth.svg", fileName: "earth" }, { filePath: "icon\\easel.svg", fileName: "easel" }, { filePath: "icon\\egg.svg", fileName: "egg" }, { filePath: "icon\\ellipse.svg", fileName: "ellipse" }, { filePath: "icon\\ellipsis-horizontal-circle.svg", fileName: "ellipsis-horizontal-circle" }, { filePath: "icon\\ellipsis-horizontal.svg", fileName: "ellipsis-horizontal" }, { filePath: "icon\\ellipsis-vertical-circle.svg", fileName: "ellipsis-vertical-circle" }, { filePath: "icon\\ellipsis-vertical.svg", fileName: "ellipsis-vertical" }, { filePath: "icon\\enter.svg", fileName: "enter" }, { filePath: "icon\\exit.svg", fileName: "exit" }, { filePath: "icon\\expand.svg", fileName: "expand" }, { filePath: "icon\\extension-puzzle.svg", fileName: "extension-puzzle" }, { filePath: "icon\\eye-off.svg", fileName: "eye-off" }, { filePath: "icon\\eye.svg", fileName: "eye" }, { filePath: "icon\\eyedrop.svg", fileName: "eyedrop" }, { filePath: "icon\\fast-food.svg", fileName: "fast-food" }, { filePath: "icon\\female.svg", fileName: "female" }, { filePath: "icon\\file-tray-full.svg", fileName: "file-tray-full" }, { filePath: "icon\\file-tray-stacked.svg", fileName: "file-tray-stacked" }, { filePath: "icon\\file-tray.svg", fileName: "file-tray" }, { filePath: "icon\\film.svg", fileName: "film" }, { filePath: "icon\\filter-circle.svg", fileName: "filter-circle" }, { filePath: "icon\\filter.svg", fileName: "filter" }, { filePath: "icon\\finger-print.svg", fileName: "finger-print" }, { filePath: "icon\\fish.svg", fileName: "fish" }, { filePath: "icon\\fitness.svg", fileName: "fitness" }, { filePath: "icon\\flag.svg", fileName: "flag" }, { filePath: "icon\\flame.svg", fileName: "flame" }, { filePath: "icon\\flash-off.svg", fileName: "flash-off" }, { filePath: "icon\\flash.svg", fileName: "flash" }, { filePath: "icon\\flashlight.svg", fileName: "flashlight" }, { filePath: "icon\\flask.svg", fileName: "flask" }, { filePath: "icon\\flower.svg", fileName: "flower" }, { filePath: "icon\\folder-open.svg", fileName: "folder-open" }, { filePath: "icon\\folder.svg", fileName: "folder" }, { filePath: "icon\\football.svg", fileName: "football" }, { filePath: "icon\\footsteps.svg", fileName: "footsteps" }, { filePath: "icon\\funnel.svg", fileName: "funnel" }, { filePath: "icon\\game-controller.svg", fileName: "game-controller" }, { filePath: "icon\\gift.svg", fileName: "gift" }, { filePath: "icon\\git-branch.svg", fileName: "git-branch" }, { filePath: "icon\\git-commit.svg", fileName: "git-commit" }, { filePath: "icon\\git-compare.svg", fileName: "git-compare" }, { filePath: "icon\\git-merge.svg", fileName: "git-merge" }, { filePath: "icon\\git-network.svg", fileName: "git-network" }, { filePath: "icon\\git-pull-request.svg", fileName: "git-pull-request" }, { filePath: "icon\\glasses.svg", fileName: "glasses" }, { filePath: "icon\\globe.svg", fileName: "globe" }, { filePath: "icon\\golf.svg", fileName: "golf" }, { filePath: "icon\\grid.svg", fileName: "grid" }, { filePath: "icon\\hammer.svg", fileName: "hammer" }, { filePath: "icon\\hand-left.svg", fileName: "hand-left" }, { filePath: "icon\\hand-right.svg", fileName: "hand-right" }, { filePath: "icon\\happy.svg", fileName: "happy" }, { filePath: "icon\\hardware-chip.svg", fileName: "hardware-chip" }, { filePath: "icon\\headset.svg", fileName: "headset" }, { filePath: "icon\\heart-circle.svg", fileName: "heart-circle" }, { filePath: "icon\\heart-dislike-circle.svg", fileName: "heart-dislike-circle" }, { filePath: "icon\\heart-dislike.svg", fileName: "heart-dislike" }, { filePath: "icon\\heart-half.svg", fileName: "heart-half" }, { filePath: "icon\\heart.svg", fileName: "heart" }, { filePath: "icon\\help-buoy.svg", fileName: "help-buoy" }, { filePath: "icon\\help-circle.svg", fileName: "help-circle" }, { filePath: "icon\\help.svg", fileName: "help" }, { filePath: "icon\\home.svg", fileName: "home" }, { filePath: "icon\\hourglass.svg", fileName: "hourglass" }, { filePath: "icon\\ice-cream.svg", fileName: "ice-cream" }, { filePath: "icon\\id-card.svg", fileName: "id-card" }, { filePath: "icon\\image.svg", fileName: "image" }, { filePath: "icon\\images.svg", fileName: "images" }, { filePath: "icon\\infinite.svg", fileName: "infinite" }, { filePath: "icon\\information-circle.svg", fileName: "information-circle" }, { filePath: "icon\\information.svg", fileName: "information" }, { filePath: "icon\\invert-mode.svg", fileName: "invert-mode" }, { filePath: "icon\\journal.svg", fileName: "journal" }, { filePath: "icon\\key.svg", fileName: "key" }, { filePath: "icon\\keypad.svg", fileName: "keypad" }, { filePath: "icon\\language.svg", fileName: "language" }, { filePath: "icon\\laptop.svg", fileName: "laptop" }, { filePath: "icon\\layers.svg", fileName: "layers" }, { filePath: "icon\\leaf.svg", fileName: "leaf" }, { filePath: "icon\\library.svg", fileName: "library" }, { filePath: "icon\\link.svg", fileName: "link" }, { filePath: "icon\\list-circle.svg", fileName: "list-circle" }, { filePath: "icon\\list.svg", fileName: "list" }, { filePath: "icon\\locate.svg", fileName: "locate" }, { filePath: "icon\\location.svg", fileName: "location" }, { filePath: "icon\\lock-closed.svg", fileName: "lock-closed" }, { filePath: "icon\\lock-open.svg", fileName: "lock-open" }, { filePath: "icon\\log-in.svg", fileName: "log-in" }, { filePath: "icon\\log-out.svg", fileName: "log-out" }, { filePath: "icon\\logo-alipay.svg", fileName: "logo-alipay" }, { filePath: "icon\\logo-amazon.svg", fileName: "logo-amazon" }, { filePath: "icon\\logo-amplify.svg", fileName: "logo-amplify" }, { filePath: "icon\\logo-android.svg", fileName: "logo-android" }, { filePath: "icon\\logo-angular.svg", fileName: "logo-angular" }, { filePath: "icon\\logo-apple-appstore.svg", fileName: "logo-apple-appstore" }, { filePath: "icon\\logo-apple-ar.svg", fileName: "logo-apple-ar" }, { filePath: "icon\\logo-apple.svg", fileName: "logo-apple" }, { filePath: "icon\\logo-behance.svg", fileName: "logo-behance" }, { filePath: "icon\\logo-bitbucket.svg", fileName: "logo-bitbucket" }, { filePath: "icon\\logo-bitcoin.svg", fileName: "logo-bitcoin" }, { filePath: "icon\\logo-buffer.svg", fileName: "logo-buffer" }, { filePath: "icon\\logo-capacitor.svg", fileName: "logo-capacitor" }, { filePath: "icon\\logo-chrome.svg", fileName: "logo-chrome" }, { filePath: "icon\\logo-closed-captioning.svg", fileName: "logo-closed-captioning" }, { filePath: "icon\\logo-codepen.svg", fileName: "logo-codepen" }, { filePath: "icon\\logo-css3.svg", fileName: "logo-css3" }, { filePath: "icon\\logo-designernews.svg", fileName: "logo-designernews" }, { filePath: "icon\\logo-deviantart.svg", fileName: "logo-deviantart" }, { filePath: "icon\\logo-discord.svg", fileName: "logo-discord" }, { filePath: "icon\\logo-docker.svg", fileName: "logo-docker" }, { filePath: "icon\\logo-dribbble.svg", fileName: "logo-dribbble" }, { filePath: "icon\\logo-dropbox.svg", fileName: "logo-dropbox" }, { filePath: "icon\\logo-edge.svg", fileName: "logo-edge" }, { filePath: "icon\\logo-electron.svg", fileName: "logo-electron" }, { filePath: "icon\\logo-euro.svg", fileName: "logo-euro" }, { filePath: "icon\\logo-facebook.svg", fileName: "logo-facebook" }, { filePath: "icon\\logo-figma.svg", fileName: "logo-figma" }, { filePath: "icon\\logo-firebase.svg", fileName: "logo-firebase" }, { filePath: "icon\\logo-firefox.svg", fileName: "logo-firefox" }, { filePath: "icon\\logo-flickr.svg", fileName: "logo-flickr" }, { filePath: "icon\\logo-foursquare.svg", fileName: "logo-foursquare" }, { filePath: "icon\\logo-github.svg", fileName: "logo-github" }, { filePath: "icon\\logo-gitlab.svg", fileName: "logo-gitlab" }, { filePath: "icon\\logo-google-playstore.svg", fileName: "logo-google-playstore" }, { filePath: "icon\\logo-google.svg", fileName: "logo-google" }, { filePath: "icon\\logo-hackernews.svg", fileName: "logo-hackernews" }, { filePath: "icon\\logo-html5.svg", fileName: "logo-html5" }, { filePath: "icon\\logo-instagram.svg", fileName: "logo-instagram" }, { filePath: "icon\\logo-ionic.svg", fileName: "logo-ionic" }, { filePath: "icon\\logo-ionitron.svg", fileName: "logo-ionitron" }, { filePath: "icon\\logo-javascript.svg", fileName: "logo-javascript" }, { filePath: "icon\\logo-laravel.svg", fileName: "logo-laravel" }, { filePath: "icon\\logo-linkedin.svg", fileName: "logo-linkedin" }, { filePath: "icon\\logo-markdown.svg", fileName: "logo-markdown" }, { filePath: "icon\\logo-mastodon.svg", fileName: "logo-mastodon" }, { filePath: "icon\\logo-medium.svg", fileName: "logo-medium" }, { filePath: "icon\\logo-microsoft.svg", fileName: "logo-microsoft" }, { filePath: "icon\\logo-no-smoking.svg", fileName: "logo-no-smoking" }, { filePath: "icon\\logo-nodejs.svg", fileName: "logo-nodejs" }, { filePath: "icon\\logo-npm.svg", fileName: "logo-npm" }, { filePath: "icon\\logo-octocat.svg", fileName: "logo-octocat" }, { filePath: "icon\\logo-paypal.svg", fileName: "logo-paypal" }, { filePath: "icon\\logo-pinterest.svg", fileName: "logo-pinterest" }, { filePath: "icon\\logo-playstation.svg", fileName: "logo-playstation" }, { filePath: "icon\\logo-pwa.svg", fileName: "logo-pwa" }, { filePath: "icon\\logo-python.svg", fileName: "logo-python" }, { filePath: "icon\\logo-react.svg", fileName: "logo-react" }, { filePath: "icon\\logo-reddit.svg", fileName: "logo-reddit" }, { filePath: "icon\\logo-rss.svg", fileName: "logo-rss" }, { filePath: "icon\\logo-sass.svg", fileName: "logo-sass" }, { filePath: "icon\\logo-skype.svg", fileName: "logo-skype" }, { filePath: "icon\\logo-slack.svg", fileName: "logo-slack" }, { filePath: "icon\\logo-snapchat.svg", fileName: "logo-snapchat" }, { filePath: "icon\\logo-soundcloud.svg", fileName: "logo-soundcloud" }, { filePath: "icon\\logo-stackoverflow.svg", fileName: "logo-stackoverflow" }, { filePath: "icon\\logo-steam.svg", fileName: "logo-steam" }, { filePath: "icon\\logo-stencil.svg", fileName: "logo-stencil" }, { filePath: "icon\\logo-tableau.svg", fileName: "logo-tableau" }, { filePath: "icon\\logo-tiktok.svg", fileName: "logo-tiktok" }, { filePath: "icon\\logo-tumblr.svg", fileName: "logo-tumblr" }, { filePath: "icon\\logo-tux.svg", fileName: "logo-tux" }, { filePath: "icon\\logo-twitch.svg", fileName: "logo-twitch" }, { filePath: "icon\\logo-twitter.svg", fileName: "logo-twitter" }, { filePath: "icon\\logo-usd.svg", fileName: "logo-usd" }, { filePath: "icon\\logo-venmo.svg", fileName: "logo-venmo" }, { filePath: "icon\\logo-vercel.svg", fileName: "logo-vercel" }, { filePath: "icon\\logo-vimeo.svg", fileName: "logo-vimeo" }, { filePath: "icon\\logo-vk.svg", fileName: "logo-vk" }, { filePath: "icon\\logo-vue.svg", fileName: "logo-vue" }, { filePath: "icon\\logo-web-component.svg", fileName: "logo-web-component" }, { filePath: "icon\\logo-wechat.svg", fileName: "logo-wechat" }, { filePath: "icon\\logo-whatsapp.svg", fileName: "logo-whatsapp" }, { filePath: "icon\\logo-windows.svg", fileName: "logo-windows" }, { filePath: "icon\\logo-wordpress.svg", fileName: "logo-wordpress" }, { filePath: "icon\\logo-xbox.svg", fileName: "logo-xbox" }, { filePath: "icon\\logo-xing.svg", fileName: "logo-xing" }, { filePath: "icon\\logo-yahoo.svg", fileName: "logo-yahoo" }, { filePath: "icon\\logo-yen.svg", fileName: "logo-yen" }, { filePath: "icon\\logo-youtube.svg", fileName: "logo-youtube" }, { filePath: "icon\\magnet.svg", fileName: "magnet" }, { filePath: "icon\\mail-open.svg", fileName: "mail-open" }, { filePath: "icon\\mail-unread.svg", fileName: "mail-unread" }, { filePath: "icon\\mail.svg", fileName: "mail" }, { filePath: "icon\\male-female.svg", fileName: "male-female" }, { filePath: "icon\\male.svg", fileName: "male" }, { filePath: "icon\\man.svg", fileName: "man" }, { filePath: "icon\\map.svg", fileName: "map" }, { filePath: "icon\\medal.svg", fileName: "medal" }, { filePath: "icon\\medical.svg", fileName: "medical" }, { filePath: "icon\\medkit.svg", fileName: "medkit" }, { filePath: "icon\\megaphone.svg", fileName: "megaphone" }, { filePath: "icon\\menu.svg", fileName: "menu" }, { filePath: "icon\\mic-circle.svg", fileName: "mic-circle" }, { filePath: "icon\\mic-off-circle.svg", fileName: "mic-off-circle" }, { filePath: "icon\\mic-off.svg", fileName: "mic-off" }, { filePath: "icon\\mic.svg", fileName: "mic" }, { filePath: "icon\\moon.svg", fileName: "moon" }, { filePath: "icon\\move.svg", fileName: "move" }, { filePath: "icon\\musical-note.svg", fileName: "musical-note" }, { filePath: "icon\\musical-notes.svg", fileName: "musical-notes" }, { filePath: "icon\\navigate-circle.svg", fileName: "navigate-circle" }, { filePath: "icon\\navigate.svg", fileName: "navigate" }, { filePath: "icon\\newspaper.svg", fileName: "newspaper" }, { filePath: "icon\\notifications-circle.svg", fileName: "notifications-circle" }, { filePath: "icon\\notifications-off-circle.svg", fileName: "notifications-off-circle" }, { filePath: "icon\\notifications-off.svg", fileName: "notifications-off" }, { filePath: "icon\\notifications.svg", fileName: "notifications" }, { filePath: "icon\\nuclear.svg", fileName: "nuclear" }, { filePath: "icon\\nutrition.svg", fileName: "nutrition" }, { filePath: "icon\\open.svg", fileName: "open" }, { filePath: "icon\\options.svg", fileName: "options" }, { filePath: "icon\\paper-plane.svg", fileName: "paper-plane" }, { filePath: "icon\\partly-sunny.svg", fileName: "partly-sunny" }, { filePath: "icon\\pause-circle.svg", fileName: "pause-circle" }, { filePath: "icon\\pause.svg", fileName: "pause" }, { filePath: "icon\\paw.svg", fileName: "paw" }, { filePath: "icon\\pencil.svg", fileName: "pencil" }, { filePath: "icon\\people-circle.svg", fileName: "people-circle" }, { filePath: "icon\\people.svg", fileName: "people" }, { filePath: "icon\\person-add.svg", fileName: "person-add" }, { filePath: "icon\\person-circle.svg", fileName: "person-circle" }, { filePath: "icon\\person-remove.svg", fileName: "person-remove" }, { filePath: "icon\\person.svg", fileName: "person" }, { filePath: "icon\\phone-landscape.svg", fileName: "phone-landscape" }, { filePath: "icon\\phone-portrait.svg", fileName: "phone-portrait" }, { filePath: "icon\\pie-chart.svg", fileName: "pie-chart" }, { filePath: "icon\\pin.svg", fileName: "pin" }, { filePath: "icon\\pint.svg", fileName: "pint" }, { filePath: "icon\\pizza.svg", fileName: "pizza" }, { filePath: "icon\\planet.svg", fileName: "planet" }, { filePath: "icon\\play-back-circle.svg", fileName: "play-back-circle" }, { filePath: "icon\\play-back.svg", fileName: "play-back" }, { filePath: "icon\\play-circle.svg", fileName: "play-circle" }, { filePath: "icon\\play-forward-circle.svg", fileName: "play-forward-circle" }, { filePath: "icon\\play-forward.svg", fileName: "play-forward" }, { filePath: "icon\\play-skip-back-circle.svg", fileName: "play-skip-back-circle" }, { filePath: "icon\\play-skip-back.svg", fileName: "play-skip-back" }, { filePath: "icon\\play-skip-forward-circle.svg", fileName: "play-skip-forward-circle" }, { filePath: "icon\\play-skip-forward.svg", fileName: "play-skip-forward" }, { filePath: "icon\\play.svg", fileName: "play" }, { filePath: "icon\\podium.svg", fileName: "podium" }, { filePath: "icon\\power.svg", fileName: "power" }, { filePath: "icon\\pricetag.svg", fileName: "pricetag" }, { filePath: "icon\\pricetags.svg", fileName: "pricetags" }, { filePath: "icon\\print.svg", fileName: "print" }, { filePath: "icon\\prism.svg", fileName: "prism" }, { filePath: "icon\\pulse.svg", fileName: "pulse" }, { filePath: "icon\\push.svg", fileName: "push" }, { filePath: "icon\\qr-code.svg", fileName: "qr-code" }, { filePath: "icon\\radio-button-off.svg", fileName: "radio-button-off" }, { filePath: "icon\\radio-button-on.svg", fileName: "radio-button-on" }, { filePath: "icon\\radio.svg", fileName: "radio" }, { filePath: "icon\\rainy.svg", fileName: "rainy" }, { filePath: "icon\\reader.svg", fileName: "reader" }, { filePath: "icon\\receipt.svg", fileName: "receipt" }, { filePath: "icon\\recording.svg", fileName: "recording" }, { filePath: "icon\\refresh-circle.svg", fileName: "refresh-circle" }, { filePath: "icon\\refresh.svg", fileName: "refresh" }, { filePath: "icon\\reload-circle.svg", fileName: "reload-circle" }, { filePath: "icon\\reload.svg", fileName: "reload" }, { filePath: "icon\\remove-circle.svg", fileName: "remove-circle" }, { filePath: "icon\\remove.svg", fileName: "remove" }, { filePath: "icon\\reorder-four.svg", fileName: "reorder-four" }, { filePath: "icon\\reorder-three.svg", fileName: "reorder-three" }, { filePath: "icon\\reorder-two.svg", fileName: "reorder-two" }, { filePath: "icon\\repeat.svg", fileName: "repeat" }, { filePath: "icon\\resize.svg", fileName: "resize" }, { filePath: "icon\\restaurant.svg", fileName: "restaurant" }, { filePath: "icon\\return-down-back.svg", fileName: "return-down-back" }, { filePath: "icon\\return-down-forward.svg", fileName: "return-down-forward" }, { filePath: "icon\\return-up-back.svg", fileName: "return-up-back" }, { filePath: "icon\\return-up-forward.svg", fileName: "return-up-forward" }, { filePath: "icon\\ribbon.svg", fileName: "ribbon" }, { filePath: "icon\\rocket.svg", fileName: "rocket" }, { filePath: "icon\\rose.svg", fileName: "rose" }, { filePath: "icon\\sad.svg", fileName: "sad" }, { filePath: "icon\\save.svg", fileName: "save" }, { filePath: "icon\\scale.svg", fileName: "scale" }, { filePath: "icon\\scan-circle.svg", fileName: "scan-circle" }, { filePath: "icon\\scan.svg", fileName: "scan" }, { filePath: "icon\\school.svg", fileName: "school" }, { filePath: "icon\\search-circle.svg", fileName: "search-circle" }, { filePath: "icon\\search.svg", fileName: "search" }, { filePath: "icon\\send.svg", fileName: "send" }, { filePath: "icon\\server.svg", fileName: "server" }, { filePath: "icon\\settings.svg", fileName: "settings" }, { filePath: "icon\\shapes.svg", fileName: "shapes" }, { filePath: "icon\\share-social.svg", fileName: "share-social" }, { filePath: "icon\\share.svg", fileName: "share" }, { filePath: "icon\\shield-checkmark.svg", fileName: "shield-checkmark" }, { filePath: "icon\\shield-half.svg", fileName: "shield-half" }, { filePath: "icon\\shield.svg", fileName: "shield" }, { filePath: "icon\\shirt.svg", fileName: "shirt" }, { filePath: "icon\\shuffle.svg", fileName: "shuffle" }, { filePath: "icon\\skull.svg", fileName: "skull" }, { filePath: "icon\\snow.svg", fileName: "snow" }, { filePath: "icon\\sparkles.svg", fileName: "sparkles" }, { filePath: "icon\\speedometer.svg", fileName: "speedometer" }, { filePath: "icon\\square.svg", fileName: "square" }, { filePath: "icon\\star-half.svg", fileName: "star-half" }, { filePath: "icon\\star.svg", fileName: "star" }, { filePath: "icon\\stats-chart.svg", fileName: "stats-chart" }, { filePath: "icon\\stop-circle.svg", fileName: "stop-circle" }, { filePath: "icon\\stop.svg", fileName: "stop" }, { filePath: "icon\\stopwatch.svg", fileName: "stopwatch" }, { filePath: "icon\\storefront.svg", fileName: "storefront" }, { filePath: "icon\\subway.svg", fileName: "subway" }, { filePath: "icon\\sunny.svg", fileName: "sunny" }, { filePath: "icon\\swap-horizontal.svg", fileName: "swap-horizontal" }, { filePath: "icon\\swap-vertical.svg", fileName: "swap-vertical" }, { filePath: "icon\\sync-circle.svg", fileName: "sync-circle" }, { filePath: "icon\\sync.svg", fileName: "sync" }, { filePath: "icon\\tablet-landscape.svg", fileName: "tablet-landscape" }, { filePath: "icon\\tablet-portrait.svg", fileName: "tablet-portrait" }, { filePath: "icon\\telescope.svg", fileName: "telescope" }, { filePath: "icon\\tennisball.svg", fileName: "tennisball" }, { filePath: "icon\\terminal.svg", fileName: "terminal" }, { filePath: "icon\\text.svg", fileName: "text" }, { filePath: "icon\\thermometer.svg", fileName: "thermometer" }, { filePath: "icon\\thumbs-down.svg", fileName: "thumbs-down" }, { filePath: "icon\\thumbs-up.svg", fileName: "thumbs-up" }, { filePath: "icon\\thunderstorm.svg", fileName: "thunderstorm" }, { filePath: "icon\\ticket.svg", fileName: "ticket" }, { filePath: "icon\\time.svg", fileName: "time" }, { filePath: "icon\\timer.svg", fileName: "timer" }, { filePath: "icon\\today.svg", fileName: "today" }, { filePath: "icon\\toggle.svg", fileName: "toggle" }, { filePath: "icon\\trail-sign.svg", fileName: "trail-sign" }, { filePath: "icon\\train.svg", fileName: "train" }, { filePath: "icon\\transgender.svg", fileName: "transgender" }, { filePath: "icon\\trash-bin.svg", fileName: "trash-bin" }, { filePath: "icon\\trash.svg", fileName: "trash" }, { filePath: "icon\\trending-down.svg", fileName: "trending-down" }, { filePath: "icon\\trending-up.svg", fileName: "trending-up" }, { filePath: "icon\\triangle.svg", fileName: "triangle" }, { filePath: "icon\\trophy.svg", fileName: "trophy" }, { filePath: "icon\\tv.svg", fileName: "tv" }, { filePath: "icon\\umbrella.svg", fileName: "umbrella" }, { filePath: "icon\\unlink.svg", fileName: "unlink" }, { filePath: "icon\\videocam-off.svg", fileName: "videocam-off" }, { filePath: "icon\\videocam.svg", fileName: "videocam" }, { filePath: "icon\\volume-high.svg", fileName: "volume-high" }, { filePath: "icon\\volume-low.svg", fileName: "volume-low" }, { filePath: "icon\\volume-medium.svg", fileName: "volume-medium" }, { filePath: "icon\\volume-mute.svg", fileName: "volume-mute" }, { filePath: "icon\\volume-off.svg", fileName: "volume-off" }, { filePath: "icon\\walk.svg", fileName: "walk" }, { filePath: "icon\\wallet.svg", fileName: "wallet" }, { filePath: "icon\\warning.svg", fileName: "warning" }, { filePath: "icon\\watch.svg", fileName: "watch" }, { filePath: "icon\\water.svg", fileName: "water" }, { filePath: "icon\\wifi.svg", fileName: "wifi" }, { filePath: "icon\\wine.svg", fileName: "wine" }, { filePath: "icon\\woman.svg", fileName: "woman" }];

var sideIconEle = document.getElementsByClassName("iconselect");
for (i = 0; i < sideIconEle.length; i++) {
    for (ii = 0; ii < IconListObject.length; ii++) {
        sideIconEle[i].innerHTML += '<option value="' + IconListObject[ii].filePath + '">' + IconListObject[ii].fileName + '</option>'
    }
    sideIconEle[i].addEventListener("change", (evt) => { iconfun(evt.target.dataset.formId) }, false);
}


function iconfun(evt) {
    console.log("icon called");
    DataSet.workspaces[evt].icon = sideIconEle[evt].value;
    console.log(DataSet.workspaces[evt]);
    SetDateset(DataSet);
}

/*Battery Level*/

chrome.alarms.create(
    "Battery", { delayInMinutes: 0 }, () => { console.log("alarm") }
)