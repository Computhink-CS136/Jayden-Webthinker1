let yPos; 
let storyText = [
    "A long time ago in a galaxy far,"
]
function setup() {
    createCanvas(600, 400);
    textAlign(LEFT, CENTER);
    textSize(24);
    fill("rgb(255, 255, 0)")

    yPos = height;
}

function draw() {
    background(0);

    text("sdd",  width / 2, yPos);
    yPos -= 1;
}