let inputText;
let displayText = "Input your name";
let colourPicker;
let colourX;
let colourY;
let InputX;
let InputY;
function setup() {
    createCanvas(600, 400);
    inputText = createInput();
    let InputX = this.canvas.offsetLeft + (width / 2) - 80;
    let InputY = this.canvas.offsetTop + (height / 2) - 10;
    inputText.position(InputX, InputY);

    inputText.input(updateText);
    colourPicker = createColorPicker();
    let colourX = this.canvas.offsetLeft + (width / 2) - 20;
    let colourY = this.canvas.offsetTop + (height * 0.7);
    colourPicker.position(colourX, colourY)
}

function draw() {
    background(colourPicker.value());
    text(displayText, width / 2, height * 0.3);
}
function updateText() {
    displayText = this.value();
    console.log(displayText);
}