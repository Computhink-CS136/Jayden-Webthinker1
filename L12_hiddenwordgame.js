let placeField;
let submitButton;

function setup() {
    createCanvas(600, 400);
    background(100);
    let offsetX = this.canvas.offsetLeft;
    let offsetY = this.canvas.offsetTop;
    
    textField = createInput();
    textField.position(width / 2 + offsetX - 80, height / 2 + offsetY);
    submitButton = createButton("example");
    submitButton.position(width / 2 + offsetX + 100, height / 2 + offsetY);
    submitButton.mousePressed();
}

function draw() {
}

function submitGuess() {
    
}