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
        for (let i = 0; i < storyText.length; i++) {
            text((i + 1) + ". " + favouritefood[i], width / 2, yPos + i * 50);
    }
        text("sdd",  width / 2, yPos);
    yPos -= 1;
}