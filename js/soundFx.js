const clickHover = document.getElementById("clickHover");
const clickHoverEmpty = document.getElementById("clickHoverEmpty");
const openModal = document.getElementById("openModalSound");
const closeModal = document.getElementById("closeModalSound");
const logoEl = document.getElementById("logoContainer");
const soundWaves = document.getElementById("soundWaves");

const audioElements = [clickHover, clickHoverEmpty, openModal, closeModal];
audioElements.forEach(element => element.volume = 0.3);

let isSoundOn = true;


soundWaves.addEventListener("click", () => {
    if(isSoundOn) {
        isSoundOn = false;
        soundWaves.classList.toggle("sound-on");
    } else {
        isSoundOn = true;
        soundWaves.classList.toggle("sound-on");
        playOpenModal();
    }
})


export function playClickHover() {
    if(isSoundOn) {
        clickHover.play();
    }
};

export function playEmptyHover() {
    if(isSoundOn) {
        clickHoverEmpty.play();
    }
};

export function pauseClickHover() {
    clickHover.currentTime = 0;
}

export function playOpenModal() {
    if(isSoundOn){
        openModal.play();
        openModal.currentTime = 0;
    }
}

export function playCloseModal() {
    if(isSoundOn){
        closeModal.play();
    }
}

// LOGO ==========================
export function playLogoSound() {
    logoEl.addEventListener("mouseenter", () => {
        if(isSoundOn){
            openModal.play();
            }
        })

    logoEl.addEventListener("mouseleave", () => {
        openModal.pause();
        openModal.currentTime = 0;
    })
}

playLogoSound();
// END OF LOGO ===================