chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('req', request.message) // not listened 
        switch (request.message) {
            case "updateSettings":
                sendResponse({ data: 'Success' });
                SetDateset(request.data);
                console.log("Updating setting", request.data);
                break;
            case "updateVcard":
                sendResponse({ data: 'Success' });
                SetVcard(request.data);
                console.log("Updating Vcard", request.data);
                break;
            case 'IAmReady':
                console.log('req Replay', request.message);
                SendDataToNew();
                SendVcardToNew()
                sendResponse({ data: 'Success' });
                break;
            case 'openUrl':
                chrome.tabs.create({ url: request.url, active: false, index: 50 });
                break;
            case 'openWorkspace':
                workSpacesOpen(request.type);
                sendResponse({ data: 'Success' });
                break;
            case 'openContact':
                contactOpen(request.type);
                sendResponse({ data: 'Success' });
                break;
            case 'openTopIcon':
                TopIconOpen(request.type);
                sendResponse({ data: 'Success' });
                break;
            case 'notify':
                sendResponse({ data: 'Success' });
                notify(request.tit, request.msg);
                break;
            case 'notifyBat':
                sendResponse({ data: 'Success' });
                notifyBat(request.tit, request.msg);
                break;
            case 'StartPlay':
                playSound(DataSet.sound.music, request.volume);
                DataSet.sound.play = true;
                sendResponse({ data: 'Success' });
                break;
            case 'StopPlay':
                StopSound();
                DataSet.sound.play = false;
                sendResponse({ data: 'Success' });
                break;
            case 'StartFocus':
                StartFocus();
                sendResponse({ data: 'Success' });
                break;
            case 'StopFocus':
                StopFocus();
                sendResponse({ data: 'Success' });
                break;
            case 'ChangeVolume':
                DataSet.sound.volume = request.volume;
                VolumeSound(request.volume);
                sendResponse({ data: 'Success' });
                break;
            case 'getQuotation':
                var str = request.topic;
                var len = Quotdata[str].length;
                var ran = Math.floor(Math.random() * len);
                console.log("Quotations" + Quotdata[str][ran]);
                sendResponse(Quotdata[str][ran]);
                break;
            case 'getQuotation':
                var str = request.topic;
                var len = Quotdata[str].length;
                var ran = Math.floor(Math.random() * len);
                console.log("Quotations" + Quotdata[str][ran]);
                sendResponse(Quotdata[str][ran]);
                break;
        }
    }
);

/*Tab details
let url = new URL('https://developer.mozilla.org/en-US/docs/Web/API/URL/host');
console.log(url.host); // "developer.mozilla.org"
*/
function removeTab(id) {
    chrome.tabs.remove(id);
}
var focusSet = null;

function StartFocus() {
    DataSet.autoFocus.active = true;
    SetDateset(DataSet);

    focusSet = setInterval(() => {
        getCurrentTab().then((tab) => {
            if (tab != undefined) {
                let testUrl = new URL(tab.url);
                for (var hosti = 0; hosti < DataSet.autoFocus.block.length; hosti++) {
                    if (testUrl.hostname == DataSet.autoFocus.block[hosti]) {
                        console.log("Removed tab:", testUrl.hostname);
                        removeTab(tab.id);
                    }
                }
            }
        });
    }, 1000);
}

function StopFocus() {
    clearInterval(focusSet);
    DataSet.autoFocus.active = false;
}
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
/*Audio playing*/
//console.log(chrome.runtime.getURL("soundScapes/Adventure.mp3"));
async function playSound(source = chrome.runtime.getURL("soundScapes/Adventure.mp3"), volume = 1) {
    console.log("start audio process");
    await createOffscreen();
    await chrome.runtime.sendMessage({ 'message': 'offScrPlay', play: { source, volume } });
}
async function StopSound() {
    console.log("stop audio process");
    await createOffscreen();
    await chrome.runtime.sendMessage({ 'message': 'offScrStop' });
}
async function VolumeSound(volume = 1) {
    console.log("change vol audio process");
    await createOffscreen();
    await chrome.runtime.sendMessage({ 'message': 'offScrVol', 'volume': volume });
}


async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'testing' // details for using the API
    });
    //notify("offscreen started", "check it.");
}
var DummyVcard = {
    username: "rpkr",
    name: "Pranay Kumar R R",
    bio: `As a web developer with a passion for innovation, I strive to create exceptional and distinct digital products. Currently, I am focused on developing backend-management systems, while in the past, I have successfully prototyped several commercial websites that achieved consistent high scores in Google Search Console and impressive user experience Lighthouse scores.
<br>
My enthusiasm and curiosity for the field drive me to seek out new opportunities to challenge myself and grow as a web developer. I am excited to explore new avenues in this ever-evolving field and contribute to creating remarkable digital experiences.
<br>
<b>"My work hours starts at 5:00 AM & ends at 10:00 PM. It's a long day. But I love to be so...
I can't sit idle. so, I even search for ideas to implement."</b>`,
    Photo: "",
    button: [
        { name: "Portfolio", link: "https://pranay.wethinc.in" }
    ],
    social: [
        { type: "Github", link: "rpranaykumarreddy" },
        { type: "Linkedin", link: "rpranaykumarreddy" },
        { type: "Twitter", link: "rpkr_inc" },
        { type: "Snapchat", link: "rpkr_inc" },
        { type: "Whatsapp", link: "917680904589" }
    ]
}
/*Dummy data for the first time request*/
var Dummy = {
    username: "rpkr",
    name: "Ravula Pranay Kumar Reddy",
    firstName: "Ravula Pranay Kumar",
    lastName: "Reddy",
    nickName: "Pranu",
    search: "http://www.google.com/search",
    quote: "",
    quoteAuthor: "",
    quoteCat: ["Life", "Positive", "Education"],
    quoteLastUpdate: 100,
    todo: [
        "varun",
        "reddy",
        "bokka"
    ],
    sidebar: [
        "https://wethinc.in",
        "https://youtube.com",
        "https://github.com/rpranaykumarreddy",
        "https://practice.geeksforgeeks.org/batch/cip-1",
        "https://discord.com/channels/783758394166345779/790483500264456192",
        "https://www.linkedin.com/in/rpranaykumarreddy/"
    ],
    battery: {
        lowLevel: 30,
        highLevel: 80,
        step: 25,
        alarmMin: 15
    },
    workspaces: [{
        name: "Mails",
        icon: "icon/mail.svg",
        urls: [
            "https://mail.google.com/mail/u/0/#inbox",
            "https://mail.google.com/mail/u/1/#inbox",
            "https://mail.google.com/mail/u/2/#inbox",
            "https://mail.google.com/mail/u/3/#inbox",
            "https://mail.google.com/mail/u/4/#inbox",
            "https://www.icloud.com/mail/",
            "https://outlook.office365.com/mail/",
            "https://www.linkedin.com/in/rpranaykumarreddy/",
            "https://twitter.com/home",
            "https://app.slack.com/client/T04FU1XRVJQ/C04FB1VJCUX"
        ]
    },
        {
            name: "Dev",
            icon: "icon/logo-docker.svg",
            urls: [
                "https://www.theodinproject.com/paths/foundations/courses/foundations",
                "https://fireship.io/courses/",
                "https://beta.reactjs.org/learn",
                "https://scrimba.com/learn/learnreact",
                "https://www.youtube.com/c/WebDevSimplified/playlists",
                "https://nodejs.org/en/docs/guides/",
                "https://www.tutorialsteacher.com/nodejs",
                "https://beta.reactjs.org/",
                "https://create-react-app.dev/docs/getting-started"
            ]
        },
        {
            name: "Design",
            icon: "icon/logo-figma.svg",
            urls: [
                "https://usepanda.com/?ref=producthunt",
                "https://fontflipper.com/upload",
                "https://undraw.co/illustrations",
                "https://jitter.video/templates/",
                "https://ionic.io/ionicons",
                "https://designstripe.com/search/illustrations/startup"
            ]
        },
        {
            name: "Filmmaking",
            icon: "icon/videocam.svg",
            urls: ["https://www.indieshortsmag.com/",
                "https://en.wikipedia.org/wiki/Hero%27s_journey",
                "http://www.movieoutline.com/",
                "https://gointothestory.blcklst.com/90-archive-links-f9c2db802548",
                "https://www.youtube.com/user/filmriot/videos",
                "https://www.youtube.com/user/FilmmakerIQcom/videos",
                "https://www.hurlbutacademy.com/browse/",
                "http://www.jamuura.com/blog/",
                "https://nofilmschool.com/topics/directing",
                "https://www.filmmaking.net/",
                "https://filmora.wondershare.com/video-editor/best-free-video-editing-software-without-watermark.html",
                "https://naalyrics.com/search/?q=sianikudu",
                "https://www.telugulyrics.co.in/page/2/?s=krishna",
                "http://telugu.surli.in/aaradugula-bullettu-lyrics-atthaarintiki-daaredi/"
            ]
        }
    ],
    sound: {
        music: "soundScapes/Adventure.mp3",
        play: false,
        volume: 1
    },
    topApps: [{ link: "https://github.com/rpranaykumarreddy", name: "Github", icon: "icon/logo-github.svg" },
        { link: "https://practice.geeksforgeeks.org/batch/cip-1", name: "GFG", icon: "icon/logo-codepen.svg" },
        { link: "https://discord.com/channels/783758394166345779/790483500264456192", name: "Discord", icon: "icon/logo-discord.svg" },
        { link: "https://www.linkedin.com/in/rpranaykumarreddy/", name: "Linkedin", icon: "icon/logo-linkedin.svg" }
    ],
    countDown: {
        date: null
    },
    autoFocus: {
        active: false,
        block: ["www.youtube.com", "www.instagram.com"],
    },
    contact: [{
        name: "Pranay",
        type: "icon/logo-whatsapp.svg",
        link: "https://wa.me/917680904589"
    },
        {
            name: "Varun",
            type: "icon/logo-whatsapp.svg",
            link: "https://wa.me/917806026905"
        },
        {
            name: "GDSC",
            type: "icon/mail.svg",
            link: "https://mailto:dsciiitbhopal@gmail.com"
        }
    ]
}
var DataSet = null;
var Vcard = null

/*Set Dummy data*/
chrome.storage.local.get(["DataSet"]).then((result) => {
    console.log("Checking Dataset", result);
    if (result.DataSet == undefined) {
        chrome.storage.local.set({ "DataSet": Dummy }).then(() => {
            console.log("DataSet is set to", Dummy);
        });
        DataSet = Dummy;
    } else {
        console.log("I have a local data of dataset", result.DataSet);
        DataSet = result.DataSet;
        if (DataSet.autoFocus.active) {
            StartFocus();
        }
    }
});

function SetDateset(data) {
    chrome.storage.local.set({ "DataSet": data }).then(() => {
        DataSet = data;
        console.log("DataSet is set to", data);
        SendDataToNew();
        serverSetDataset();
    });
}
/*Set Vcard data*/
chrome.storage.local.get(["Vcard"]).then((result) => {
    console.log("Checking Vcard", result);
    if (result.Vcard == undefined) {
        chrome.storage.local.set({ "Vcard": DummyVcard }).then(() => {
            console.log("Vcard is set to", DummyVcard);
        });
        Vcard = DummyVcard;
    } else {
        console.log("I have a local data of Vcard", result.Vcard);
        Vcard = result.Vcard;
    }
});

function SetVcard(data) {
    chrome.storage.local.set({ "Vcard": data }).then(() => {
        Vcard = data;
        console.log("Vcard is set to", data);
        SendVcardToNew()
        serverSetVcard();
    });
}

/*Context Menu settings*/
chrome.runtime.onInstalled.addListener(() => {
    var parent1 = chrome.contextMenus.create({ id: "contextmain", "title": "Add this  page to", "contexts": ["all"] });
    var child1 = chrome.contextMenus.create({ id: "contextside", "title": "Side bar", "parentId": parent1, });
    var child2 = chrome.contextMenus.create({ id: "contextwrk1", "title": "Workspace 1", "parentId": parent1, });
    var child3 = chrome.contextMenus.create({ id: "contextwrk2", "title": "Workspace 2", "parentId": parent1 });
    var child4 = chrome.contextMenus.create({ id: "contextwrk3", "title": "Workspace 3", "parentId": parent1 });
    var child5 = chrome.contextMenus.create({ id: "contextwrk4", "title": "Workspace 4", "parentId": parent1 });
});

function contextClick(info, tab) {
    console.log(info, tab);
    const { menuItemId } = info;
    const { pageUrl } = info;
    switch (menuItemId) {
        case 'contextwrk1':
            var l = DataSet.workspaces[0].urls.length;
            DataSet.workspaces[0].urls[l] = pageUrl;
            console.log(DataSet.workspaces[0].urls);
            break;
        case 'contextwrk2':
            var l = DataSet.workspaces[1].urls.length;
            DataSet.workspaces[1].urls[l] = pageUrl;
            console.log(DataSet.workspaces[1].urls);
            break;
        case 'contextwrk3':
            var l = DataSet.workspaces[2].urls.length;
            DataSet.workspaces[2].urls[l] = pageUrl;
            console.log(DataSet.workspaces[2].urls);
            break;
        case 'contextwrk4':
            var l = DataSet.workspaces[3].urls.length;
            DataSet.workspaces[3].urls[l] = pageUrl;
            console.log(DataSet.workspaces[3].urls);
            break;
    }
    SetDateset(DataSet);
}

chrome.contextMenus.onClicked.addListener(contextClick);

/*Universal Notification function*/
function notify(tit, msg) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'logo128.png',
        title: tit,
        message: msg,
        priority: 2
    });
}
var boolBatNoti = true;

function notifyBat(tit, msg) {
    if (boolBatNoti) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'logo128.png',
            title: tit,
            message: msg,
            priority: 2
        });
        boolBatNoti = false;
        setTimeout(() => {
            boolBatNoti = true;
        }, 900 * 1000);
    }
}

/*Opening a particular work function*/
function workSpacesOpen(type) {
    for (i = 0; i < DataSet.workspaces[type].urls.length; i++) {
        chrome.tabs.create({ url: DataSet.workspaces[type].urls[i], active: false, index: 50 });
    }
}

function contactOpen(type) {
    chrome.tabs.create({ url: DataSet.contact[type].link, active: false, index: 50 });
}

function TopIconOpen(type) {
    chrome.tabs.create({ url: DataSet.topApps[type].link, active: false, index: 1 });
}
/*Quotations data to load*/
var Quotdata = null;
StoreQuotation();

function StoreQuotation() {
    fetch(chrome.runtime.getURL("filteredData.json"))
        .then(response => response.json())
        .then(parsedData => {
            Quotdata = parsedData;
            //console.log("Parsedata", Quotdata);
        })
        .catch(error => console.error(error));
}

/*send new Data to pop*/
function SendDataToNew() {
    if (DataSet == null) { } else {
        chrome.runtime.sendMessage({ 'message': 'SendingDataSet', 'Dataset': DataSet }, function (response) {
            //console.log('response', response);
        });
        const d = new Date();
        if ((DataSet.quoteLastUpdate < (d.getTime() - 86400))) {
            var Tlen = DataSet.quoteCat.length;
            var Tran = Math.floor(Math.random() * Tlen);
            var str = DataSet.quoteCat[Tran];
            var Qlen = Quotdata[str].length;
            var Qran = Math.floor(Math.random() * Qlen);
            var q = Quotdata[str][Qran];
            DataSet.quote = q.Quote;
            DataSet.quoteAuthor = q.Author;
            DataSet.quoteLastUpdate = d.getTime();
            SetDateset(DataSet);
        }
    }
} function SendVcardToNew() {
    if (Vcard == null) { } else {
        chrome.runtime.sendMessage({ 'message': 'SendingVcard', 'Vcard': Vcard }, function (response) {
            //console.log('response', response);
        });
    }
}



chrome.identity.getAuthToken({
    interactive: true
}, function (token) {
    console.log(token);
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    const userInfoUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
    fetch(userInfoUrl)
        .then(response => response.json())
        .then(userInfo => {
            console.log(userInfo);
            const email = userInfo.email;
            const id = userInfo.sub;
            DummyVcard.Photo = userInfo.picture;
            console.log(`User email: ${email}`);
            console.log(`User ID: ${id}`);
            return userInfo;
        })
        .then(data => {
            putVcardByNameFor(DummyVcard.username, DummyVcard);
        });
});
function serverSetDataset() {
    chrome.identity.getAuthToken({
        interactive: true
    }, function (token) {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }
        const userInfoUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
        fetch(userInfoUrl)
            .then(response => response.json())
            .then(data => {
                putDataSetFor(data.sub, DataSet);
            });
    });
}
function serverSetVcard() {
    chrome.identity.getAuthToken({
        interactive: true
    }, function (token) {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }
        fetch('http://localhost:3000/wruser', {
            method: 'POST',
            headers: {
                'X-User-Id': DataSet.username,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Vcard)
        }).then((response) => {
            console.log("vcard Set response success", response.statusText);
            return response.status;
        }).catch((error) => {
            console.error("vcard Set response error", error);
            return 500;
        });
    });
}

/*
    Things to handle by API
    three collections: chrome, link, vcard.
    s.N | Title                 | Read by       |   Status
    1   | Read Chrome           | ID            |   Done
    2   | Write Chrome          | ID            |   Done
    3   | Read Vcard            | Name          |   NAN
    4   | Write Vcard           | Name          |   
    5   | Read Vcard            | ID            |   Done
    6   | Check Username        | Name
*/

function getDataSetFor(passUserId) {
    passUserId = toString(passUserId);
    let passLink = 'http://localhost:3000/chdata/' + passUserId;
    fetch(passLink).then((response) => {
        console.log("getDataSetFor fetch response success", response.statusText);
        return response;
    }).catch((error) => {
        console.error("getDataSetFor fetch response error", error);
        return null;
    });
}

function putDataSetFor(passUserId, body) {
    fetch('http://localhost:3000/chdataid', {
        method: 'POST',
        headers: {
            'X-User-Id': passUserId,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then((response) => {
            console.log("putDataSetFor post response success", response.statusText);
            return response.status;
        })
        .catch((error) => {
            console.error("putDataSetFor post response error", error);
            return 500;
        });
}

function getVcardByNameFor(passUsername) {
    let passLink = 'http://localhost:3000/users/' + passUsername;
    fetch(passLink).then((response) => {
        console.log("getDataSetFor fetch response success", response.statusText);
        return response;
    }).catch((error) => {
        console.error("fetch response error", error);
        return null;
    });
}

function putVcardByNameFor(passUsername, body) {
    fetch('http://localhost:3000/wruser', {
        method: 'POST',
        headers: {
            'X-User-Id': passUsername,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then((response) => {
            console.log("vcard Set response success", response.statusText);
            return response.status;
        })
        .catch((error) => {
            console.error("vcard Set response error", error);
            return 500;
        });
}

function getVcardByIDFor(passUserId) {
    passUserId = toString(passUserId)
    let passLink = 'http://localhost:3000/reuserid/' + passUserId;
    fetch(passLink).then((response) => {
        console.log("getDataSetFor fetch response success", response.statusText);
        return response;
    }).catch((error) => {
        console.error("fetch response error", error);
        return null;
    });
}

function checkUserNameFor(passUsername, passUserId) {
    let st = toString(passUserId);
    let usno = { userid: st };
    passUserId = toString(passUserId);
    fetch('http://localhost:3000/chusername', {
        method: 'GET',
        headers: {
            'X-User-Name': passUsername,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usno)
    }).then((response) => {
        console.log("fetch response success", response.statusText);
        return response.status;
    }).catch((error) => {
        console.error("fetch response error", error);
        return 500;
    });
}
