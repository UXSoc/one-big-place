let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let bufferCache = {};

export function loadSfx() {
    const sounds = ['alarm', 'error', 'place', 'select', 'success'];
    sounds.forEach(async (sound) => {
        const response = await fetch(`audio/${sound}.wav?ts=${Date.now()}`);
        const arrayBuffer = await response.arrayBuffer();
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            bufferCache[sound] = buffer;
        });
    });
}

export function playSfx(e, vol) {
    const soundBuffer = bufferCache[e];
    if (soundBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = soundBuffer;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = vol;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(0);
    }
}
