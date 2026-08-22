function setup() {
    createCanvas(400, 400);
    background(220)
}
let x = 200
let y = 200
function draw() {
    background(220)
       if (keyIsDown(UP_ARROW)) {
        y -= 2;
    }
    if (keyIsDown(DOWN_ARROW)) {
        y += 2;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        x  += 2;
    }
    if (keyIsDown(LEFT_ARROW)) {
        x  -= 2;
    }
    if (keyIsDown())
    y = constrain(y, 50, 350);
    x = constrain(x, 50, 350);
    rect(x, y, 50, 50);
}