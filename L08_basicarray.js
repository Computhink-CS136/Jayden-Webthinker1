// let squareX = 300;
// let squareY = 200;
// let squareSpeed = 5;
// function setup() {
//     createCanvas(600, 400);
//     background(220);
// }

// function draw() {
//     background(220);

//     // if square x pos goes past right
//     if (squareX > width - 100 || squareX < 0) {
//         squareSpeed *= -1;
//     }

//     squareX += squareSpeed;

//     fill(255, 255, 0);
//     rect(squareX, squareY, 100, 100);
// }

// function setup() {
//     createCanvas(600, 400);
//     background(220);

//     textSize(45);
//     textAlign(CENTER, CENTER);
//     text("ibuprofen", width / 2, height / 2);
// }

// function draw() {

// }

// function setup() {
//     createCanvas(600, 400);
//     background(220);

//     textSize(40);
//     text("My name is Jayden", 50, 50);
//     text("I am 13 this year", 50, 100);
//     text("I like gaming", 50, 150);
// }

let favouritefood = ["Pizza", "Burger", "Sushi", "Tacos", "Pasta"];

function setup() {
    createCanvas(400, 400);
    textSize(24);
    textAlign(LEFT, TOP);
}

function draw() {
    background(220);

    fill(0);
    text("My favorite foods:", 50, 50);
    
    for (let i = 0; i < favouritefood.length; i++) {
        text((i + 1) + ". " + favouritefood[i], 50, 80, + i)
    }
}