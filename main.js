import { createGsapTimeline, generateRandomOrder } from "./js/animations.js";
import { pauseClickHover, playClickHover, playCloseModal, playOpenModal } from "./js/soundFx.js";

const body = document.querySelector("body");
const titleContainer = document.getElementById("titleContainer");
const titleEl = document.getElementById("title");
const modal = document.getElementById("modal");
const gridEl = document.getElementById("grid");
const iconCells = [];

const root = document.querySelector(":root");
const bgColor = "hsl(0, 0%, 100%)";
const bgColorDark = "hsl(0, 0%, 92%)";
root.style.setProperty("--background-color-white", bgColor);

const NEW_ICON_BATCH = 5;

class Icon {
    constructor(id, name, size, needsSVG = false, isNew = false) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.jsonUrl = `assets/json/${name}.json`;
        this.svgUrl = `assets/svg/${name}.svg`;
        this.needsSVG = needsSVG;
        this.isNew = isNew;
    }

    // Method to generate Lottie HTML, with optional SVG for main display
    getLottieHTML(isModal = false) {
        const width = isModal ? 100 : this.size;  // 100px for modal, size for main grid
        const height = isModal ? 100 : this.size;

        // If it's not modal and needs SVG, include the SVG in the HTML
        const svgHTML = this.needsSVG && !isModal
            ? `<img src="${this.svgUrl}" alt="${this.name} icon" style="width: ${width}px; height: ${height}px;">`
            : '';  // Empty string if SVG is not needed or if it's modal

        // Determine Lottie player behavior: hover for main grid, autoplay for modal
        const behavior = isModal ? 'autoplay' : 'hover';

        // Return the complete HTML with conditional SVG and Lottie animation
        return `
            ${svgHTML}  <!-- Include SVG only if needed -->
            <lottie-player 
                id="${this.id}" 
                src="${this.jsonUrl}" 
                background="transparent" 
                speed="1"  
                style="width: ${width}px; height: ${height}px;" 
                ${behavior} loop>
            </lottie-player>
        `;
    }
}


// Helper function to create icons
const createIcon = (id, name, size = 30, needsSVG = false, isNew = false) => new Icon(id, name, size, needsSVG, isNew);

// Unique icon definitions
const iconsArr = [
    createIcon(1, 'close_Icon'),
    createIcon(2, 'plus_Icon'),
    createIcon(3, 'alert_Icon', 30, true, false),
    createIcon(4, 'search_Icon_V2'),
    createIcon(5, 'plus_Close_Icon'),
    createIcon(6, 'share_Icon'),
    createIcon(7, 'menu_Icon'),
    createIcon(8, 'sidebar_Icon'),
    createIcon(9, 'box_Icon'),
    createIcon(10, 'download_Icon', 30, true, true),
    createIcon(11, 'arrow_Left_Icon'),
    createIcon(12, 'info_Icon_V2'),
    createIcon(13, 'beer_Icon', 30),
    createIcon(14, 'rocks_Icon', 30),
    createIcon(15, 'watermelon_Icon', 30),
    createIcon(17, 'old_fashion_Icon', 30),
    createIcon(18, 'wedge_Icon', 30),
];

// Creates a cell element with an icon for each icon object created 
iconsArr.forEach((icon, index) => {
    let cell = document.createElement("div");
    cell.classList.add("icon");
    cell.innerHTML = icon.getLottieHTML();

    // Creates Icon Tag for the last NEW_ICON_BATCH elements
    if (index >= iconsArr.length - NEW_ICON_BATCH) {
        createIconTag(cell);
    }

    iconCells.push(cell);
});

// Fills the rest of the grid with empy cells (if needed)
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
        titleEl.innerText = iconsArr[index].name.toLowerCase();
    }
});

cell.addEventListener("mouseleave", () => {
    titleEl.innerHTML = "iconswith.<span>life</span>";
    pauseClickHover();
});

if(!cell.classList.contains("empty-icon")) {
    
    cell.addEventListener("click", () => {
        updateModal(iconsArr[index]);
        displayModal("flex");
        playOpenModal();
        changeBodyColor(bgColorDark);

        if(index >= iconsArr.length - NEW_ICON_BATCH){
            createIconTag(modal);
        }

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
    iconContainer.innerHTML = icon.getLottieHTML(true);
}

function updateIconName(icon) {
    const iconNameModal = document.getElementById("iconNameModal");
    iconNameModal.innerText = icon.name.toLowerCase();
}

function updateDownloadLinks(icon) {
    const downloadSvg = document.getElementById("downloadSvg");
    const downloadJson = document.getElementById("downloadJson");
    
    downloadSvg.setAttribute("href", icon.svgUrl);
    downloadSvg.setAttribute("download", `${icon.name}.svg`);
    
    downloadJson.setAttribute("href", icon.jsonUrl);
    downloadJson.setAttribute("download", `${icon.name}.json`);
}

function updateTextarea(jsonContent) {
    const textarea = document.querySelector("textarea");
    textarea.textContent = JSON.stringify(jsonContent, null, 1);  // Format and display JSON in the textarea
}

function fetchJsonData(icon){
    // Fetch the JSON file for the clicked icon
    fetch(icon.jsonUrl)   
    .then(response => response.json())  // Convert response to JSON object
    .then(data => updateTextarea(data))  // Pass the fetched JSON data to updateTextarea        
    .catch(error => console.error('Error fetching JSON:', error))  // Handle any fetch errors;
}

function updateModal(icon) {
    updateIconContainer(icon);
    updateIconName(icon);
    updateDownloadLinks(icon);
    fetchJsonData(icon);
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
function createIconTag(parent) {
    const iconContainer = parent.querySelector(".icon-container") || parent; // Fallback to parent if there's no container
    const newIconTag = document.createElement("div");
    
    // Determine the class name based on whether the parent is the modal
    const isModal = parent === modal;
    newIconTag.classList.add(isModal ? "new-icon-tag-modal" : "new-icon-tag");

    // Set inner content for modal case
    if (isModal) {
        newIconTag.innerHTML = `<p>new</p>`;
    }

    // Append the new icon tag
    iconContainer.appendChild(newIconTag);
}
//END OF NEW ICON TAG
