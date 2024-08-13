import { iconsArr } from "./iconsInfo.js";

const body = document.querySelector("body");
const titleEl = document.getElementById("title");
const icons = document.querySelectorAll(".icon");
const modal = document.getElementById("modal");


// Checks if the body contains a class to display the modal
body.addEventListener("click", event => {
    if(modal.classList.contains("display-modal") && event.target === modal){
        modal.classList.remove("display-modal");
    };
});

// Adds an eventListener to each icon in the array
icons.forEach((icon, index) => {
        icon.addEventListener("mouseenter", () => {
            if(icon.classList.contains("empty-icon")){
                titleEl.innerText = "coming soon...";
            }

            titleEl.innerText = iconsArr[index].name.toLowerCase();
        })

        icon.addEventListener("mouseleave", () => {
            titleEl.innerHTML = "iconswith.<span>life</span>";
        })
    }
);

// Shows a modal with each icon's info
icons.forEach((icon, index) => {
    if(!icon.classList.contains("empty-icon")){

        icon.addEventListener("click", () => {

            updateModal(iconsArr[index]);
            displayModal("flex");

        })
    }
})

closeModal.addEventListener("click", () => {
    displayModal("none");
});

function updateModal(icon){
    const iconContainer = document.getElementById("iconContainer");
    const downloadSvg = document.getElementById("downloadSvg");
    const downloadJson = document.getElementById("downloadJson");
    const textarea = document.querySelector("textarea");
    
    iconContainer.innerHTML = icon.lottie;

    downloadSvg.setAttribute("href", icon.url[1].svg);
    downloadSvg.setAttribute("download", `${icon.name}.svg`);

    downloadJson.setAttribute("href", icon.url[0].json);
    downloadJson.setAttribute("download", `${icon.name}.json`);

    textarea.innerText = icon.jsonCode;
}

function displayModal(){
    modal.classList.toggle("display-modal");
};

// GSAP ==========================
const gsapTl = gsap.timeline({defaults: {duration: .75}});

gsapTl
    .to(titleContainer, {opacity: 1})
    .fromTo(titleContainer, {y: 10}, {y: 0}, "<")

    function* generateRandomOrder() {
        // Create an array with numbers from 0 to 10
        let numbers = [];
        for (let i = 0; i < icons.length; i++) {
            numbers.push(i);
        }
    
        //  I HAVE NO IDEA HOW THIS WORKS
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
    
        // Yield one number at a time
        for (let number of numbers) {
            yield number;
        }
    }
    
    // Create an instance of the generator
    const randomOrderGenerator = generateRandomOrder();
    
    for (let i = 0; i < icons.length; i++) {
        gsapTl.to(icons[randomOrderGenerator.next().value], {
            opacity: 1,
            duration: .3
        }, "-=.1");
    }

// END OF GSAP ===================

// COPY CODE
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
// END OF COPY CODE

function createIconCell(id, name){
    let iconCell = `
        <div class="icon">
                <lottie-player id="${id}" src="assets/json/${name}.json" background="transparent"  speed="1"  style="width: 50px; height: 50px;" hover loop></lottie-player>
            </div>
        `

    return iconCell;
}