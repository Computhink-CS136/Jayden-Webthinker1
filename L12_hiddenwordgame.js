let placeField;
let submitButton;

function setup() {
    createCanvas(600, 400);
    background(100);
    let offsetX = this.canvas.offsetLeft;
    let offsetY = this.canvas.offsetTop;
    
    textField = createInput();
    textField.position(width / 2 + offsetX - 80, height / 2 + offsetY);
    textField
    submitButton = createButton("geuss");
    submitButton.position(width / 2 + offsetX + 100, height / 2 + offsetY);
    submitButton.mousePressed(submitGuess);
}

function draw() {
}

function submitGuess() {
    background(100);
    let inputText = textField.value();
    fill(0);
    textSize(28);
    text(inputText, width / 2, height / 3);
}