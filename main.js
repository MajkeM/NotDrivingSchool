import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

const canvas = document.querySelector("#game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06070c);
scene.fog = new THREE.FogExp2(0x05060a, 0.015);

const camera = new THREE.PerspectiveCamera(
  62,
  window.innerWidth / window.innerHeight,
  0.1,
  600
);
scene.add(camera);

const hemi = new THREE.HemisphereLight(0xfff4d2, 0x0a0a10, 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff9d4, 1.4);
sun.position.set(40, 80, 25);
scene.add(sun);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(32, 1000, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x1a1f2c, roughness: 0.95 })
);
road.rotation.x = -Math.PI / 2;
road.position.y = -0.01;
scene.add(road);

const laneLines = new THREE.Group();
const lineGeo = new THREE.BoxGeometry(0.15, 0.02, 5);
const lineMat = new THREE.MeshBasicMaterial({ color: 0xf8e16c });
for (let i = -2; i <= 2; i += 2) {
  for (let j = 0; j < 40; j += 1) {
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(i * 3.5, 0.01, -j * 20);
    laneLines.add(line);
  }
}
scene.add(laneLines);

function createPlayerCar() {
  const group = new THREE.Group();
  
  // Main body
  const bodyGeo = new THREE.BoxGeometry(1.9, 0.7, 4.2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff5fad,
    metalness: 0.3,
    roughness: 0.4,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.7 / 2 + 0.1;
  group.add(body);

  // Roof/cabin
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.4, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x231942 })
  );
  roof.position.set(0, 0.9, -0.3);
  group.add(roof);

  // Windows (transparent)
  const windowMat = new THREE.MeshStandardMaterial({ 
    color: 0x88ccff, 
    transparent: true, 
    opacity: 0.3,
    metalness: 0.9,
    roughness: 0.1
  });
  
  // Windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.35, 0.1),
    windowMat
  );
  windshield.position.set(0, 0.9, 0.5);
  group.add(windshield);
  
  // Rear window
  const rearWindow = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.35, 0.1),
    windowMat
  );
  rearWindow.position.set(0, 0.9, -1.2);
  group.add(rearWindow);

  // Neon underglow
  const neon = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.1, 4.4),
    new THREE.MeshBasicMaterial({ color: 0x20e3ff })
  );
  neon.position.y = 0.02;
  group.add(neon);

  // Wheels (4 wheels with actual geometry)
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    roughness: 0.8
  });
  const rimMat = new THREE.MeshStandardMaterial({ 
    color: 0x20e3ff,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x20e3ff,
    emissiveIntensity: 0.2
  });
  
  const wheelPositions = [
    [-0.9, 0.35, 1.4],   // Front left
    [0.9, 0.35, 1.4],    // Front right
    [-0.9, 0.35, -1.4],  // Rear left
    [0.9, 0.35, -1.4]    // Rear right
  ];
  
  group.userData.wheels = [];
  wheelPositions.forEach((pos, i) => {
    const wheel = new THREE.Group();
    
    // Tire
    const tire = new THREE.Mesh(wheelGeo, wheelMat);
    tire.rotation.z = Math.PI / 2;
    wheel.add(tire);
    
    // Rim
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.32, 8),
      rimMat
    );
    rim.rotation.z = Math.PI / 2;
    wheel.add(rim);
    
    wheel.position.set(pos[0], pos[1], pos[2]);
    group.add(wheel);
    group.userData.wheels.push(wheel);
  });

  // Headlights
  const headlightGeo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
  const headlightMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffdd,
    emissive: 0xffffdd,
    emissiveIntensity: 0.8
  });
  
  const headlightLeft = new THREE.Mesh(headlightGeo, headlightMat);
  headlightLeft.position.set(-0.6, 0.4, 2.15);
  group.add(headlightLeft);
  
  const headlightRight = new THREE.Mesh(headlightGeo, headlightMat);
  headlightRight.position.set(0.6, 0.4, 2.15);
  group.add(headlightRight);

  // Taillights
  const taillightMat = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.6
  });
  
  const taillightLeft = new THREE.Mesh(headlightGeo, taillightMat);
  taillightLeft.position.set(-0.6, 0.4, -2.15);
  group.add(taillightLeft);
  
  const taillightRight = new THREE.Mesh(headlightGeo, taillightMat);
  taillightRight.position.set(0.6, 0.4, -2.15);
  group.add(taillightRight);

  return group;
}

function createTrafficCar(color = 0xff4444) {
  const group = new THREE.Group();
  
  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.6, 4.0),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
  );
  body.position.y = 0.6 / 2;
  group.add(body);
  
  // Simple windows
  const windowMat = new THREE.MeshStandardMaterial({ 
    color: 0x446688, 
    transparent: true, 
    opacity: 0.4
  });
  const window = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.25, 1.0),
    windowMat
  );
  window.position.set(0, 0.5, 0);
  group.add(window);
  
  // Simple wheels
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  [[0.8, 1.2], [0.8, -1.2], [-0.8, 1.2], [-0.8, -1.2]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], 0.3, pos[1]);
    group.add(wheel);
  });
  
  return group;
}

function createTruck(color = 0x5555ff) {
  const group = new THREE.Group();
  
  // Cabin
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  );
  cabin.position.set(0, 0.75, 1.5);
  group.add(cabin);
  
  // Cargo
  const cargo = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 1.6, 3.5),
    new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9 })
  );
  cargo.position.set(0, 0.8, -1.2);
  group.add(cargo);
  
  // Wheels (6 wheels)
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  [[0.9, 1.5], [-0.9, 1.5], [0.9, -1.0], [-0.9, -1.0], [0.9, -2.5], [-0.9, -2.5]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], 0.4, pos[1]);
    group.add(wheel);
  });
  
  return group;
}

function createLorry(color = 0xffaa00) {
  const group = new THREE.Group();
  
  // Cabin
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.8, 1.8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  );
  cabin.position.set(0, 0.9, 2.5);
  group.add(cabin);
  
  // Trailer
  const trailer = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 2.0, 6.0),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
  );
  trailer.position.set(0, 1.0, -1.5);
  group.add(trailer);
  
  // Wheels (8 wheels)
  const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 8);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  [[1.0, 2.5], [-1.0, 2.5], [1.0, 0], [-1.0, 0], [1.0, -2.0], [-1.0, -2.0], [1.0, -4.0], [-1.0, -4.0]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], 0.45, pos[1]);
    group.add(wheel);
  });
  
  return group;
}

function createObstacle() {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 1.2, 6),
    new THREE.MeshStandardMaterial({
      color: 0xffc857,
      emissive: 0xff9f1c,
      emissiveIntensity: 0.4,
    })
  );
  mesh.position.y = 0.6;
  return mesh;
}

// Environment creation functions
function createRamp() {
  const group = new THREE.Group();
  
  // Ramp geometry
  const rampGeo = new THREE.BoxGeometry(8, 0.5, 12);
  const rampMat = new THREE.MeshStandardMaterial({ 
    color: 0x666666,
    roughness: 0.8
  });
  const ramp = new THREE.Mesh(rampGeo, rampMat);
  ramp.position.y = 0.25;
  ramp.rotation.x = -0.3; // Slight angle for ramp
  group.add(ramp);
  
  // Warning stripes (yellow/black)
  const stripeGeo = new THREE.BoxGeometry(8.1, 0.1, 1);
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.8, -4 + i * 4);
    stripe.rotation.x = -0.3;
    group.add(stripe);
  }
  
  return group;
}

const player = createPlayerCar();
scene.add(player);
player.position.set(0, 0, 20);

const cameraRig = new THREE.Group();
scene.add(cameraRig);

const START_TIP =
  "Start: drž C (spojka) a zmáčkni F. Pak přes Q/E zařaď a pomalu pusť C.";
const SNARK_LINES = [
  "Pozor, pojišťovna už hledá exit plán.",
  "Technickou ti razítkoval bratránek? Je to vidět.",
  "Řídíš jako kdybys vezl guláš – samý stres, žádná rychlost.",
  "Kuželům dávej bacha, mají ostré konexe na magistrátu.",
  "Protijedoucí auta jsou z finančáku, krutě zdaní tvoje nárazníky.",
  "Řaď rychleji než dorazí policajt s blokem.",
  "Drift? Spíš artistické klouzání, ale nevadí, jedeme dál.",
  "Plynem se nešetří, benzín zatím ještě není na příděl.",
  "Takhle se na Špindl nedostaneš ani do půlnoci.",
  "Auto má víc elektroniky než ty mozku, a stejně to funguje líp.",
  "Tvoje máma by řadila rychleji.",
  "SPZ máš aspoň platnou? Ptám se čistě čeští.",
  "Radar tě fotí víckrát než Instagram influencer.",
  "Brzdy existují, ale chápu, že jsou to náklady navíc.",
  "Paneláky vlevo jsou hezčí než tvoje stopa.",
  "Tohle je škola neřízení, ne demolice derby.",
  "Vodorovné dopravní značení je spíš doporučení, však?",
];
let snarkIndex = 0;
const instructionState = { override: "", timer: 0 };
const assistState = {
  pendingShift: false,
  shiftTimer: 0,
  autoStartCooldown: 0,
};

const ui = {
  gear: document.querySelector("#gear-label"),
  rpm: document.querySelector("#rpm-label"),
  speed: document.querySelector("#speed-label"),
  snark: document.querySelector("#snark"),
  rpmBar: document.querySelector("#rpm-progress"),
  gearBar: document.querySelector("#gear-progress"),
  rpmBadge: document.querySelector("#rpm-readout"),
  gearBadge: document.querySelector("#gear-readout"),
  instruction: document.querySelector("#instruction-text"),
  overlayInstruction: document.querySelector("#floating-instruction"),
  rpmValue: document.querySelector("#rpm-value"),
  rpmNote: document.querySelector("#rpm-note"),
  gearValue: document.querySelector("#gear-value"),
  gearNote: document.querySelector("#gear-note"),
};

// Visual Gauges Setup
const rpmGaugeCanvas = document.getElementById('rpm-gauge');
const speedGaugeCanvas = document.getElementById('speed-gauge');
const rpmCtx = rpmGaugeCanvas.getContext('2d');
const speedCtx = speedGaugeCanvas.getContext('2d');

function drawGauge(ctx, value, maxValue, label, redZoneStart = null) {
  const centerX = 100;
  const centerY = 100;
  const radius = 85;
  
  // Clear canvas
  ctx.clearRect(0, 0, 200, 200);
  
  // Draw outer ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Draw inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw tick marks and numbers
  const startAngle = Math.PI * 0.75; // Start at 7 o'clock
  const endAngle = Math.PI * 2.25; // End at 5 o'clock
  const angleRange = endAngle - startAngle;
  
  for (let i = 0; i <= 12; i++) {
    const angle = startAngle + (angleRange * i / 12);
    const tickLength = i % 3 === 0 ? 15 : 8;
    const tickStart = radius - 15;
    const tickEnd = tickStart - tickLength;
    
    // Draw tick
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * tickStart,
      centerY + Math.sin(angle) * tickStart
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * tickEnd,
      centerY + Math.sin(angle) * tickEnd
    );
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.stroke();
    
    // Draw numbers
    if (i % 3 === 0) {
      const numberRadius = radius - 30;
      const numberValue = Math.round((maxValue / 12) * i);
      ctx.fillStyle = (redZoneStart && numberValue >= redZoneStart) ? '#ff3333' : '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        numberValue,
        centerX + Math.cos(angle) * numberRadius,
        centerY + Math.sin(angle) * numberRadius
      );
    }
  }
  
  // Draw red zone if specified
  if (redZoneStart) {
    const redStartAngle = startAngle + (angleRange * redZoneStart / maxValue);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, redStartAngle, endAngle);
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 10;
    ctx.stroke();
  }
  
  // Draw needle
  const needleAngle = startAngle + (angleRange * Math.min(value, maxValue) / maxValue);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(needleAngle) * (radius - 20),
    centerY + Math.sin(needleAngle) * (radius - 20)
  );
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Draw center cap
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw label
  ctx.fillStyle = '#aaa';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, centerX, centerY + 50);
}

ui.snark.textContent = START_TIP;
setInstruction(START_TIP);
flashInstruction(START_TIP, 4);

const MASS = 1200;
const WHEEL_RADIUS = 0.35;
const WHEEL_CIRC = 2 * Math.PI * WHEEL_RADIUS;
const DIFF_RATIO = 3.7;
const GEAR_RATIOS = [2.9, 2.1, 1.6, 1.28, 1.05, 0.84];
const REVERSE_RATIO = 3.1;
const IDLE_RPM = 900;
const MAX_RPM = 6800;
const CLUTCH_THRESHOLD = 0.75;

const state = {
  velocity: new THREE.Vector3(),
  heading: 0,
  rpm: 0,
  gear: 0,
  shiftTimer: 0,
  driftBonus: 0,
  engineOn: false,
  stallCooldown: 0,
  score: 0,
  beersCollected: 0,
};

const inputState = {
  throttle: 0,
  brake: 0,
  steer: 0,
  drift: false,
  handbrake: false,
  clutch: 1, // 1 = pedal down = odpojená převodovka
};

const pressed = new Set();

function updateKeys() {
  inputState.throttle = pressed.has("KeyW") || pressed.has("ArrowUp") ? 1 : 0;
  inputState.brake = pressed.has("KeyS") || pressed.has("ArrowDown") ? 1 : 0;
  inputState.steer =
    (pressed.has("KeyD") || pressed.has("ArrowRight") ? 1 : 0) -
    (pressed.has("KeyA") || pressed.has("ArrowLeft") ? 1 : 0);
  inputState.drift = pressed.has("ShiftLeft") || pressed.has("ShiftRight");
  inputState.handbrake = pressed.has("Space");
  inputState.clutch = pressed.has("KeyC") ? 1 : 0;
}

document.addEventListener("keydown", (event) => {
  if (event.repeat) {
    pressed.add(event.code);
    return;
  }
  pressed.add(event.code);
  if (event.code === "KeyE") {
    shiftUp();
  } else if (event.code === "KeyQ") {
    shiftDown();
  } else if (event.code === "KeyF") {
    toggleEngine();
  }
  updateKeys();
});

document.addEventListener("keyup", (event) => {
  pressed.delete(event.code);
  updateKeys();
});

function shiftUp(force = false) {
  if (!force && !isClutchPressed()) {
    flashSnark("Sešlápni spojku a zkus to znova.");
    return;
  }
  if (state.gear < GEAR_RATIOS.length) {
    state.gear += 1;
    triggerShiftLag();
  }
}

function shiftDown(force = false) {
  if (!force && !isClutchPressed()) {
    flashSnark("Spojka existuje z nějakého důvodu.");
    return;
  }
  if (state.gear > -1) {
    state.gear -= 1;
    if (state.gear === 0) {
      ui.snark.textContent = "Neutrál? Taky dobrý způsob, jak dát si pauzu.";
    }
    triggerShiftLag();
  }
}

function triggerShiftLag() {
  state.shiftTimer = 0.25;
  flashSnark();
}

function flashSnark(forceLine) {
  snarkIndex = (snarkIndex + 1) % SNARK_LINES.length;
  ui.snark.textContent = forceLine || SNARK_LINES[snarkIndex];
}

function setInstruction(text) {
  if (ui.instruction) {
    ui.instruction.textContent = text;
  }
  if (ui.overlayInstruction) {
    ui.overlayInstruction.textContent = text;
  }
}

function flashInstruction(text, duration = 2.5) {
  instructionState.override = text;
  instructionState.timer = duration;
  setInstruction(text);
}

function isClutchPressed() {
  return inputState.clutch >= CLUTCH_THRESHOLD;
}

function toggleEngine(force = false) {
  if (state.engineOn) {
    state.engineOn = false;
    flashSnark("Motor si dává pauzu, ty taky můžeš.");
    flashInstruction("Motor jsi vypnul – drž C a F pro znovuzrození.", 3.2);
    return;
  }
  if (!force && !isClutchPressed()) {
    flashSnark("Nejdřív spojku, pak start.");
    return;
  }
  state.engineOn = true;
  state.rpm = IDLE_RPM + 200;
  flashSnark(
    force
      ? "Auto-start hotov, hurá na silnici."
      : "Motor žije, nezadus ho hned."
  );
  flashInstruction("Motor běží, dej kvalt a rozjeď to.", 2.8);
}

function stallEngine(message) {
  if (!state.engineOn || state.stallCooldown > 0) {
    return;
  }
  state.engineOn = false;
  state.rpm = 0;
  state.stallCooldown = 1.5;
  const line = message || "Motor šel spát, probuď ho C + F.";
  flashSnark(line);
  flashInstruction("Motor chcípnul – drž C, zmáčkni F a dej tomu jedničku.", 4);
}

function torqueFromRpm(rpm) {
  const normalized = Math.max(
    0,
    Math.min(1, (rpm - IDLE_RPM) / (MAX_RPM - IDLE_RPM))
  );
  const curve = Math.sin(normalized * Math.PI);
  return 500 * curve; // Nm-ish
}

const traffic = [];
const obstacles = [];
let trafficTimer = 0;
let obstacleTimer = 0;
const lanes = [-5.4, -1.8, 1.8, 5.4];

// Environment arrays
const ramps = [];
let treeTimer = 0;
let buildingTimer = 0;
let rampTimer = 0;

function spawnTraffic() {
  const rand = Math.random();
  let vehicle;
  let speed;
  
  if (rand < 0.6) {
    // Car (60%)
    const color = new THREE.Color().setHSL(Math.random(), 0.6, 0.5);
    vehicle = createTrafficCar(color.getHex());
    speed = 20 + Math.random() * 10;
  } else if (rand < 0.85) {
    // Truck (25%)
    const color = new THREE.Color().setHSL(Math.random(), 0.5, 0.4);
    vehicle = createTruck(color.getHex());
    speed = 15 + Math.random() * 8;
  } else {
    // Lorry (15%)
    const color = new THREE.Color().setHSL(Math.random(), 0.4, 0.3);
    vehicle = createLorry(color.getHex());
    speed = 12 + Math.random() * 5;
  }

  vehicle.position.set(
    lanes[Math.floor(Math.random() * lanes.length)],
    0.3,
    player.position.z - 140 - Math.random() * 60
  );
  vehicle.userData = { speed: speed, direction: 1 };
  scene.add(vehicle);
  traffic.push(vehicle);
}

function spawnObstacle() {
  const obstacle = createObstacle();
  obstacle.position.set(
    lanes[Math.floor(Math.random() * lanes.length)],
    0.6,
    player.position.z - 100 - Math.random() * 40
  );
  obstacle.userData = { wobble: Math.random() * Math.PI * 2 };
  scene.add(obstacle);
  obstacles.push(obstacle);
}

// New Content Arrays
const potholes = [];
const beers = [];
let potholeTimer = 0;
let beerTimer = 0;

function createPothole() {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.8, 0.05, 16),
    new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 1,
      transparent: true,
      opacity: 0.9
    })
  );
  mesh.position.y = 0.02; // Just above road
  return mesh;
}

function createBeer() {
  const group = new THREE.Group();
  
  // Can body
  const can = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.6, 12),
    new THREE.MeshStandardMaterial({ 
      color: 0xffd700, 
      metalness: 0.8, 
      roughness: 0.2,
      emissive: 0xffa500,
      emissiveIntensity: 0.3
    })
  );
  can.position.y = 0.4;
  group.add(can);
  
  // Foam/Top
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.05, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  top.position.y = 0.72;
  group.add(top);
  
  return group;
}

function spawnPothole() {
  const pothole = createPothole();
  pothole.position.set(
    lanes[Math.floor(Math.random() * lanes.length)],
    0.02,
    player.position.z - 100 - Math.random() * 40
  );
  scene.add(pothole);
  potholes.push(pothole);
}

function spawnBeer() {
  const beer = createBeer();
  beer.position.set(
    lanes[Math.floor(Math.random() * lanes.length)],
    0.4,
    player.position.z - 100 - Math.random() * 40
  );
  scene.add(beer);
  beers.push(beer);
}

// InstancedMesh Setup
const MAX_TREES = 1000;
const MAX_BUILDINGS = 500;

// Tree Geometry & Material
const treeTrunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
const treeCrownGeo = new THREE.ConeGeometry(1.8, 3, 8);
const treeCrownMat = new THREE.MeshStandardMaterial({ color: 0x2d5016, roughness: 0.8 });

const treeTrunksMesh = new THREE.InstancedMesh(treeTrunkGeo, treeTrunkMat, MAX_TREES);
const treeCrownsMesh = new THREE.InstancedMesh(treeCrownGeo, treeCrownMat, MAX_TREES);
treeTrunksMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
treeCrownsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(treeTrunksMesh);
scene.add(treeCrownsMesh);

// Building Geometry & Material
const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
const buildingMat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
const buildingsMesh = new THREE.InstancedMesh(buildingGeo, buildingMat, MAX_BUILDINGS);
buildingsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
buildingsMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_BUILDINGS * 3), 3);
buildingsMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
scene.add(buildingsMesh);

// Instance Management
let treeIndex = 0;
let buildingIndex = 0;
const dummy = new THREE.Object3D();
const buildingColors = [
  new THREE.Color(0x8b7355),
  new THREE.Color(0x9b9b9b),
  new THREE.Color(0xd4a574),
  new THREE.Color(0xb85450),
];

function spawnTree() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const x = side * (18 + Math.random() * 8);
  const z = player.position.z - 120 - Math.random() * 80;
  
  // Trunk
  dummy.position.set(x, 1.5, z);
  dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
  dummy.scale.set(1, 1, 1);
  dummy.updateMatrix();
  treeTrunksMesh.setMatrixAt(treeIndex, dummy.matrix);
  
  // Crown 1
  dummy.position.set(x, 4, z);
  dummy.updateMatrix();
  treeCrownsMesh.setMatrixAt(treeIndex, dummy.matrix);
  
  // Note: We are using one index for both trunk and crown parts for simplicity, 
  // effectively assuming 1:1 mapping. If we wanted multi-part crowns, we'd need more logic.
  // For the second crown part, we can't easily use the same index unless we double the count 
  // or use a separate mesh. For optimization, let's stick to one crown part or 
  // just map the second part to the same index in a SECOND crown mesh if needed.
  // Actually, let's just make the tree simple: 1 Trunk + 1 Crown for max performance.
  // Or we can add a second crown mesh "treeCrownsMesh2" if we really want the double-cone look.
  // Let's stick to single crown for now to keep it clean and fast.
  
  treeTrunksMesh.instanceMatrix.needsUpdate = true;
  treeCrownsMesh.instanceMatrix.needsUpdate = true;
  
  treeIndex = (treeIndex + 1) % MAX_TREES;
}

function spawnBuilding() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const width = 4 + Math.random() * 3;
  const height = 8 + Math.random() * 6;
  const depth = 3 + Math.random() * 2;
  
  const x = side * (25 + Math.random() * 15);
  const z = player.position.z - 150 - Math.random() * 100;
  
  dummy.position.set(x, height / 2, z);
  dummy.rotation.set(0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
  dummy.scale.set(width, height, depth);
  dummy.updateMatrix();
  
  buildingsMesh.setMatrixAt(buildingIndex, dummy.matrix);
  buildingsMesh.setColorAt(buildingIndex, buildingColors[Math.floor(Math.random() * buildingColors.length)]);
  
  buildingsMesh.instanceMatrix.needsUpdate = true;
  buildingsMesh.instanceColor.needsUpdate = true;
  
  buildingIndex = (buildingIndex + 1) % MAX_BUILDINGS;
}

function spawnRamp() {
  const ramp = createRamp();
  ramp.position.set(
    0, // Center of road
    0,
    player.position.z - 180 - Math.random() * 60
  );
  scene.add(ramp);
  ramps.push(ramp);
}

function removeEntity(array, mesh) {
  if (!mesh) return;
  scene.remove(mesh);
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => m.dispose());
    } else {
      mesh.material.dispose();
    }
  }
  // Dispose children if any (like wheels)
  if (mesh.traverse) {
    mesh.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
  
  const idx = array.indexOf(mesh);
  if (idx >= 0) {
    array.splice(idx, 1);
  }
}

function updateTraffic(dt) {
  trafficTimer -= dt;
  obstacleTimer -= dt;
  treeTimer -= dt;
  buildingTimer -= dt;
  rampTimer -= dt;
  potholeTimer -= dt;
  beerTimer -= dt;
  
  if (trafficTimer <= 0) {
    spawnTraffic();
    trafficTimer = 1.2 + Math.random();
  }
  if (obstacleTimer <= 0) {
    spawnObstacle();
    obstacleTimer = 2.8 + Math.random() * 1.5;
  }
  if (treeTimer <= 0) {
    spawnTree();
    spawnTree(); // Two trees at once (both sides potentially)
    treeTimer = 0.8 + Math.random() * 0.7;
  }
  if (buildingTimer <= 0) {
    spawnBuilding();
    buildingTimer = 3.5 + Math.random() * 3;
  }
  if (rampTimer <= 0) {
    spawnRamp();
    rampTimer = 12 + Math.random() * 8;
  }
  if (potholeTimer <= 0) {
    spawnPothole();
    potholeTimer = 2.0 + Math.random() * 2; // Frequent potholes (Czech roads)
  }
  if (beerTimer <= 0) {
    spawnBeer();
    beerTimer = 5.0 + Math.random() * 5;
  }

  for (let i = traffic.length - 1; i >= 0; i -= 1) {
    const car = traffic[i];
    car.position.z += car.userData.speed * dt;
    if (car.position.z > player.position.z + 60) {
      removeEntity(traffic, car);
    }
  }

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const cone = obstacles[i];
    cone.rotation.y += dt * 2.0;
    if (cone.position.z > player.position.z + 50) {
      removeEntity(obstacles, cone);
    }
  }
  
  for (let i = potholes.length - 1; i >= 0; i -= 1) {
    if (potholes[i].position.z > player.position.z + 50) {
      removeEntity(potholes, potholes[i]);
    }
  }
  
  for (let i = beers.length - 1; i >= 0; i -= 1) {
    const beer = beers[i];
    beer.rotation.y += dt * 3;
    beer.position.y = 0.5 + Math.sin(Date.now() * 0.005 + beer.id) * 0.1; // Float
    if (beer.position.z > player.position.z + 50) {
      removeEntity(beers, beer);
    }
  }
  
  // Cleanup environment objects
  for (let i = ramps.length - 1; i >= 0; i -= 1) {
    if (ramps[i].position.z > player.position.z + 60) {
      removeEntity(ramps, ramps[i]);
    }
  }
}

function handleCollisions() {
  const playerBox = {
    x: player.position.x,
    z: player.position.z,
    halfX: 0.95,
    halfZ: 2.1,
  };
  for (const car of traffic) {
    if (
      aabbIntersect(playerBox, {
        x: car.position.x,
        z: car.position.z,
        halfX: 0.9,
        halfZ: 2,
      })
    ) {
      crash(car, "auto");
      break;
    }
  }
  for (const cone of obstacles) {
    if (
      aabbIntersect(playerBox, {
        x: cone.position.x,
        z: cone.position.z,
        halfX: 0.8,
        halfZ: 0.8,
      })
    ) {
      crash(cone, "kužel");
      break;
    }
  }
  
  // Potholes (smaller hit box)
  for (const pothole of potholes) {
    if (
      aabbIntersect(playerBox, {
        x: pothole.position.x,
        z: pothole.position.z,
        halfX: 0.6,
        halfZ: 0.6,
      })
    ) {
      // Hit pothole
      state.velocity.multiplyScalar(0.85); // Slow down
      shakeCamera(0.4); // Shake effect
      flashSnark("Díra jak do pekla! Tlumiče pláčou.");
      removeEntity(potholes, pothole);
      break;
    }
  }
  
  // Beer (collectible)
  for (const beer of beers) {
    if (
      aabbIntersect(playerBox, {
        x: beer.position.x,
        z: beer.position.z,
        halfX: 0.8,
        halfZ: 0.8,
      })
    ) {
      // Collect beer
      state.score += 500;
      state.beersCollected++;
      flashSnark("Na zdraví! +500 bodů (ale neřídiš líp).");
      removeEntity(beers, beer);
      break;
    }
  }
}

let shakeIntensity = 0;
function shakeCamera(amount) {
  shakeIntensity = amount;
}

function aabbIntersect(a, b) {
  return (
    Math.abs(a.x - b.x) <= a.halfX + b.halfX &&
    Math.abs(a.z - b.z) <= a.halfZ + b.halfZ
  );
}

function crash(mesh, label) {
  state.velocity.multiplyScalar(0.2);
  flashSnark(`Au! ${label} ti právě připomněl realitu.`);
  mesh.material.color.setHex(0xffffff * Math.random());
}

function updatePlayer(delta) {
  state.stallCooldown = Math.max(0, state.stallCooldown - delta);
  const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    state.heading
  );
  const speedForward = state.velocity.dot(forward);
  const wheelRpm = (Math.abs(speedForward) / WHEEL_CIRC) * 60;
  const clutchEngagement = 1 - inputState.clutch;

  let ratio = 0;
  if (state.gear > 0) {
    ratio = GEAR_RATIOS[state.gear - 1] * DIFF_RATIO;
  } else if (state.gear < 0) {
    ratio = -REVERSE_RATIO * DIFF_RATIO;
  }

  if (!state.engineOn) {
    state.rpm = THREE.MathUtils.lerp(state.rpm, 0, delta * 3.5);
  } else if (
    state.gear === 0 ||
    Math.abs(ratio) < 0.01 ||
    clutchEngagement < 0.1
  ) {
    const target = IDLE_RPM + inputState.throttle * (MAX_RPM - IDLE_RPM);
    state.rpm = THREE.MathUtils.lerp(state.rpm, target, delta * 4.5);
  } else {
    const target = THREE.MathUtils.clamp(
      wheelRpm * Math.abs(ratio),
      IDLE_RPM,
      MAX_RPM
    );
    const freeRev = IDLE_RPM + inputState.throttle * (MAX_RPM - IDLE_RPM);
    const blended = THREE.MathUtils.lerp(freeRev, target, clutchEngagement);
    state.rpm = THREE.MathUtils.lerp(state.rpm, blended, delta * 6);
  }

  let torque = 0;
  if (state.engineOn) {
    torque = torqueFromRpm(state.rpm) * inputState.throttle * clutchEngagement;
    if (state.shiftTimer > 0) {
      state.shiftTimer -= delta;
      torque *= 0.3;
    }
  } else {
    state.shiftTimer = Math.max(0, state.shiftTimer - delta);
  }

  const driveForce = ratio === 0 ? 0 : torque * ratio;
  const accel = forward.clone().multiplyScalar((driveForce / MASS) * delta);
  state.velocity.add(accel);

  const drag = state.velocity.clone().multiplyScalar(0.45 * delta);
  state.velocity.sub(drag);

  const lateral = state.velocity
    .clone()
    .sub(forward.clone().multiplyScalar(speedForward));
  const grip = inputState.drift ? 0.35 : 2.8;
  state.velocity.sub(lateral.multiplyScalar(Math.min(1, grip * delta)));

  if (inputState.handbrake) {
    state.velocity.multiplyScalar(0.97);
  }

  if (inputState.brake > 0.1) {
    const brakeForce = Math.min(Math.abs(speedForward), inputState.brake * 24);
    state.velocity.addScaledVector(
      forward,
      -brakeForce * delta * Math.sign(speedForward || 1)
    );
  }

  const steerAmount = inputState.steer;
  const steerMultiplier = inputState.drift ? 1.6 : 1.05;
  const speedFactor = THREE.MathUtils.clamp(
    Math.abs(speedForward) * 0.035,
    0.2,
    inputState.drift ? 3 : 2.2
  );
  const lowSpeedAssist = THREE.MathUtils.lerp(
    1.4,
    0.45,
    Math.min(Math.abs(speedForward) / 30, 1)
  );
  const steeringDirection = speedForward < -0.1 ? 1 : -1;
  const headingDelta =
    steerAmount *
    steerMultiplier *
    (speedFactor + lowSpeedAssist) *
    steeringDirection;
  state.heading += headingDelta * delta;

  player.position.add(state.velocity.clone().multiplyScalar(delta * 10));
  player.rotation.y = state.heading;

  // Invisible road boundaries (soft push back)
  const ROAD_BOUNDARY = 16;
  if (Math.abs(player.position.x) > ROAD_BOUNDARY) {
    const pushback = (Math.abs(player.position.x) - ROAD_BOUNDARY) * 0.5;
    player.position.x -= Math.sign(player.position.x) * pushback;
    
    // Add lateral velocity to push back
    const pushVector = new THREE.Vector3(-Math.sign(player.position.x), 0, 0);
    state.velocity.add(pushVector.multiplyScalar(delta * 5));
    
    // Visual feedback
    if (Math.abs(player.position.x) > ROAD_BOUNDARY + 1) {
      flashSnark("Ejhle, silnice končí! Vracíme tě zpátky.");
    }
  }

  // Rotate wheels based on speed
  if (player.userData.wheels) {
    const wheelSpeed = speedForward * 2;
    player.userData.wheels.forEach(wheel => {
      wheel.rotation.x += wheelSpeed * delta;
    });
  }

  if (
    state.engineOn &&
    state.gear !== 0 &&
    clutchEngagement > 0.85 &&
    Math.abs(speedForward) < 0.5 &&
    inputState.throttle < 0.05
  ) {
    stallEngine("Zadusil jsi ho, drž C a startuj Fkem.");
  }
}

function updateCamera(delta) {
  const offset = new THREE.Vector3(0, 5, 12).applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    state.heading
  );
  
  // Apply shake
  if (shakeIntensity > 0) {
    offset.x += (Math.random() - 0.5) * shakeIntensity;
    offset.y += (Math.random() - 0.5) * shakeIntensity;
    offset.z += (Math.random() - 0.5) * shakeIntensity;
    shakeIntensity = Math.max(0, shakeIntensity - delta * 2);
  }

  const targetPos = player.position.clone().add(offset);
  cameraRig.position.lerp(targetPos, delta * 2.5);
  cameraRig.lookAt(player.position.clone().add(new THREE.Vector3(0, 1, -3)));
  camera.position.copy(cameraRig.position);
  camera.lookAt(player.position.clone().add(new THREE.Vector3(0, 1.2, -2)));
}

function updateUI(delta) {
  const speedKmh = Math.abs(state.velocity.length() * 36);
  const gearLabel = !state.engineOn
    ? "OFF"
    : state.gear === 0
    ? "N"
    : state.gear > 0
    ? `${state.gear}`
    : "R";
  ui.gear.textContent = gearLabel;
  ui.rpm.textContent = state.engineOn
    ? `${Math.round(state.rpm)} rpm`
    : "0 rpm (motor off)";
  ui.speed.textContent = `${Math.round(speedKmh)} km/h`;

  const rpmPercent = state.engineOn ? Math.min(1, state.rpm / MAX_RPM) : 0;
  if (ui.rpmBar) {
    ui.rpmBar.style.width = `${Math.round(rpmPercent * 100)}%`;
  }
  if (ui.rpmBadge) {
    ui.rpmBadge.textContent = `${Math.round(rpmPercent * 100)}%`;
  }

  const gearProgress = THREE.MathUtils.clamp(
    (state.gear + 1) / (GEAR_RATIOS.length + 1),
    0,
    1
  );
  if (ui.gearBar) {
    ui.gearBar.style.width = `${Math.round(gearProgress * 100)}%`;
  }
  if (ui.gearBadge) {
    ui.gearBadge.textContent = gearLabel;
  }
  if (ui.rpmValue) {
    const rpmDisplay = state.engineOn ? Math.round(state.rpm) : 0;
    ui.rpmValue.textContent = `${rpmDisplay} rpm`;
  }
  if (ui.rpmNote) {
    ui.rpmNote.textContent = describeRpm(rpmPercent, state.engineOn);
  }
  if (ui.gearValue) {
    ui.gearValue.textContent = gearLabel;
  }
  if (ui.gearNote) {
    ui.gearNote.textContent = describeGear(gearLabel, speedKmh, state.engineOn);
  }

  // Update Score
  if (state.engineOn && Math.abs(state.velocity.z) > 0.1) {
    state.score += Math.abs(state.velocity.z) * delta * 0.1; // Distance score
    if (inputState.drift) {
      state.score += Math.abs(state.velocity.z) * delta * 0.5; // Drift bonus
    }
  }
  
  const scoreEl = document.querySelector("#score-value");
  const beerEl = document.querySelector("#beer-value");
  if (scoreEl) scoreEl.textContent = Math.floor(state.score).toLocaleString();
  if (beerEl) beerEl.textContent = state.beersCollected;

  if (instructionState.timer > 0) {
    instructionState.timer = Math.max(0, instructionState.timer - delta);
  }
  const instructionText =
    instructionState.timer > 0
      ? instructionState.override
      : determineInstruction(speedKmh);
  setInstruction(instructionText);
  
  // Update visual gauges
  drawGauge(rpmCtx, state.rpm, MAX_RPM, '', MAX_RPM * 0.85); // Red zone at 85%
  drawGauge(speedCtx, speedKmh, 240, '', null); // Max 240 km/h
}

function determineInstruction(speedKmh) {
  if (!state.engineOn) {
    return START_TIP;
  }
  if (speedKmh < 5 && state.gear > 0) {
    return "Přidej plyn (W) a pomalu pusť spojku (C).";
  }
  if (state.gear === 0) {
    return isClutchPressed()
      ? "Stiskni Q (dolů) nebo E (nahoru) pro zařazení kvaltu."
      : "Drž C a použij Q/E pro zařazení kvaltu.";
  }
  if (isClutchPressed() && Math.abs(state.velocity.length()) < 0.5) {
    return "Pomalu pouštěj C a přidávej W pro rozjezd.";
  }
  if (speedKmh > 80 && state.gear < 5) {
    return "Motor řve, hoď tam vyšší kvalt klávesou E.";
  }
  if (inputState.drift) {
    return "Drift mód aktivní – drž směr A/D a pracuj s plynem.";
  }
  return "W = plyn, S = brzda, A/D = směr, Shift = drift, Space = ručka.";
}

function describeRpm(percent, engineOn) {
  if (!engineOn) {
    return "motor chrní";
  }
  if (percent > 0.92) {
    return "omezovač hoří";
  }
  if (percent > 0.75) {
    return "rally řev";
  }
  if (percent > 0.45) {
    return "zdravé bručení";
  }
  return "lenivé bublání";
}

function describeGear(label, speedKmh, engineOn) {
  if (!engineOn) {
    return "motor mrtvý";
  }
  if (label === "OFF") {
    return "motor mrtvý";
  }
  if (label === "N") {
    return speedKmh < 2 ? "neutrál chill" : "plachtíš na neutrál";
  }
  if (label === "R") {
    return "couváš jak šéf parkoviště";
  }
  return `rychlost ${label}, drž plyn`;
}

function updateAssist(delta) {
  assistState.autoStartCooldown = Math.max(
    assistState.autoStartCooldown - delta,
    0
  );
  const wantsMove = inputState.throttle > 0.2;
  if (
    !state.engineOn &&
    wantsMove &&
    state.stallCooldown <= 0 &&
    assistState.autoStartCooldown === 0
  ) {
    toggleEngine(true);
    flashInstruction("Auto-start: motor běží, drž W a vyraž.", 3);
    flashSnark("Pomohli jsme ti nastartovat. Zkus Q/E pro kvalty.");
    assistState.autoStartCooldown = 3.5;
  }

  const needShift = state.engineOn && state.gear === 0 && wantsMove;
  if (needShift && !assistState.pendingShift) {
    assistState.pendingShift = true;
    assistState.shiftTimer = 0.35;
  } else if (!needShift) {
    assistState.pendingShift = false;
  }

  if (assistState.pendingShift) {
    assistState.shiftTimer -= delta;
    if (assistState.shiftTimer <= 0) {
      shiftUp(true);
      assistState.pendingShift = false;
      flashInstruction("Auto hodilo jedničku – Q/E ji příště přepni sám.", 3);
      flashSnark("Jednička tam je. Zkus řadit sám, jo?");
    }
  }
}

// Particle System (Drift Smoke)
const smokeParticles = [];
const MAX_SMOKE = 60;
let smokeIndex = 0;

// Generate smoke texture
const smokeCanvas = document.createElement('canvas');
smokeCanvas.width = 32;
smokeCanvas.height = 32;
const smokeCtx = smokeCanvas.getContext('2d');
const grd = smokeCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
grd.addColorStop(0, 'rgba(200, 200, 200, 0.8)');
grd.addColorStop(1, 'rgba(200, 200, 200, 0)');
smokeCtx.fillStyle = grd;
smokeCtx.fillRect(0, 0, 32, 32);
const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

const smokeMat = new THREE.SpriteMaterial({ 
  map: smokeTexture, 
  transparent: true, 
  opacity: 0.6,
  depthWrite: false 
});

// Create pool
for (let i = 0; i < MAX_SMOKE; i++) {
  const sprite = new THREE.Sprite(smokeMat.clone()); // Clone to control opacity individually
  sprite.visible = false;
  scene.add(sprite);
  smokeParticles.push({ mesh: sprite, life: 0, velocity: new THREE.Vector3() });
}

function spawnSmoke(position, side) {
  const p = smokeParticles[smokeIndex];
  p.mesh.visible = true;
  p.mesh.position.copy(position);
  p.mesh.position.y = 0.2;
  p.mesh.position.x += side * 0.8; // Wheel offset
  p.mesh.scale.set(1, 1, 1);
  p.mesh.material.opacity = 0.6;
  
  p.life = 1.0;
  p.velocity.set(
    (Math.random() - 0.5) * 0.5,
    Math.random() * 0.5,
    (Math.random() - 0.5) * 0.5
  );
  
  smokeIndex = (smokeIndex + 1) % MAX_SMOKE;
}

function updateParticles(dt) {
  // Spawn smoke if drifting
  if (inputState.drift && Math.abs(state.velocity.length()) > 5) {
    spawnSmoke(player.position, 1);
    spawnSmoke(player.position, -1);
  }
  
  // Update existing
  for (const p of smokeParticles) {
    if (p.life > 0) {
      p.life -= dt * 1.5; // Fade speed
      p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));
      p.mesh.scale.multiplyScalar(1 + dt * 2); // Expand
      p.mesh.material.opacity = p.life * 0.6;
      
      if (p.life <= 0) {
        p.mesh.visible = false;
      }
    }
  }
}

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  updateAssist(delta);
  updatePlayer(delta);
  updateTraffic(delta);
  updateParticles(delta); // Add this
  handleCollisions();
  updateCamera(delta);
  updateUI(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
