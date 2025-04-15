export function playSfx(e, vol) {
    var audio = document.getElementById(`audio-${e}`);
    audio.currentTime = 0;
    audio.volume = vol;
    audio.play();
}
export function loadSfx() {
    const sounds = ['alarm', 'error', 'place', 'select', 'success'];
    const container = document.getElementById('audio-container');
    for (var sound of sounds) {
        var audio = document.createElement('audio');
        audio.src = `audio/${sound}.wav`;
        audio.id = `audio-${sound}`
        container.append(audio);
    }
}