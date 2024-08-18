(() => {
    const getVideoElement = () => {
        return Array.from(document.querySelectorAll("video"))
            .filter(video => video.readyState && !video.disablePictureInPicture)
            .sort((a, b) => {
                const aRect = a.getBoundingClientRect();
                const bRect = b.getBoundingClientRect();
                return (bRect.width * bRect.height) - (aRect.width * aRect.height);
            })[0];
    };

    const enablePiP = async (video) => {
        await video.requestPictureInPicture();
        video.setAttribute("pip-active", true);
        video.addEventListener("leavepictureinpicture", () => {
            video.removeAttribute("pip-active");
        }, { once: true });

        const observer = new ResizeObserver(() => {
            if (!document.querySelector("[pip-active]")) {
                observer.unobserve(video);  // Corrected to reference the observer variable directly
            }
        });
        observer.observe(video);
    };

    (async () => {
        const video = getVideoElement();
        if (video) {
            if (video.hasAttribute("pip-active")) {
                return document.exitPictureInPicture();
            }
            await enablePiP(video);
        }
    })();
})();
