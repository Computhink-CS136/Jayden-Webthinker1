const GAME_WIDTH = 960;
const GAME_HEIGHT = 650;
const MAX_FLOOR = 5;
const MAX_MAP_ROOMS = 9;
const MIN_MAP_ROOMS = 8;
const DOOR_WIDTH = 92;
const ARENA = { left: 52, right: 908, top: 92, bottom: 590 };
const CENTER_X = GAME_WIDTH / 2;
const CENTER_Y = (ARENA.top + ARENA.bottom) / 2;
const ROOM_DIRECTIONS = [
  { name: "left", dx: -1, dy: 0, opposite: "right" },
  { name: "right", dx: 1, dy: 0, opposite: "left" },
  { name: "up", dx: 0, dy: -1, opposite: "down" },
  { name: "down", dx: 0, dy: 1, opposite: "up" }
];

let gameState = "title";
let player;
let enemies = [];
let bullets = [];
let enemyShots = [];
let roomItems = [];
let floorNumber = 1;
let roomNumber = 1;
let floorRooms = [];
let roomByCoordinate = new Map();
let currentRoom = null;
let startRoom = null;
let bossRoom = null;
let keyRoom = null;
let chestRoom = null;
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
  sporeSack: { name: "Spore Sack", kind: "passive", color: "#82b777", mark: "S" },
  deepLung: { name: "Deep Lung", kind: "passive", color: "#82b7bf", mark: "+" },
  longShadow: { name: "Long Shadow", kind: "passive", color: "#b5a2cf", mark: ">" },
  blackout: { name: "Blackout", kind: "active", color: "#b3a5db", mark: "O" },
  redDose: { name: "Red Dose", kind: "active", color: "#dd8379", mark: "!" },
  mend: { name: "Mending Thread", kind: "active", color: "#9bcaab", mark: "+" },
  sporeCloud: { name: "Spore Cloud", kind: "active", color: "#82b777", mark: "S" },
  heart: { name: "Lost Heart", kind: "heart", color: "#db777f", mark: "+" },
  key: { name: "Brass Key", kind: "key", color: "#e6c77e", mark: "K" }
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
  achievementNames = [];
  recentAchievement = "";
  roomMessage = "";
  player = {
    body: makeBody(CENTER_X, (ARENA.top + ARENA.bottom) / 2, 30),
    hearts: 6,
    maxHearts: 6,
    keys: 0,
    speedLevel: 0,
    fireLevel: 0,
    spreadLevel: 0,
    damageLevel: 0,
    poisonLevel: 0,
    shotSpeedLevel: 0,
    uniqueItems: [],
    reservedPassiveItems: [],
    nextShotFrame: 0,
    activeItem: "",
    invulnerableUntil: 0,
    fireBoostUntil: 0,
    healsUsed: 0,
    kills: 0
  };
  generateFloor();
  enterRoom(startRoom, null);
}

function makeBody(x, y, diameter) {
  const body = new Sprite(x, y, diameter, diameter, "none");
  body.visible = false;
  return body;
}

function spawnRoom() {
  generateFloor();
  enterRoom(startRoom, "down");
}

function generateFloor() {
  const coordinates = [{ x: 0, y: 0 }];
  const occupied = new Set(["0,0"]);
  const roomCount = floor(random(MIN_MAP_ROOMS, MAX_MAP_ROOMS + 1));

  while (coordinates.length < roomCount) {
    const frontier = new Map();
    for (const point of coordinates) {
      for (const direction of ROOM_DIRECTIONS) {
        const x = point.x + direction.dx;
        const y = point.y + direction.dy;
        const key = `${x},${y}`;
        if (Math.abs(x) > 3 || Math.abs(y) > 3 || occupied.has(key)) continue;
        frontier.set(key, { x, y });
      }
    }
    if (frontier.size === 0) break;
    const nextPoint = random(Array.from(frontier.values()));
    coordinates.push(nextPoint);
    occupied.add(`${nextPoint.x},${nextPoint.y}`);
  }

  floorRooms = coordinates.map((point, index) => ({
    id: index,
    gridX: point.x,
    gridY: point.y,
    type: index === 0 ? "start" : "normal",
    neighbors: {},
    enemies: [],
    items: [],
    visited: false,
    cleared: index === 0,
    chestOpened: false,
    keyFound: false
  }));
  roomByCoordinate = new Map(floorRooms.map((room) => [`${room.gridX},${room.gridY}`, room]));

  for (const room of floorRooms) {
    for (const direction of ROOM_DIRECTIONS) {
      const neighbor = roomByCoordinate.get(`${room.gridX + direction.dx},${room.gridY + direction.dy}`);
      if (neighbor) room.neighbors[direction.name] = neighbor;
    }
  }

  startRoom = floorRooms[0];
  const depths = calculateRoomDepths(startRoom);
  const deepest = floorRooms
    .filter((room) => room !== startRoom)
    .reduce((depth, room) => Math.max(depth, depths.get(room.id)), 0);
  const bossOptions = floorRooms.filter((room) => room !== startRoom && depths.get(room.id) === deepest);
  bossRoom = random(bossOptions);
  bossRoom.type = "boss";
  const availableRooms = floorRooms.filter((room) => room !== startRoom && room !== bossRoom);
  chestRoom = random(availableRooms);
  chestRoom.type = "chest";
  const keyOptions = availableRooms.filter((room) => room !== chestRoom);
  keyRoom = random(keyOptions);
  keyRoom.keyFound = false;
  const openBossSides = ROOM_DIRECTIONS.filter((direction) => !bossRoom.neighbors[direction.name]);
  bossRoom.progressDirection = random(openBossSides).name;
  roomNumber = 1;

  for (const room of floorRooms) prepareRoom(room);
}

function calculateRoomDepths(origin) {
  const depths = new Map([[origin.id, 0]]);
  const queue = [origin];
  while (queue.length) {
    const room = queue.shift();
    for (const neighbor of Object.values(room.neighbors)) {
      if (depths.has(neighbor.id)) continue;
      depths.set(neighbor.id, depths.get(room.id) + 1);
      queue.push(neighbor);
    }
  }
  return depths;
}

function prepareRoom(room) {
  if (room.type === "start" || room.type === "chest") {
    room.cleared = true;
    return;
  }
  if (room === keyRoom) {
    const position = findRoomPosition();
    room.items.push(makeRoomItem("key", position.x, position.y));
  }

  const isBoss = room.type === "boss";
  const enemyCount = isBoss ? 1 : Math.min(6, 2 + floorNumber + floor(random(0, 3)));
  for (let index = 0; index < enemyCount; index++) {
    const position = findEnemyPosition();
    room.enemies.push(makeEnemy(position.x, position.y, isBoss));
  }

  if (!isBoss && random() < 0.68) {
    const position = findRoomPosition();
    room.items.push(makeRoomItem(rollRoomLoot(), position.x, position.y));
  }
}

function rollRoomLoot() {
  const availablePassives = Object.keys(ITEM_DATA).filter((itemKey) => {
    return ITEM_DATA[itemKey].kind === "passive" &&
      !player.uniqueItems.includes(itemKey) &&
      !player.reservedPassiveItems.includes(itemKey);
  });
  if (availablePassives.length && random() < 0.75) {
    const itemKey = random(availablePassives);
    player.reservedPassiveItems.push(itemKey);
    return itemKey;
  }
  return random(["blackout", "redDose", "mend", "sporeCloud", "heart"]);
}

function makeRoomItem(itemKey, x, y) {
  return { body: makeBody(x, y, itemKey === "heart" ? 20 : 26), itemKey };
}

function findRoomPosition() {
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

function makeEnemy(x, y, isBoss) {
  const type = isBoss ? "boss" : random(["stalker", "sprinter", "brute", "spitter"]);
  const size = isBoss ? 64 : type === "brute" ? 47 : type === "spitter" ? 35 : random(30, 39);
  const baseHealth = isBoss ? 17 + floorNumber * 4 : type === "brute" ? 5 + floorNumber : 3 + floor(floorNumber / 2);
  return {
    body: makeBody(x, y, size),
    size,
    health: baseHealth,
    maxHealth: baseHealth,
    speed: isBoss ? 0.8 + floorNumber * 0.05 : type === "sprinter" ? 1.35 + floorNumber * 0.11 : type === "brute" ? 0.58 + floorNumber * 0.04 : type === "spitter" ? 0.78 : random(0.9, 1.2) + floorNumber * 0.1,
    type,
    isBoss,
    hitUntil: 0,
    alive: true,
    nextAttackFrame: frameCount + random(65, 110),
    nextPoisonFrame: 0,
    tint: isBoss ? "#9a6767" : random(["#a75d64", "#849a79", "#8c7caa", "#b08a5f"])
  };
}

function enterRoom(room, exitDirection) {
  currentRoom = room;
  currentRoom.visited = true;
  enemies = currentRoom.enemies;
  roomItems = currentRoom.items;
  bullets = [];
  enemyShots = [];
  roomCleared = currentRoom.cleared;
  roomNumber = floorRooms.filter((knownRoom) => knownRoom.visited).length;

  const entrySide = ROOM_DIRECTIONS.find((direction) => direction.name === exitDirection)?.opposite;
  player.body.x = CENTER_X;
  player.body.y = CENTER_Y;
  if (entrySide === "left") player.body.x = ARENA.left + 28;
  if (entrySide === "right") player.body.x = ARENA.right - 28;
  if (entrySide === "up") player.body.y = ARENA.top + 28;
  if (entrySide === "down") player.body.y = ARENA.bottom - 28;
}

function enterConnectedRoom(direction) {
  if (!currentRoom.cleared) return false;
  if (currentRoom.type === "boss" && currentRoom.progressDirection === direction) {
    progressToNextFloor();
    return true;
  }
  const neighbor = currentRoom.neighbors[direction];
  if (!neighbor) return false;
  enterRoom(neighbor, direction);
  roomMessage = neighbor.cleared ? "The room is familiar." : "The doors seal until the room is quiet.";
  roomMessageUntil = frameCount + 100;
  return true;
}

function moveThroughDoor(direction) {
  const horizontal = direction === "left" || direction === "right";
  const aligned = horizontal
    ? Math.abs(player.body.y - CENTER_Y) < DOOR_WIDTH / 2
    : Math.abs(player.body.x - CENTER_X) < DOOR_WIDTH / 2;
  if (aligned && currentRoom.cleared && enterConnectedRoom(direction)) return true;

  if (direction === "left") player.body.x = ARENA.left + 18;
  if (direction === "right") player.body.x = ARENA.right - 18;
  if (direction === "up") player.body.y = ARENA.top + 18;
  if (direction === "down") player.body.y = ARENA.bottom - 18;
  return false;
}

function updateGame() {
  updatePlayer();
  updateEnemies();
  updateEnemyShots();
  updateBullets();
  collectItems();
  checkChestInteraction();
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

  if (player.body.x < ARENA.left) moveThroughDoor("left");
  if (player.body.x > ARENA.right) moveThroughDoor("right");
  if (player.body.y < ARENA.top) moveThroughDoor("up");
  if (player.body.y > ARENA.bottom) moveThroughDoor("down");
  player.body.x = constrain(player.body.x, ARENA.left + 18, ARENA.right - 18);
  player.body.y = constrain(player.body.y, ARENA.top + 18, ARENA.bottom - 18);

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

}

function fireShot(directionX, directionY) {
  const angle = Math.atan2(directionY, directionX);
  const spreadAngles = player.spreadLevel > 0 ? [-0.19, 0, 0.19] : [0];
  for (const offset of spreadAngles) {
    const shotAngle = angle + offset;
    const speed = 7.3 + player.shotSpeedLevel * 1.6;
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
    const retreat = enemy.type === "spitter" && distance < 225;
    const direction = retreat ? -1 : 1;
    enemy.body.x += (deltaX / distance) * enemy.speed * direction;
    enemy.body.y += (deltaY / distance) * enemy.speed * direction;
    enemy.body.x = constrain(enemy.body.x, ARENA.left + enemy.size / 2, ARENA.right - enemy.size / 2);
    enemy.body.y = constrain(enemy.body.y, ARENA.top + enemy.size / 2, ARENA.bottom - enemy.size / 2);

    if ((enemy.type === "spitter" || enemy.isBoss) && frameCount >= enemy.nextAttackFrame) {
      const shotSpeed = enemy.isBoss ? 3.2 : 2.8;
      enemyShots.push({
        body: makeBody(enemy.body.x, enemy.body.y, 13),
        vx: (deltaX / distance) * shotSpeed,
        vy: (deltaY / distance) * shotSpeed,
        poison: enemy.isBoss,
        life: 130
      });
      enemy.nextAttackFrame = frameCount + (enemy.isBoss ? 56 : 92);
    }

    if (enemy.body.overlaps(player.body)) {
      damagePlayer(1, false);
    }

    if (enemy.poisonUntil > frameCount && frameCount >= enemy.nextPoisonFrame) {
      enemy.health -= player.poisonLevel;
      enemy.nextPoisonFrame = frameCount + 38;
      if (enemy.health <= 0) {
        enemy.alive = false;
        player.kills += 1;
      }
    }
  }
}

function updateEnemyShots() {
  for (let shotIndex = enemyShots.length - 1; shotIndex >= 0; shotIndex--) {
    const shot = enemyShots[shotIndex];
    shot.body.x += shot.vx;
    shot.body.y += shot.vy;
    shot.life -= 1;
    if (shot.body.overlaps(player.body) && frameCount >= player.invulnerableUntil) {
      damagePlayer(1, shot.poison);
      shot.body.visible = false;
      enemyShots.splice(shotIndex, 1);
      continue;
    }
    if (shot.life <= 0 || shot.body.x < ARENA.left || shot.body.x > ARENA.right || shot.body.y < ARENA.top || shot.body.y > ARENA.bottom) {
      shot.body.visible = false;
      enemyShots.splice(shotIndex, 1);
    }
  }
}

function damagePlayer(amount, poison) {
  if (frameCount < player.invulnerableUntil) return;
  player.hearts -= amount;
  player.invulnerableUntil = frameCount + 75;
  if (poison) {
    player.poisonedUntil = frameCount + 210;
    player.nextPoisonFrame = frameCount + 45;
  }
  if (player.hearts <= 0) gameState = "lost";
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
      if (player.poisonLevel && random() < 0.38 + player.poisonLevel * 0.12) {
        enemy.poisonUntil = frameCount + 200;
        enemy.nextPoisonFrame = frameCount + 38;
      }
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
  if (itemKey === "key") {
    player.keys += 1;
    roomMessage = "A small brass key. Keep it close.";
  } else if (item.kind === "heart") {
    if (player.hearts < player.maxHearts) healPlayer(1);
    else roomMessage = "Your heart is already whole.";
  } else if (item.kind === "active") {
    player.activeItem = itemKey;
    roomMessage = `${item.name} held. Press SPACE to use it.`;
  } else {
    if (player.uniqueItems.includes(itemKey)) return;
    player.uniqueItems.push(itemKey);
    if (itemKey === "quickNerve") player.speedLevel += 1;
    if (itemKey === "splitThought") player.spreadLevel += 1;
    if (itemKey === "steadyHand") player.fireLevel += 1;
    if (itemKey === "heavySilence") player.damageLevel += 1;
    if (itemKey === "sporeSack") player.poisonLevel += 1;
    if (itemKey === "deepLung") {
      player.maxHearts += 2;
      player.hearts += 2;
    }
    if (itemKey === "longShadow") player.shotSpeedLevel += 1;
    roomMessage = `${item.name}: ${passiveDescription(itemKey)}`;
  }
  roomMessageUntil = frameCount + 130;
}

function passiveDescription(itemKey) {
  if (itemKey === "quickNerve") return "movement increased";
  if (itemKey === "splitThought") return "shots split in three";
  if (itemKey === "steadyHand") return "firing speed increased";
  if (itemKey === "sporeSack") return "shots poison enemies";
  if (itemKey === "deepLung") return "two extra hearts";
  if (itemKey === "longShadow") return "shots travel faster";
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
  } else if (itemKey === "sporeCloud") {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      enemy.health -= 4;
      enemy.poisonUntil = frameCount + 230;
      enemy.nextPoisonFrame = frameCount + 38;
      enemy.hitUntil = frameCount + 10;
      if (enemy.health <= 0) {
        enemy.alive = false;
        player.kills += 1;
      }
    }
    roomMessage = "Spore Cloud: green hush fills the room.";
  }
  roomMessageUntil = frameCount + 150;
}

function healPlayer(amount) {
  const previousHearts = player.hearts;
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
  if (player.hearts > previousHearts) player.healsUsed += 1;
}

function checkRoomClear() {
  if (currentRoom.cleared || enemies.some((enemy) => enemy.alive)) return;
  currentRoom.cleared = true;
  roomCleared = true;
  if (currentRoom.type === "boss") {
    const position = findRoomPosition();
    const reward = rollRoomLoot();
    roomItems.push(makeRoomItem(reward, position.x, position.y));
    roomMessage = "The house gives way. The exit is open.";
  } else if (random() < 0.48 && player.hearts < player.maxHearts) {
    const position = findRoomPosition();
    roomItems.push(makeRoomItem("heart", position.x, position.y));
    roomMessage = "The room leaves something behind.";
  } else {
    roomMessage = "The room is quiet. Find the open door.";
  }
  roomMessageUntil = frameCount + 170;
}

function checkChestInteraction() {
  if (currentRoom.type !== "chest" || currentRoom.chestOpened) return;
  if (dist(player.body.x, player.body.y, CENTER_X, CENTER_Y) > 48) return;
  if (player.keys < 1) {
    if (frameCount >= roomMessageUntil) {
      roomMessage = "The chest is locked. Find a key on this floor.";
      roomMessageUntil = frameCount + 100;
    }
    return;
  }

  player.keys -= 1;
  currentRoom.chestOpened = true;
  const reward = rollRoomLoot();
  currentRoom.items.push(makeRoomItem(reward, CENTER_X, CENTER_Y - 70));
  roomItems = currentRoom.items;
  roomMessage = `Chest opened: ${ITEM_DATA[reward].name}.`;
  roomMessageUntil = frameCount + 160;
}

function progressToNextFloor() {
  if (floorNumber === MAX_FLOOR) {
    gameState = "won";
    awardAchievement("The Long Hall", "Reached the final floor.");
    return;
  }

  floorNumber += 1;
  if (player.healsUsed === 0) awardAchievement("Unmended", "Reached a new floor without healing.");
  player.keys = 0;
  generateFloor();
  enterRoom(startRoom, null);
  roomMessage = "A new floor settles around you.";
  roomMessageUntil = frameCount + 180;
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
