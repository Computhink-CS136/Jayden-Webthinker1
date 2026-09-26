let inputText;
let displayText = "Input your name";
let InputX;
let InputY;
function setup() {
    createCanvas(600, 400);
    inputText = createInput();
    let InputX = this.canvas.offsetLeft + (width / 2) - 80;
    let InputY = this.canvas.offsetTop + (height / 2) - 10;
    inputText.position(InputX, inputY);

    inputText.input(updateText);
}

function draw() {
    background(0);
    Text(displayText, width / 2, height * 0.3);
}
function updateText() {
    displayText = this.value();
    console.log(displayText);
}