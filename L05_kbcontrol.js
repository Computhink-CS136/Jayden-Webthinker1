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

function keyPressed() {
    if (keyPressed == 'c') {
        circle(200, 200, 300);
    }
    elif (keyPressed == 's'); {
        rect(200, 200, 200, 200);
    }
}

function keyReleased() {
background(220)
}