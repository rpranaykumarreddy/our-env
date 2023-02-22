
// Listen for messages from the extension
chrome.runtime.onMessage.addListener(msg => {
    switch (msg.message) {
        case "offScrPlay":
            playAudio(msg.play);
            break;
        case "offScrStop":
            stopAudio();
            break;
        case "offScrVol":
            changeVol(msg.volume);
            break;
    }
});

var audio = new Audio(chrome.runtime.getURL("soundScapes/Adventure.mp3"));
// Play sound with access to DOM APIs
function playAudio({ source, volume }) {
    audio.src = source;
    audio.load();
    audio.volume = volume;
    audio.play();
    console.log("Started playing");
}
function stopAudio() {
    audio.pause();
    console.log("Stoped playing");
}
function changeVol(volume) {
    audio.volume = volume;
    console.log("VOlume changed playing");
}