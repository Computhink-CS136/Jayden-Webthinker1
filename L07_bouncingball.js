let picoImage;
let popSound;

function preload() {
    picoImage = loadImage("assets/pico-a.png")
    popSound = loadSound("assets/pop.mp3")
}

function setup() {
    createCanvas(600, 400);
}
let speed = 5;
let x = 100;
let y = 200;
function draw() {
    background("gray");
    image(staticImage, x, y, 100, 100);
}