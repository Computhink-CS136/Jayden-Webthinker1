let rectSize = 50;

function setup() {
    createCanvas(400, 400);
    background(220)
}

// function draw() {
//     background(220);
//     rect(width / 2 - rectSize / 2, height / 2 - rectSize / 2, rectSize, rectSize);
// }

// function keyPressed() {
//     rectSize = 100;
// }

// function keyReleased() {
//     rectSize = 50;
// }
// function keyPressed() {
//     let number = random(10, 20)
//     for (let i = 0; i < number; i++) {
//         let Size = random(10, 50)
//         let circle_col = color(random(0, 255), random(0, 255), random(0, 255))
//         let circlenum = random(5, 20)
//         let circ_x = random(0, 400)
//         let circ_y = random(0, 400)
//         fill(circle_col)
//         ellipse(circ_x, circ_y, Size, Size)
//     }
// }
// function keyReleased() {
//     background(220)
// }

// function keyPressed() {
//     console.log('hedsdso')
//     if (keyCode === 67) {
//         circle(200, 200, 300);
//         console.log('heo')
//     }
//     if (keyCode === 38) {
//         rect(100, 100, 200, 200);
//         console.log('ur gay')
//     }
// }

// function keyReleased() {
//     background(220)
// }
// function draw() {
//     circle(200, 200, 100)
// }
// function keyPressed() {
//     if (key === 'w') {
//         fill("white");
//     } else if (key === 'r') {
//         fill("red");
//     } else if (key === 'g') {
//         fill("green");
//     } else {
//         fill("yellow");
//     }
// }
// function mouseMoved() {
//     if (mouseX < 150) {
//         fill("red");
//     } else if (mouseX >= 150 && mouseX < 225) {
//         fill("orange");
//     } else if (mouseX >= 225) {
//         fill("yellow");
//     }
// }
// let x = 0;
// function draw() {
//     if (keyCode == (RIGHT_ARROW)) {
//         x += 1
//     }
//     circle(width / 2 + x, height / 2, 100);
// }
// let x = 0;
// function draw() {
//     if (keyIsDown(RIGHT_ARROW)) {
//         x += 1
//     }
//     circle(width / 2 + x, height / 2, 100);
// }
// let x = 200;

// function draw() {
//     background(220)
//     circle(x, height / 2, 50);
    
//     if (keyIsDown(LEFT_ARROW)) {
//         x -= 5;
//     }
//     if (keyIsDown(RIGHT_ARROW)) {
//         x += 5;
//     }
//     if (x < 25) {
//     x = 25;
// }
// if (x > width - 25) {
//     x = width - 25
// }
// }
let y = 200;
function draw() {
    background(220)
    
    if (keyIsDown(UP_ARROW)) {
        y -= 2;
        direction = "up";
    }
    if (keyIsDown(DOWN_ARROW)) {
        y += 2;
        direction = "down";
    }
    if (direction = "up") {
        triangle(75, y + 25, 100, y - 25, 125, y + 25);
    } else if (direction == "down") {
        triangle(75, y - 25, 100, y + 25, 125, y - 25);
    }
}
