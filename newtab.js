const fileUploader = document.querySelector('#file-uploader');
async function fileToBase64(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function base64ToFile(base64String) {
    const response = await fetch(base64String);
    const blob = await response.blob();
    return new File([blob], 'video.mp4', { type: 'video/mp4' });
}

async function changeBackground() {
    console.log('changing background');
    await chrome.storage.local.get(['background'], (data) => {
        const videoElement = document.querySelector('#wallpaper');
        const videoSource = document.querySelector('#wallpaper > source');
        if (data.background) {
            console.log(data.background);
            base64ToFile(data.background).then(video => {
                console.log(video);
                videoBlob = new Blob([video], { type: 'video/mp4' });
                videoURL = URL.createObjectURL(videoBlob);
                videoSource.src = videoURL;
                videoElement.load(); // load the new video source
            });
        }
        else {
            console.log('no video')
            videoElement.src = 'wallpaper.mp4'; // default video
        }
    })
}

chrome.storage.local.clear();

fileUploader.addEventListener('change', (e) => {
    console.log(e.target.files[0]); // get list of file objects
    fileToBase64(e.target.files[0]).then(videoBase64 => {
        console.log(videoBase64); // get base64 string of the video
        chrome.storage.local.set({background: videoBase64});
        changeBackground();
    });
});