let inputText;
let displayText = "Input your name";

function setup() {
    createCanvas(600, 400);
    inputText = createInput();
    let inputX = this.canvas.offsetLeft + (width / 2) - 80;
    let inputY
    inputText.position(width / 2, height / 2);

    inputText.input(updateText);
}

function draw() {
    background(0);
}
function updateText() {
    displayText = this.value();
    console.log(displayText);
}