let yPos; 
let storyText = [
    "A long time ago in a galaxy far,",
    "far away...",
    "",
    "EPISODE I",
    "THE BEGINNING",
    "",
    "It is a period of civil war.",
    "Rebel spaceships, striking",
    "from a hidden base, have",
    "won their first victory",
    "against the evil Galactic",
    "Empire",
];
function setup() {
    createCanvas(600, 400);
    textAlign(LEFT, CENTER);
    textSize(24);
    fill("rgb(255, 255, 0)")

    yPos = height;
}

function draw() {
    background(0);
        for (let i = 0; i < storyText; i++) {

    }
    yPos -= 1;
}