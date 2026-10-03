let nounField;
let verbField;
let adjectiveField;
let adverbField;
let placeField;

function setup() {
    createCanvas(600, 600);
    inputText = createInput();
    textSize(40);
    textAlign(CENTER, CENTER);

    nounField = createInput();
    verbField = createInput();
    adjectiveField = createInput();
    adverbField = createInput();
    placeField = createInput();

    let offsetX = this.canvas.offsetLeft;
    let offsetY = this.canvas.offsetTop;

    nounField.position(width / 2 + offsetX, height * 0.2 + offsetY);
    verbField.position(width / 2 + offsetX, height * 0.2 + offsetY + 50);
    adjectiveField.position(width / 2 + offsetX, height * 0.2 + offsetY + 100);
    adverbField.position(width / 2 + offsetX, height * 0.2 + offsetY + 150);
    placeField.position(width / 2 + offsetX, height * 0.2 + offsetY + 200);
    
}

function draw() {
    
}