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
    return response.blob();
}

async function changeBackground() {
    console.log('changing background');
    await chrome.storage.local.get(['background'], (data) => {
        base64ToFile(data.background).then(blob => {
            console.log(blob);
            blobURL = URL.createObjectURL(new Blob([blob]));
            // could not use blobURL = URL.createObjectURL(blob);
            chrome.storage.local.get(['backgroundType'], (data) => {
                const imageElement = document.querySelector('#image-wallpaper');
                const videoElement = document.querySelector('#video-wallpaper');
                const videoSource = document.querySelector('#video-wallpaper > source');

                if (data.backgroundType === 'image') {
                    imageElement.src = blobURL; 
                    imageElement.style.display = '';
                    videoElement.style.display = 'none';
                    videoSource.src = "";
                    videoElement.load(); // load the new video source
                } else {
                    imageElement.style.display = 'none';
                    videoElement.style.display = '';
                    videoSource.src = blobURL;
                    videoElement.load(); // load the new video source
                }
            });
        });
    });

}

chrome.storage.local.clear();

fileUploader.addEventListener('change', (e) => {
    console.log(e.target.files[0]); // get list of file objects
    if (e.target.files[0].type.startsWith('image/')) {
        chrome.storage.local.set({backgroundType: 'image'});
    } else {
        chrome.storage.local.set({backgroundType: 'video'});
    }
    fileToBase64(e.target.files[0]).then(base64String => {
        chrome.storage.local.set({background: base64String});
        changeBackground();
    });
});