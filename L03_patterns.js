let colourValue;
function setup() {
    createCanvas(600, 400);
    background(220);
    noLoop(); // Stops continuous drawing
}
  for (let i = 10; i >= 0; i--) {
    console.log(i);
  }
function draw() {
  // Recap 1: Repeating Circles
// circle(75, 200, 100)
// circle(225, 200, 100)
// circle(375, 200, 100)
// circle(525, 200, 100)
  // Task 1: Colour Gradient
  // let red = 10
  // let green = 30
  // let blue = 50
  // for (let i = 0; i < 5; i++) {
  //   console.log(i);
  //   fill(red, green + i * 50, blue);
  //   circle(50 + i * 50, 100, 40)
  // }
  // Task 2: Colour Loop
// circle(100, 100, 100);
// fill(colourValue);
// colourValue++;
  // Task 3: Row of Circles
  // for(let i = 0; i <= 5; i++) {
  //   if (i % 2 ==0) {
  //     fill(0); 
  //   } else {
  //     fill(255);
  //   }
  //   circle(50 + i *50, 100, 40);
  // }
  let circleDiameter = 30;
  let numCircles = 5;
  let totalWidth = numCircles * circleDiameter;
  let startX = (width - totalWidth) / 2 + circleDiameter / 2;
  let startY = (height - totalWidth) / 2 + circleDiameter / 2;
  for (row = 0; row < 5; row++);
    row
  for (let i = 0; i < numCircles; i++) {
    let x = startX + i * circleDiameter;
    ellipse(x, height / 2, circleDiameter, circleDiameter);
  }
  // Task 4: Grid of Circles
  // for (row = 0; row < 5; row++)
  //   for(let col = 0; col < 5; col++) {
  //   if ((row + col) % 2 == 0) {
  //     fill(0); 
  //   } else {
  //     fill(255);
  //   }
  //   rect(col * 50, row * 50, 50, 50)
  // }
  // circle(width / 2, height / 2)
}