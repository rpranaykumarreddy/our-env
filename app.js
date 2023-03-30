const site = window.location.hostname;
// var urls = null;
// chrome.runtime.sendMessage({ 'message': 'notify', 'tit': "Side Bar Limit exceeded", 'msg': "Hey folk, you have exceeded the limit of Side bar icons(i.e. 10). Please remove the any app from the settings." }, function (response) {
//     console.log('response', response);
// });

//alert(site + "is opened");
var url = ["https://wethinc.in/blog", "https://www.geeksforgeeks.org", "https://youtube.com", "https://wethinc.in", "https://www.geeksforgeeks.org", "https://youtube.com"];



const custom_element = document.createElement('div');
custom_element.className = "js-custom-element";
custom_element.innerHTML = "";
document.body.append(custom_element);



const addbut = document.createElement('div');
addbut.className = "addbut";
addbut.innerHTML = "<h1>add</h1>";
custom_element.append(addbut);

addbut.addEventListener("click", addbutton, false);

custom_element.addEventListener("mouseover", funin, false);
custom_element.addEventListener("mouseout", funout, false);


function addbutton() {
    if (i < 10) {
        url[i] = window.location.origin;
        console.log(i);
        append(i);
        i = i + 1;
    } else {
        chrome.runtime.sendMessage({ 'message': 'notify', 'tit': "Side Bar Limit exceeded", 'msg': "Hey folk, you have exceeded the limit of Side bar icons(i.e. 10). Please remove the any app from the settings." }, function(response) {
            console.log('response', response);
        });
    }
}


function funin() {
    custom_element.setAttribute("style", "left:0px;")
}

function funout() {
    custom_element.setAttribute("style", "left:-45px;")
}

function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    return url.toString();
}

//   const img = document.createElement('img');
//   img.src = faviconURL("https://www.google.com")
//   document.body.appendChild(img);

function append(inp) {
    var alink = document.createElement("a");
    alink.addEventListener("click", () => { click(inp); }, false);
    custom_element.append(alink);
    var elem1 = document.createElement("img");
    var urlfev = new URL(url[inp]);
    elem1.setAttribute("src", "https://www.google.com/s2/favicons?domain=" + urlfev.host + "&sz=128");
    // elem1.setAttribute("src", urlfev.origin + "/favicon.ico");
    // elem1.setAttribute("src", faviconURL(urlfev.origin));
    elem1.className = "image";
    alink.append(elem1);
}


function click(inp) {
    // window.open(
    //     url[2], "_blank");
    //window.open("https://wethinc.in", "_self");
    chrome.runtime.sendMessage({ 'message': 'openUrl', 'url': url[inp] }, function(response) {
        console.log('response', response);
    });

}


for (i = 0; i < url.length; i++) {
    append(i);
    console.log(i);
    console.log(url[i]);
}


document.addEventListener("keydown", function(event) {
    console.log(event);
    if (event.altKey && event.key == "1") {
        chrome.runtime.sendMessage({ 'message': 'openUrl', 'url': url[0] }, function(response) {
            console.log('response', response);
        });
    }
    if (event.altKey && event.key == "2") {
        chrome.runtime.sendMessage({ 'message': 'openUrl', 'url': url[1] }, function(response) {
            console.log('response', response);
        });
    }
    if (event.altKey && event.key == "3") {
        chrome.runtime.sendMessage({ 'message': 'openUrl', 'url': url[2] }, function(response) {
            console.log('response', response);
        });
    }
})