import { jsonArr } from "./js/iconsInfo.js";
import { createGsapTimeline, generateRandomOrder } from "./js/animations.js";

const body = document.querySelector("body");
const titleContainer = document.getElementById("titleContainer");
const titleEl = document.getElementById("title");
const modal = document.getElementById("modal");
const gridEl = document.getElementById("grid");
const iconsArr = [];
const iconCells = [];

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
        }
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

iconsArr.push(closeIcon, plusIcon, alertIcon, searchIcon,plusToCloseIcon, shareIcon, menuIcon, sidebarIcon);

iconsArr.forEach((icon, index) => {
    let cell = document.createElement("div");
    cell.classList.add("icon");
    cell.innerHTML = icon.lottie
    
    iconCells.push(cell);

    if(!cell.classList.contains("empty-icon")) {
        cell.addEventListener("click", () => {
            updateModal(jsonArr[index]);
            displayModal("flex");
            changeBodyColor("hsl(0, 0%, 92%)");
    })};

    // Adds an eventListener to each icon in the array
    cell.addEventListener("mouseenter", () => {
        if(cell.classList.contains("empty-icon")){
            titleEl.innerText = "coming soon...";
        }

        titleEl.innerText = jsonArr[index].name.toLowerCase();
    });

    cell.addEventListener("mouseleave", () => {
        titleEl.innerHTML = "iconswith.<span>life</span>";
    });
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

// Checks if the body contains a class to display the modal
body.addEventListener("click", event => {
    if(modal.classList.contains("display-modal") && event.target === modal){
        modal.classList.remove("display-modal");
        changeBodyColor("hsl(0, 100%, 100%)");
    };
});


closeModal.addEventListener("click", () => {
    displayModal("none");
    changeBodyColor("hsl(0, 100%, 100%)");
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

