let nounField;
let verbField;
let adjectiveField;
let adverbField;
let placeField;
let submitButton;

function setup() {
    createCanvas(600, 600);
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
    
    submitButton = createButton("Generate Story");
    submitButton.position(width / 2 + offsetX, height * 0.2 + offsetY + 250);
    submitButton.mousePressed(generateStory);
}

function draw() {
    background(100);
    text("Enter a noun:", width * 0.2, height * 0.2);
    text("Enter a verb:", width * 0.2, height * 0.2 + 50);
    text("Enter a adjective:", width * 0.2, height * 0.2 + 100);
    text("Enter a adverb:", width * 0.2, height * 0.2 + 150);
    text("Enter a place:", width * 0.2, height * 0.2 + 200);
}

function buttonExample() {
    console.log("Button Clicked");
}

function generateStory() {
    let noun = nounField.value()
    let verb = verbField.value()
    let adjective = adjectiveField.value()
    let adverb = adverbField.value()
    let place = Field.value()
    console.log(noun);
    console.log(verb);
    console.log(adjective);
    console.log(adverb);
    console.log(place);
}