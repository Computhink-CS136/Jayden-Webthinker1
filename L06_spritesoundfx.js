function setup() {
    createCanvas(400, 400);
    background(220)
}
let x = 200
let y = 200
let direction = 'up'
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
    if (keyIsDown(RIGHT_ARROW)) {
        x  += 2;
        direction = "right";
    }
    if (keyIsDown(LEFT_ARROW)) {
        x  -= 2;
        direction = "left";
    }
    y = constrain(y, 0, height);
    x = constrain(x, 0, height);
     if (direction == "up") {
        rect(75, y + 25, 100, y, 125, y + 25);
    } else if (direction == "down") {
        triangle(75, y - 25, 100, y, 125, y - 25);
    }
}