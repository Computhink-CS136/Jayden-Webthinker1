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
    if (keyIsDown(RIGHT_ARROW)) {
        x  -= 2;
    }

}