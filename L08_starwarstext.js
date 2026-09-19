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

let bgMusic;

function preload() {
    bgMusic = loadSound("02. String Theocracy.");
}
function setup() {
    createCanvas(600, 400);
    textAlign(LEFT, CENTER);
    textSize(24);
    fill("rgb(255, 255, 0)")

    yPos = height;
    bgMusic.loop()
}

function draw() {
    background(0);
    for (let i = 0; i < storyText.length; i++) {
        text(storyText[i], width / 4, yPos + i * 30);
    }
    yPos -= 1;
}