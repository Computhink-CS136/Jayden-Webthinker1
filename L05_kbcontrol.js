let rectSize = 50;

function setup() {
    createCanvas(400, 400);
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
function keyPressed() {
    let randomSize = random(5, 21)
    let randomCol = color(random(0, 255), random(0, 255), random(0, 255));
    fill(randomCol)
    noStroke()
    circle(random(0, 400), random(0, 400), randomSize);
        
}
function keyReleased() {
    
}