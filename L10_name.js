let inputText;
let displayText = "Input your name";
let inputX;
let inputY;
function setup() {
    createCanvas(600, 400);
    inputText = createInput();
    let inputX = this.canvas.offsetLeft + (width / 2) - 80;
    let inputY = this.canvas.offsetTop + (height / 2) - 10;
    inputText.position(inputX, InputY);

    inputText.input(updateText);
}

function draw() {
    background(0);
    Text(displayText)
}
function updateText() {
    displayText = this.value();
    console.log(displayText);
}