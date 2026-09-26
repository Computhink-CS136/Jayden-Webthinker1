let inputText;
let displayText = "Input your name";

function setup() {
    createCanvas(600, 400);
    inputText = createInput();
    inputText.position(width / 2, height / 2);

    inputText.input(displayText)
}
