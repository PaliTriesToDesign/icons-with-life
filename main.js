import { jsonArr } from "./js/iconsInfo.js";
import { createGsapTimeline, generateRandomOrder } from "./js/animations.js";
import { pauseClickHover, playClickHover, playCloseModal, playEmptyHover, playLogoSound, playOpenModal } from "./js/soundFx.js";

const body = document.querySelector("body");
const titleContainer = document.getElementById("titleContainer");
const titleEl = document.getElementById("title");
const modal = document.getElementById("modal");
const gridEl = document.getElementById("grid");
const iconsArr = [];
const iconCells = [];

const root = document.querySelector(":root");
const bgColor = "hsl(0, 0%, 100%)";
const bgColorDark = "hsl(0, 0%, 92%)";
root.style.setProperty("--background-color-white", bgColor);

const NEW_ICON_BATCH = 4;

class Icon {
    constructor(id, name, size, needsSVG = false) {
        this.id = id;
        this.name = name;
        this.jsonUrl = `assets/json/${name}.json`;
        this.svgUrl = `assets/svg/${name}.svg`;
        this.size = size;
        if(needsSVG) {
            this.lottie = `
            <img src="${this.svgUrl}" alt="${name} icon">
            <lottie-player 
                    id="${id}" 
                    src="${this.jsonUrl}"
                    background="transparent" 
                    speed="1"  
                    style="width: ${this.size}px; 
                    height: ${this.size}px;" 
                    hover loop>
                </lottie-player>
            `;
        } else {
            this.lottie = `
            <lottie-player 
                    id="${id}" 
                    src="${this.jsonUrl}"
                    background="transparent" 
                    speed="1"  
                    style="width: ${this.size}px; 
                    height: ${this.size}px;" 
                    hover loop>
                </lottie-player>
            `;
        };
    };
};

const closeIcon = new Icon(1, 'closeIcon', 30);
const plusIcon = new Icon(2, 'plusIcon', 30);
const alertIcon = new Icon(3, 'alertIcon', 30, true);
const searchIcon = new Icon(4, 'searchIconV2', 30);
const plusToCloseIcon = new Icon(5, 'plusToCloseIcon', 30);
const shareIcon = new Icon(6, 'shareIcon', 30);
const menuIcon = new Icon(7, 'menuIcon', 30);
const sidebarIcon = new Icon(8, 'sidebarIcon', 30);
const boxIcon = new Icon(8, 'boxIcon', 30);
const donwloadIcon = new Icon(8, 'downloadIcon', 30, true);
const arrowLeftIcon = new Icon(8, 'arrowLeftIcon', 30);
const infoIcon = new Icon(8, 'infoIconV2', 30);

iconsArr.push(closeIcon, plusIcon, alertIcon, searchIcon,plusToCloseIcon, shareIcon, menuIcon, sidebarIcon, boxIcon, donwloadIcon, arrowLeftIcon, infoIcon);

iconsArr.forEach((icon, index) => {
    let cell = document.createElement("div");
    cell.classList.add("icon");
    cell.innerHTML = icon.lottie

    // Creates Icon Tag for the last NEW_ICON_BATCH elements
    if (index >= iconsArr.length - NEW_ICON_BATCH) {
        createIconTag(cell);
    }

    iconCells.push(cell);
});

// Fills the rest of the grid with empy cells
const totalCells = 12; // Arbitrary number
const totalEmptyCells = totalCells - iconsArr.length;

for(let i = 0; i <  totalEmptyCells; i++) {
    let cell = document.createElement("div");
    cell.classList.add("icon", "empty-icon");
    cell.innerHTML = "<p>-</p>";
    iconCells.push(cell);
}

iconCells.forEach(cell => {
    gridEl.appendChild(cell);
})

// Adds an eventListener to each ICON CELL in the array;
iconCells.forEach((cell, index) => {
cell.addEventListener("mouseenter", () => {  
    
    playClickHover();
    
    if(cell.classList.contains("empty-icon")){
        titleEl.innerText = "coming soon...";
    } else {
        titleEl.innerText = jsonArr[index].name.toLowerCase();
    }
});

cell.addEventListener("mouseleave", () => {
    titleEl.innerHTML = "iconswith.<span>life</span>";
    pauseClickHover();
});

if(!cell.classList.contains("empty-icon")) {
    
    cell.addEventListener("click", () => {
        updateModal(jsonArr[index]);
        displayModal("flex");
        playOpenModal();
        changeBodyColor(bgColorDark);
        })
    };
})

// Checks if the body contains a class to display the modal
body.addEventListener("click", event => {
    if(modal.classList.contains("display-modal") && event.target === modal){
        modal.classList.remove("display-modal");
        playCloseModal();
        changeBodyColor(bgColor);
    };
});


closeModal.addEventListener("click", () => {
    displayModal("none");
    playCloseModal();
    changeBodyColor(bgColor);
});

// UPDATE MODAL ELEMENTS =========
function updateIconContainer(icon) {
    const iconContainer = document.getElementById("iconContainer");
    iconContainer.innerHTML = icon.lottie;
}

function updateIconName(icon) {
    const iconNameModal = document.getElementById("iconNameModal");
    iconNameModal.innerText = icon.name.toLowerCase() + " icon";
}

function updateDownloadLinks(icon) {
    const downloadSvg = document.getElementById("downloadSvg");
    const downloadJson = document.getElementById("downloadJson");
    
    downloadSvg.setAttribute("href", icon.url[1].svg);
    downloadSvg.setAttribute("download", `${icon.name}.svg`);
    
    downloadJson.setAttribute("href", icon.url[0].json);
    downloadJson.setAttribute("download", `${icon.name}.json`);
}

function updateTextarea(icon) {
    const textarea = document.querySelector("textarea");
    textarea.innerText = icon.jsonCode;
}

function updateModal(icon) {
    updateIconContainer(icon);
    updateIconName(icon);
    updateDownloadLinks(icon);
    updateTextarea(icon);
}

function displayModal(){
    modal.classList.toggle("display-modal");
};

function changeBodyColor(color){
    body.style.backgroundColor = color;
}
// END OF UPDATE MODAL ELEMENTS ==

// COPY CODE FUNCTION ============
const jsonTextarea = document.getElementById("jsonCode");

jsonTextarea.addEventListener("mouseenter", () => {
    jsonTextarea.parentElement.appendChild(copiedTooltip());    
})
jsonTextarea.addEventListener("mouseleave", () => {
    document.querySelector(".copy-tool-tip").remove(); 
})

jsonTextarea.addEventListener("click", () => {      
    copyToClipboard(jsonTextarea);
    document.querySelector(".copy-tool-tip").innerText = "Copied!"; 
})

function copyToClipboard(json){
    let jsonCode = json.textContent;
    let tempInput = document.createElement('input');
    tempInput.value = jsonCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function copiedTooltip(){
    let copiedTooltip = document.createElement('div');
    copiedTooltip.classList.add('copy-tool-tip');
    copiedTooltip.innerText = 'Copy Code';
    return copiedTooltip;
}
// END OF COPY CODE FUNCTION =====

// GSAP IMPORTS ==================
const gsapTl = createGsapTimeline(titleContainer);
const randomOrderGenerator = generateRandomOrder(iconCells);

// Apply GSAP animations to icons in random order
for (let i = 0; i < iconCells.length; i++) {
    gsapTl.to(iconCells[randomOrderGenerator.next().value], {
        opacity: 1,
        duration: .3
    }, "-=.25");
}
// END OF GSAP IMPORTS ===========

const icons = document.querySelectorAll(".icon");

icons.forEach(icon => {
    let lottie = icon.querySelector("lottie-player");

    if(!icon.classList.contains("empty-icon")) {
        icon.addEventListener("mouseenter", () => {
            lottie.play();
        });

        icon.addEventListener("mouseleave", () => {
            lottie.stop();
        });
    };
});

modal.querySelector(".textarea").addEventListener("click", () => {
    playOpenModal();
});

const downloadButtons = modal.querySelectorAll(".button-container a");
downloadButtons.forEach(button => {
    button.addEventListener("mouseenter", () => {
        playClickHover();
    })
    button.addEventListener("click", () => {
        playOpenModal();
    })
});

// NEW ICON TAG
function createIconTag(cell){
    const newIconTag = document.createElement("div");
    newIconTag.classList.add("new-icon-tag");
    cell.appendChild(newIconTag);
};
//END OF NEW ICON TAG