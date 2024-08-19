(() => {
    function findLargestVideo() {
        const videos = Array.from(document.querySelectorAll('video'))
            .filter(video => video.readyState !== 0 && !video.disablePictureInPicture)
            .sort((v1, v2) => {
                const v1Rect = v1.getBoundingClientRect();
                const v2Rect = v2.getBoundingClientRect();
                return (v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height);
            });

        if (videos.length === 0) {
            return null;
        }

        return videos[0];
    }

    async function requestPictureInPicture(video) {
        await video.requestPictureInPicture();
        video.setAttribute('pip-active', true);
        video.addEventListener('leavepictureinpicture', () => {
            video.removeAttribute('pip-active');
        }, { once: true });

        new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
    }

    function maybeUpdatePictureInPictureVideo(entries, observer) {
        const observedVideo = entries[0].target;
        if (!document.querySelector('[pip-active]')) {
            observer.unobserve(observedVideo);
            return;
        }
        const video = findLargestVideo();
        if (video && !video.hasAttribute('pip-active')) {
            observer.unobserve(observedVideo);
            requestPictureInPicture(video);
        }
    }

    (async () => {
        const video = findLargestVideo();
        if (!video) {
            return;
        }
        if (video.hasAttribute('pip-active')) {
            document.exitPictureInPicture();
            return;
        }
        await requestPictureInPicture(video);
    })();
})();
