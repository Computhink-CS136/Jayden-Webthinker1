const GAME_WIDTH = 960;
const GAME_HEIGHT = 650;
const MAX_FLOOR = 5;
const ROOMS_PER_FLOOR = 3;
const ARENA = { left: 52, right: 908, top: 92, bottom: 590 };
const CENTER_X = GAME_WIDTH / 2;

let gameState = "title";
let player;
let enemies = [];
let bullets = [];
let roomItems = [];
let floorNumber = 1;
let roomNumber = 1;
let roomCleared = false;
let achievementNames = [];
let recentAchievement = "";
let achievementUntil = 0;
let roomMessage = "";
let roomMessageUntil = 0;
let backgroundMarks = [];
let virtualInput = new Set();

const ITEM_DATA = {
  quickNerve: { name: "Quick Nerve", kind: "passive", color: "#e6b869", mark: "+" },
  splitThought: { name: "Split Thought", kind: "passive", color: "#9bcaab", mark: "Y" },
  steadyHand: { name: "Steady Hand", kind: "passive", color: "#d79eae", mark: "*" },
  heavySilence: { name: "Heavy Silence", kind: "passive", color: "#b3a5db", mark: "+" },
  blackout: { name: "Blackout", kind: "active", color: "#b3a5db", mark: "O" },
  redDose: { name: "Red Dose", kind: "active", color: "#dd8379", mark: "!" },
  mend: { name: "Mending Thread", kind: "active", color: "#9bcaab", mark: "+" },
  heart: { name: "Lost Heart", kind: "heart", color: "#db777f", mark: "+" }
};

function setup() {
  const gameCanvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
  gameCanvas.parent("game-stage");
  pixelDensity(1);
  textFont("Georgia");
  textAlign(CENTER, CENTER);
  buildBackgroundMarks();
  resetRun();
  gameState = "title";
}

function draw() {
  updateTouchInput();
  drawRoom();

  if (gameState === "playing") {
    updateGame();
  }

  drawItems();
  drawBullets();
  drawEnemies();
  drawPlayer();
  drawHud();
  if (gameState === "playing" || gameState === "paused") drawTouchControls();

  if (gameState === "title") drawTitleScreen();
  if (gameState === "paused") drawPauseScreen();
  if (gameState === "lost") drawEndScreen(false);
  if (gameState === "won") drawEndScreen(true);
}

function buildBackgroundMarks() {
  randomSeed(22);
  for (let index = 0; index < 115; index++) {
    backgroundMarks.push({
      x: random(ARENA.left + 12, ARENA.right - 12),
      y: random(ARENA.top + 10, ARENA.bottom - 10),
      length: random(3, 18),
      shade: random(20, 42)
    });
  }
}

function resetRun() {
  floorNumber = 1;
  roomNumber = 1;
  enemies = [];
  bullets = [];
  roomItems = [];
  roomCleared = false;
  achievementNames = [];
  recentAchievement = "";
  roomMessage = "";
  player = {
    body: makeBody(CENTER_X, (ARENA.top + ARENA.bottom) / 2, 30),
    hearts: 6,
    maxHearts: 6,
    speedLevel: 0,
    fireLevel: 0,
    spreadLevel: 0,
    damageLevel: 0,
    nextShotFrame: 0,
    activeItem: "",
    invulnerableUntil: 0,
    fireBoostUntil: 0,
    healsUsed: 0,
    kills: 0
  };
  spawnRoom();
}

function makeBody(x, y, diameter) {
  const body = new Sprite(x, y, diameter, diameter, "none");
  body.visible = false;
  return body;
}

function spawnRoom() {
  enemies = [];
  bullets = [];
  roomItems = [];
  roomCleared = false;
  player.body.x = CENTER_X;
  player.body.y = (ARENA.top + ARENA.bottom) / 2;

  const bossRoom = roomNumber === ROOMS_PER_FLOOR;
  const enemyCount = bossRoom ? 1 : Math.min(5, 1 + floorNumber + (roomNumber === 2 ? 1 : 0));
  for (let index = 0; index < enemyCount; index++) {
    const position = findEnemyPosition();
    enemies.push(makeEnemy(position.x, position.y, bossRoom));
  }

  const itemKey = random() < 0.13 ? "heart" : randomItemKey();
  const itemPosition = {
    x: random(ARENA.left + 100, ARENA.right - 100),
    y: random(ARENA.top + 85, ARENA.bottom - 90)
  };
  roomItems.push({ body: makeBody(itemPosition.x, itemPosition.y, 26), itemKey });
}

function findEnemyPosition() {
  let position = { x: CENTER_X, y: ARENA.top + 55 };
  for (let attempt = 0; attempt < 12; attempt++) {
    position = {
      x: random(ARENA.left + 75, ARENA.right - 75),
      y: random(ARENA.top + 70, ARENA.bottom - 70)
    };
    if (dist(position.x, position.y, CENTER_X, (ARENA.top + ARENA.bottom) / 2) > 205) break;
  }
  return position;
}

function randomItemKey() {
  const keys = ["quickNerve", "splitThought", "steadyHand", "heavySilence", "blackout", "redDose", "mend"];
  return random(keys);
}

function makeEnemy(x, y, isBoss) {
  const size = isBoss ? 52 : random(27, 38);
  return {
    body: makeBody(x, y, size),
    size,
    health: isBoss ? 8 + floorNumber * 2 : 2 + floor(floorNumber / 2),
    maxHealth: isBoss ? 8 + floorNumber * 2 : 2 + floor(floorNumber / 2),
    speed: isBoss ? 0.67 + floorNumber * 0.04 : random(0.72, 1.08) + floorNumber * 0.08,
    isBoss,
    hitUntil: 0,
    alive: true,
    tint: random(["#a75d64", "#849a79", "#8c7caa", "#b08a5f"])
  };
}

function updateGame() {
  updatePlayer();
  updateEnemies();
  updateBullets();
  collectItems();
  checkRoomClear();
  checkAchievementProgress();
}

function updatePlayer() {
  let horizontal = 0;
  let vertical = 0;
  if (isDown(65)) horizontal -= 1;
  if (isDown(68)) horizontal += 1;
  if (isDown(87)) vertical -= 1;
  if (isDown(83)) vertical += 1;

  const magnitude = Math.hypot(horizontal, vertical) || 1;
  const speed = 2.45 + player.speedLevel * 0.32;
  player.body.x += (horizontal / magnitude) * speed;
  player.body.y += (vertical / magnitude) * speed;

  const nearExit = roomCleared && Math.abs(player.body.x - CENTER_X) < 60;
  player.body.x = constrain(player.body.x, ARENA.left + 18, ARENA.right - 18);
  player.body.y = constrain(player.body.y, ARENA.top + 18, nearExit ? ARENA.bottom + 5 : ARENA.bottom - 18);

  const directions = [];
  if (isDown(LEFT_ARROW)) directions.push([-1, 0]);
  if (isDown(RIGHT_ARROW)) directions.push([1, 0]);
  if (isDown(UP_ARROW)) directions.push([0, -1]);
  if (isDown(DOWN_ARROW)) directions.push([0, 1]);
  const baseRate = Math.max(8, 24 - player.fireLevel * 3);
  const firingRate = frameCount < player.fireBoostUntil ? Math.max(6, baseRate - 8) : baseRate;
  if (directions.length && frameCount >= player.nextShotFrame) {
    for (const direction of directions) fireShot(direction[0], direction[1]);
    player.nextShotFrame = frameCount + firingRate;
  }

  if (nearExit && player.body.y >= ARENA.bottom - 10) enterNextRoom();
}

function fireShot(directionX, directionY) {
  const angle = Math.atan2(directionY, directionX);
  const spreadAngles = player.spreadLevel > 0 ? [-0.19, 0, 0.19] : [0];
  for (const offset of spreadAngles) {
    const shotAngle = angle + offset;
    const speed = 7.3;
    bullets.push({
      body: makeBody(player.body.x + Math.cos(shotAngle) * 22, player.body.y + Math.sin(shotAngle) * 22, 10),
      vx: Math.cos(shotAngle) * speed,
      vy: Math.sin(shotAngle) * speed,
      damage: 1 + player.damageLevel,
      life: 82
    });
  }
}

function updateEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const deltaX = player.body.x - enemy.body.x;
    const deltaY = player.body.y - enemy.body.y;
    const distance = Math.hypot(deltaX, deltaY) || 1;
    enemy.body.x += (deltaX / distance) * enemy.speed;
    enemy.body.y += (deltaY / distance) * enemy.speed;
    enemy.body.x = constrain(enemy.body.x, ARENA.left + enemy.size / 2, ARENA.right - enemy.size / 2);
    enemy.body.y = constrain(enemy.body.y, ARENA.top + enemy.size / 2, ARENA.bottom - enemy.size / 2);

    if (enemy.body.overlaps(player.body) && frameCount >= player.invulnerableUntil) {
      player.hearts -= 1;
      player.invulnerableUntil = frameCount + 75;
      if (player.hearts <= 0) gameState = "lost";
    }
  }
}

function updateBullets() {
  for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
    const bullet = bullets[bulletIndex];
    bullet.body.x += bullet.vx;
    bullet.body.y += bullet.vy;
    bullet.life -= 1;
    let hit = false;

    for (const enemy of enemies) {
      if (!enemy.alive || !bullet.body.overlaps(enemy.body)) continue;
      enemy.health -= bullet.damage;
      enemy.hitUntil = frameCount + 7;
      hit = true;
      if (enemy.health <= 0) {
        enemy.alive = false;
        player.kills += 1;
      }
      break;
    }

    const outsideRoom = bullet.body.x < ARENA.left || bullet.body.x > ARENA.right || bullet.body.y < ARENA.top || bullet.body.y > ARENA.bottom;
    if (hit || bullet.life <= 0 || outsideRoom) {
      bullet.body.visible = false;
      bullets.splice(bulletIndex, 1);
    }
  }
}

function collectItems() {
  for (let itemIndex = roomItems.length - 1; itemIndex >= 0; itemIndex--) {
    const roomItem = roomItems[itemIndex];
    if (!player.body.overlaps(roomItem.body)) continue;
    collectItem(roomItem.itemKey);
    roomItem.body.visible = false;
    roomItems.splice(itemIndex, 1);
  }
}

function collectItem(itemKey) {
  const item = ITEM_DATA[itemKey];
  if (item.kind === "heart") {
    if (player.hearts < player.maxHearts) healPlayer(1);
    else roomMessage = "Your heart is already whole.";
  } else if (item.kind === "active") {
    player.activeItem = itemKey;
    roomMessage = `${item.name} held. Press SPACE to use it.`;
  } else {
    if (itemKey === "quickNerve") player.speedLevel += 1;
    if (itemKey === "splitThought") player.spreadLevel += 1;
    if (itemKey === "steadyHand") player.fireLevel += 1;
    if (itemKey === "heavySilence") player.damageLevel += 1;
    roomMessage = `${item.name}: ${passiveDescription(itemKey)}`;
  }
  roomMessageUntil = frameCount + 130;
}

function passiveDescription(itemKey) {
  if (itemKey === "quickNerve") return "movement increased";
  if (itemKey === "splitThought") return "shots split in three";
  if (itemKey === "steadyHand") return "firing speed increased";
  return "shot damage increased";
}

function activateItem() {
  if (gameState !== "playing" || !player.activeItem) return;
  const itemKey = player.activeItem;
  player.activeItem = "";

  if (itemKey === "blackout") {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      enemy.health -= 5;
      enemy.hitUntil = frameCount + 10;
      if (enemy.health <= 0) {
        enemy.alive = false;
        player.kills += 1;
      }
    }
    roomMessage = "Blackout: every shadow recoils.";
  } else if (itemKey === "redDose") {
    player.fireBoostUntil = frameCount + 480;
    roomMessage = "Red Dose: your hands won't stay still.";
  } else if (itemKey === "mend") {
    healPlayer(2);
    roomMessage = "Mending Thread: the wound closes.";
  }
  roomMessageUntil = frameCount + 150;
}

function healPlayer(amount) {
  const previousHearts = player.hearts;
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
  if (player.hearts > previousHearts) player.healsUsed += 1;
}

function checkRoomClear() {
  if (roomCleared || enemies.some((enemy) => enemy.alive)) return;
  roomCleared = true;
  if (random() < 0.48 && player.hearts < player.maxHearts) {
    const x = random(ARENA.left + 100, ARENA.right - 100);
    const y = random(ARENA.top + 90, ARENA.bottom - 90);
    roomItems.push({ body: makeBody(x, y, 26), itemKey: "heart" });
    roomMessage = "The room leaves something behind.";
  } else {
    roomMessage = "The room is quiet. Find the open door.";
  }
  roomMessageUntil = frameCount + 170;
}

function enterNextRoom() {
  if (floorNumber === MAX_FLOOR && roomNumber === ROOMS_PER_FLOOR) {
    gameState = "won";
    awardAchievement("The Long Hall", "Reached the final floor.");
    return;
  }

  roomNumber += 1;
  if (roomNumber > ROOMS_PER_FLOOR) {
    roomNumber = 1;
    floorNumber += 1;
    if (floorNumber > 1 && player.healsUsed === 0) {
      awardAchievement("Unmended", "Reached a new floor without healing.");
    }
    if (player.hearts < player.maxHearts && random() < 0.38) {
      healPlayer(1);
      roomMessage = "A quiet warmth restores one heart.";
      roomMessageUntil = frameCount + 180;
    }
  }
  spawnRoom();
}

function checkAchievementProgress() {
  if (player.kills >= 15) awardAchievement("Still Standing", "Defeated fifteen presences.");
}

function awardAchievement(name, description) {
  if (achievementNames.includes(name)) return;
  achievementNames.push(name);
  recentAchievement = `${name}: ${description}`;
  achievementUntil = frameCount + 240;
}

function keyPressed() {
  const pressed = String(key).toLowerCase();
  if (pressed === "p") {
    if (gameState === "playing") gameState = "paused";
    else if (gameState === "paused") gameState = "playing";
    return false;
  }
  if (keyCode === ENTER && (gameState === "title" || gameState === "lost" || gameState === "won")) {
    resetRun();
    gameState = "playing";
    return false;
  }
  if (keyCode === 32) {
    if (gameState === "title") gameState = "playing";
    else activateItem();
    return false;
  }
  return false;
}

function isDown(code) {
  return keyIsDown(code) || virtualInput.has(code);
}

function updateTouchInput() {
  const nextInput = new Set();
  if (windowWidth < 760 && gameState === "playing") {
    for (const touch of touches) {
      if (touch.y > 430 && touch.x < 290) {
        const horizontal = touch.x - 150;
        const vertical = touch.y - 510;
        if (Math.abs(horizontal) > 12) nextInput.add(horizontal < 0 ? 65 : 68);
        if (Math.abs(vertical) > 12) nextInput.add(vertical < 0 ? 87 : 83);
      } else if (touch.y > 430 && touch.x > 670) {
        const horizontal = touch.x - 810;
        const vertical = touch.y - 510;
        if (Math.abs(horizontal) > Math.abs(vertical)) {
          nextInput.add(horizontal < 0 ? LEFT_ARROW : RIGHT_ARROW);
        } else {
          nextInput.add(vertical < 0 ? UP_ARROW : DOWN_ARROW);
        }
      }
    }
  }
  virtualInput = nextInput;
}

function touchStarted() {
  if (windowWidth >= 760) return false;
  for (const touch of touches) {
    if (gameState === "title") {
      gameState = "playing";
    } else if (gameState === "lost" || gameState === "won") {
      resetRun();
      gameState = "playing";
    } else if (touch.x > 850 && touch.y < 85) {
      gameState = gameState === "paused" ? "playing" : "paused";
    } else if (gameState === "playing" && touch.x > 385 && touch.x < 575 && touch.y > 485) {
      activateItem();
    }
  }
  return false;
}

function mousePressed() {
  if (gameState === "title") gameState = "playing";
  else if (gameState === "lost" || gameState === "won") {
    resetRun();
    gameState = "playing";
  }
}

function drawRoom() {
  background(14, 17, 17);
  noStroke();
  fill(27, 31, 29);
  rect(ARENA.left, ARENA.top, ARENA.right - ARENA.left, ARENA.bottom - ARENA.top);

  stroke(52, 57, 51, 125);
  strokeWeight(1);
  for (let x = ARENA.left + 36; x < ARENA.right; x += 74) {
    line(x, ARENA.top, x, ARENA.bottom);
  }
  for (let y = ARENA.top + 38; y < ARENA.bottom; y += 62) {
    line(ARENA.left, y, ARENA.right, y);
  }
  noStroke();
  for (const mark of backgroundMarks) {
    fill(mark.shade, mark.shade + 4, mark.shade - 2, 85);
    ellipse(mark.x, mark.y, mark.length, 1.5);
  }

  fill(9, 12, 12);
  rect(0, 0, GAME_WIDTH, 79);
  rect(0, 604, GAME_WIDTH, 46);
  stroke(102, 110, 93, 120);
  strokeWeight(1);
  line(0, 79, GAME_WIDTH, 79);
  line(0, 603, GAME_WIDTH, 603);
  noStroke();

  const doorOpen = roomCleared;
  fill(doorOpen ? "#9bcaab" : "#4a4b43");
  rect(CENTER_X - 37, ARENA.bottom - 4, 74, 12);
  if (doorOpen) {
    fill(155, 202, 171, 45 + Math.sin(frameCount * 0.08) * 25);
    ellipse(CENTER_X, ARENA.bottom - 3, 96, 38);
  }
}

function drawHud() {
  textAlign(LEFT, CENTER);
  fill("#ddd7c3");
  textSize(18);
  text("HUSH HOUSE", 28, 27);
  textSize(11);
  fill("#8f9889");
  text("A STUDY IN FAMILIAR ROOMS", 29, 52);

  textAlign(CENTER, CENTER);
  fill("#ddd7c3");
  textSize(15);
  text(`FLOOR ${floorNumber} / ${MAX_FLOOR}`, CENTER_X, 25);
  textSize(11);
  fill("#8f9889");
  text(`ROOM ${roomNumber} / ${ROOMS_PER_FLOOR}`, CENTER_X, 49);

  textAlign(RIGHT, CENTER);
  fill("#aeb6a1");
  textSize(13);
  text(`HEARTS  ${player.hearts}/${player.maxHearts}`, GAME_WIDTH - 28, 27);
  textSize(10);
  fill("#8f9889");
  text(`PASSIVES  ${player.speedLevel + player.fireLevel + player.spreadLevel + player.damageLevel}`, GAME_WIDTH - 28, 51);

  textAlign(LEFT, CENTER);
  fill("#aeb6a1");
  textSize(11);
  const activeName = player.activeItem ? ITEM_DATA[player.activeItem].name : "EMPTY";
  text(`SPACE  ${activeName}`, 28, 627);
  textAlign(CENTER, CENTER);
  fill(roomCleared ? "#b8d5b9" : "#899087");
  text(roomCleared ? "SOUTH DOOR OPEN" : "CLEAR THE ROOM", CENTER_X, 627);
  textAlign(RIGHT, CENTER);
  fill("#899087");
  text("WASD MOVE  /  ARROWS FIRE  /  P PAUSE", GAME_WIDTH - 28, 627);

  drawHearts();
  if (recentAchievement && frameCount < achievementUntil) drawAchievementToast();
  if (roomMessage && frameCount < roomMessageUntil) drawRoomMessage();
}

function drawTouchControls() {
  if (windowWidth >= 760) return;
  push();
  textAlign(CENTER, CENTER);
  textSize(13);
  stroke(205, 207, 183, 155);
  strokeWeight(2);
  fill(12, 16, 14, 150);
  ellipse(150, 510, 142, 142);
  ellipse(810, 510, 142, 142);
  noStroke();
  fill("#c7c9b8");
  text("W", 150, 469);
  text("A", 109, 510);
  text("S", 150, 551);
  text("D", 191, 510);
  text("FIRE", 810, 510);
  fill(12, 16, 14, 205);
  rect(390, 520, 180, 62, 4);
  stroke(205, 207, 183, 155);
  noFill();
  rect(390, 520, 180, 62, 4);
  noStroke();
  fill("#c7c9b8");
  text("USE ITEM", 480, 551);
  fill("#c7c9b8");
  textSize(10);
  text("PAUSE", 905, 42);
  pop();
}

function drawHearts() {
  const startX = GAME_WIDTH - 216;
  const y = 22;
  for (let index = 0; index < player.maxHearts; index++) {
    const x = startX + index * 15;
    fill(index < player.hearts ? "#d98083" : "#424640");
    noStroke();
    ellipse(x - 3, y, 8, 8);
    ellipse(x + 3, y, 8, 8);
    triangle(x - 7, y + 1, x + 7, y + 1, x, y + 10);
  }
}

function drawAchievementToast() {
  const boxWidth = Math.min(500, textWidth(recentAchievement) + 38);
  const boxX = (GAME_WIDTH - boxWidth) / 2;
  noStroke();
  fill(10, 14, 12, 235);
  rect(boxX, 83, boxWidth, 34, 3);
  stroke("#b5c29f");
  noFill();
  rect(boxX, 83, boxWidth, 34, 3);
  noStroke();
  fill("#dbe1cd");
  textAlign(CENTER, CENTER);
  textSize(12);
  text(recentAchievement, CENTER_X, 100);
}

function drawRoomMessage() {
  noStroke();
  fill(8, 11, 10, 200);
  rect(CENTER_X - 250, 552, 500, 27, 2);
  fill("#e1ddc9");
  textAlign(CENTER, CENTER);
  textSize(12);
  text(roomMessage, CENTER_X, 566);
}

function drawPlayer() {
  const flicker = frameCount < player.invulnerableUntil && frameCount % 8 < 4;
  if (flicker) return;
  const x = player.body.x;
  const y = player.body.y;
  noStroke();
  fill(8, 10, 10, 120);
  ellipse(x, y + 13, 40, 16);
  fill("#d8d1b8");
  ellipse(x, y, 29, 33);
  fill("#3d4742");
  ellipse(x, y - 3, 21, 24);
  fill("#e2b2a1");
  ellipse(x - 5, y - 3, 3, 4);
  ellipse(x + 5, y - 3, 3, 4);
  fill("#222726");
  arc(x, y + 5, 12, 7, 0, PI);
}

function drawEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const x = enemy.body.x;
    const y = enemy.body.y;
    const color = frameCount < enemy.hitUntil ? "#f1d8bd" : enemy.tint;
    noStroke();
    fill(6, 8, 8, 115);
    ellipse(x, y + enemy.size * 0.35, enemy.size * 1.1, enemy.size * 0.42);
    fill(color);
    if (enemy.isBoss) {
      ellipse(x, y, enemy.size, enemy.size * 1.12);
      fill("#202321");
      ellipse(x - 10, y - 3, 7, 9);
      ellipse(x + 10, y - 3, 7, 9);
      fill("#d6b8a1");
      ellipse(x, y + 11, 8, 3);
      fill("#c9b895");
      for (let mark = -2; mark <= 2; mark++) rect(x + mark * 7 - 1, y - enemy.size / 2 - 7, 3, 13);
      drawEnemyHealth(enemy, x, y - enemy.size / 2 - 16);
    } else {
      ellipse(x, y, enemy.size * 0.92, enemy.size * 1.05);
      fill("#191d1b");
      ellipse(x - 5, y - 2, 4, 5);
      ellipse(x + 5, y - 2, 4, 5);
    }
  }
}

function drawEnemyHealth(enemy, x, y) {
  noStroke();
  fill(20, 22, 21, 200);
  rect(x - 30, y, 60, 5);
  fill("#d58b7e");
  rect(x - 30, y, 60 * Math.max(0, enemy.health / enemy.maxHealth), 5);
}

function drawBullets() {
  noStroke();
  for (const bullet of bullets) {
    fill(235, 219, 177, 80);
    ellipse(bullet.body.x, bullet.body.y, 17, 17);
    fill("#f0d7a8");
    ellipse(bullet.body.x, bullet.body.y, 7, 7);
  }
}

function drawItems() {
  for (const roomItem of roomItems) {
    const item = ITEM_DATA[roomItem.itemKey];
    const x = roomItem.body.x;
    const y = roomItem.body.y + Math.sin(frameCount * 0.06 + x) * 3;
    noStroke();
    fill(8, 10, 9, 100);
    ellipse(x, y + 15, 34, 12);
    fill(item.color);
    if (item.kind === "heart") {
      ellipse(x - 5, y - 2, 13, 13);
      ellipse(x + 5, y - 2, 13, 13);
      triangle(x - 11, y, x + 11, y, x, y + 15);
    } else {
      push();
      translate(x, y);
      rotate(QUARTER_PI);
      rectMode(CENTER);
      rect(0, 0, 19, 19, 2);
      rectMode(CORNER);
      pop();
      fill("#202522");
      textAlign(CENTER, CENTER);
      textSize(11);
      text(item.mark, x, y);
    }
    fill("#c9c4b1");
    textAlign(CENTER, CENTER);
    textSize(9);
    text(item.name.toUpperCase(), x, y + 27);
  }
}

function drawTitleScreen() {
  drawOverlay();
  fill("#e0d9c5");
  textAlign(CENTER, CENTER);
  textSize(46);
  text("HUSH HOUSE", CENTER_X, 225);
  fill("#b5b39f");
  textSize(16);
  text("The rooms remember what you leave behind.", CENTER_X, 272);
  fill("#c5c6b8");
  textSize(13);
  text("Five floors. Three rooms each. Find the south door.", CENTER_X, 330);
  text("WASD move  |  Arrow keys fire  |  SPACE use held item  |  P pause", CENTER_X, 369);
  fill("#d9b685");
  textSize(15);
  text("PRESS ENTER OR SPACE TO BEGIN", CENTER_X, 430);
}

function drawPauseScreen() {
  drawOverlay();
  fill("#e0d9c5");
  textAlign(CENTER, CENTER);
  textSize(38);
  text("LISTEN", CENTER_X, 280);
  fill("#b5b39f");
  textSize(15);
  text("The house is holding its breath.", CENTER_X, 325);
  text("Press P to return", CENTER_X, 375);
}

function drawEndScreen(won) {
  drawOverlay();
  fill(won ? "#c2d5b6" : "#d89b95");
  textAlign(CENTER, CENTER);
  textSize(42);
  text(won ? "THE HOUSE LETS GO" : "THE HOUSE KEEPS YOU", CENTER_X, 270);
  fill("#d6d1bf");
  textSize(15);
  text(won ? "You crossed every floor and found the last door." : `You reached floor ${floorNumber}, room ${roomNumber}.`, CENTER_X, 326);
  text(`Presences quieted: ${player.kills}  |  Achievements: ${achievementNames.length}`, CENTER_X, 365);
  fill("#d9b685");
  textSize(14);
  text("PRESS ENTER OR CLICK TO BEGIN AGAIN", CENTER_X, 423);
}

function drawOverlay() {
  noStroke();
  fill(5, 8, 7, 220);
  rect(0, 79, GAME_WIDTH, 525);
}
