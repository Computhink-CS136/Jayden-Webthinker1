let placeField;
let submitButton;

function setup() {
    createCanvas(600, 400);
    background(100);
    textField = createInput();
    textField.position(width / 2 + offsetX, height / 2 + offsetY);
    let offsetX = this.canvas.offsetLeft;
    let offsetY = this.canvas.offsetTop;
    submitButton = createButton("example");
    submitButton.position(width / 2 + offsetX, height / 2 + offsetY);
}

function draw() {
}