// GSAP animation timeline
export function createGsapTimeline(titleContainer) {
    const gsapTl = gsap.timeline({defaults: {duration: .75}});

    gsapTl
        .to(titleContainer, {opacity: 1})
        .fromTo(titleContainer, {y: 10}, {y: 0}, "<");

    return gsapTl;
}

// Generator function to create a random order
export function* generateRandomOrder(iconCells) {
    // Create an array with numbers from 0 to icons.length - 1
    let numbers = [];
    for (let i = 0; i < iconCells.length; i++) {
        numbers.push(i);
    }

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
