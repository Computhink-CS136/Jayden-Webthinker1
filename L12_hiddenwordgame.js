let placeField;
let submitButton;
let wordArray = ["Sugar", "Poop", "Piss", "Toilet", "Supercalifragilisticexpialidocious", "Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu"]
let randomWord;
let displayHint;

function setup() {
    createCanvas(600, 400);
    background(100);
    let offsetX = this.canvas.offsetLeft;
    let offsetY = this.canvas.offsetTop;
    
    textField = createInput();
    textField.position(width / 2 + offsetX - 80, height / 2 + offsetY);
    textField.size(150, 30);
    textField.style("background-color", "lightblue");
    textField.style("font-size", "20px");
    textField.style("border", "1px solid black");
    textField.style("color", "green");
    textField.style("text-align", "center");
    submitButton = createButton("geuss");
    submitButton.position(width / 2 + offsetX + 100, height / 2 + offsetY);
    submitButton.mousePressed(submitGuess);
    randomWord = random(wordArray);
    displayHint = randomWord[0].toUpperCase() + " " + " _".repeat(randomWord.length - 1);
    textAlign(CENTER, CENTER);
    textSize(28)
    text("hint: " + displayHint, width / 2, height * 0.4);
}

function draw() {
}

function submitGuess() {
    // background(100);
    let inputText = textField.value();
    fill(0);
    textSize(28);
    text(inputText, width / 2, height / 1.5);
    let letters = correctGuess(inputText. randomWord);
    console.log(letters);
}

function correctGuess(geuss, Word) {
    let correctLetters = "";
    for (let i = 0; i < Word.length; i++) {
        if (Word.includes(guess[i]) && !correctLetters.includes(guess[i])){
            correctLetters += guess[i];
        }
    }
}