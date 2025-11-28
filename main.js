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
  
  // Main body - Sportier shape
  const bodyGeo = new THREE.BoxGeometry(1.9, 0.6, 4.4);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff5fad,
    metalness: 0.6,
    roughness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.5;
  group.add(body);

  // Cabin - Streamlined
  const cabinGeo = new THREE.BoxGeometry(1.6, 0.5, 2.2);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(0, 1.0, -0.2);
  group.add(cabin);

  // Windows (transparent)
  const windowMat = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    metalness: 0.9,
    roughness: 0.0,
    transparent: true,
    opacity: 0.7
  });
  
  // Windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.4, 0.1),
    windowMat
  );
  windshield.position.set(0, 1.0, 0.9);
  windshield.rotation.x = -0.2;
  group.add(windshield);
  
  // Rear window
  const rearWindow = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.4, 0.1),
    windowMat
  );
  rearWindow.position.set(0, 1.0, -1.3);
  rearWindow.rotation.x = 0.1;
  group.add(rearWindow);

  // Spoiler
  const spoilerGeo = new THREE.BoxGeometry(1.8, 0.1, 0.5);
  const spoiler = new THREE.Mesh(spoilerGeo, bodyMat);
  spoiler.position.set(0, 0.9, -2.1);
  group.add(spoiler);
  
  const spoilerLegs = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.3, 0.1),
    bodyMat
  );
  spoilerLegs.position.set(0, 0.7, -2.0);
  group.add(spoilerLegs);

  // Neon underglow
  const neon = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.1, 4.5),
    new THREE.MeshBasicMaterial({ color: 0x20e3ff })
  );
  neon.position.y = 0.05;
  group.add(neon);

  // Wheels (4 wheels with actual geometry)
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    roughness: 0.8
  });
  const rimMat = new THREE.MeshStandardMaterial({ 
    color: 0x20e3ff,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x20e3ff,
    emissiveIntensity: 0.3
  });
  
  const wheelPositions = [
    [-0.9, 0.38, 1.4],   // Front left
    [0.9, 0.38, 1.4],    // Front right
    [-0.9, 0.38, -1.4],  // Rear left
    [0.9, 0.38, -1.4]    // Rear right
  ];
  
  group.userData.wheels = [];
  wheelPositions.forEach((pos, i) => {
    const wheel = new THREE.Group();
    
    // Tire
    const tire = new THREE.Mesh(wheelGeo, wheelMat);
    tire.rotation.z = Math.PI / 2;
    wheel.add(tire);
    
    // Rim (Star shape simplified)
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.36, 5),
      rimMat
    );
    rim.rotation.z = Math.PI / 2;
    wheel.add(rim);
    
    wheel.position.set(pos[0], pos[1], pos[2]);
    group.add(wheel);
    group.userData.wheels.push(wheel);
  });

  // Headlights (Projector style)
  const headlightGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8);
  const headlightMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2.0
  });
  
  const headlightLeft = new THREE.Mesh(headlightGeo, headlightMat);
  headlightLeft.rotation.x = Math.PI / 2;
  headlightLeft.position.set(-0.6, 0.5, 2.2);
  group.add(headlightLeft);
  
  const headlightRight = new THREE.Mesh(headlightGeo, headlightMat);
  headlightRight.rotation.x = Math.PI / 2;
  headlightRight.position.set(0.6, 0.5, 2.2);
  group.add(headlightRight);

  // Taillights (Strip style)
  const taillightGeo = new THREE.BoxGeometry(0.6, 0.15, 0.1);
  const taillightMat = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1.5
  });
  
  const taillightLeft = new THREE.Mesh(taillightGeo, taillightMat);
  taillightLeft.position.set(-0.6, 0.6, -2.2);
  group.add(taillightLeft);
  
  const taillightRight = new THREE.Mesh(taillightGeo, taillightMat);
  taillightRight.position.set(0.6, 0.6, -2.2);
  group.add(taillightRight);

  return group;
}

function createTrafficCar(color = 0xff4444) {
  const group = new THREE.Group();
  
  // Body - Modern sedan shape
  const bodyGeo = new THREE.BoxGeometry(1.8, 0.6, 4.2);
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.4;
  group.add(body);
  
  // Cabin
  const cabinGeo = new THREE.BoxGeometry(1.6, 0.5, 2.0);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(0, 0.9, -0.2);
  group.add(cabin);

  // Windows
  const windowMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.1 });
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.1), windowMat);
  windshield.position.set(0, 0.9, 0.8);
  windshield.rotation.x = -0.2;
  group.add(windshield);

  // Lights
  const lightGeo = new THREE.BoxGeometry(0.4, 0.15, 0.1);
  const headLightMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, emissive: 0xffffaa });
  const tailLightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
  
  const hl = new THREE.Mesh(lightGeo, headLightMat);
  hl.position.set(-0.5, 0.5, 2.1);
  group.add(hl);
  const hr = hl.clone();
  hr.position.set(0.5, 0.5, 2.1);
  group.add(hr);
  
  const tl = new THREE.Mesh(lightGeo, tailLightMat);
  tl.position.set(-0.5, 0.5, -2.1);
  group.add(tl);
  const tr = tl.clone();
  tr.position.set(0.5, 0.5, -2.1);
  group.add(tr);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 12);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  [[0.8, 1.3], [0.8, -1.3], [-0.8, 1.3], [-0.8, -1.3]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], 0.32, pos[1]);
    group.add(wheel);
  });
  
  return group;
}

function createTruck(color = 0x5555ff) {
  const group = new THREE.Group();
  
  // Cabin
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 1.8, 1.8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  );
  cabin.position.set(0, 1.1, 1.8);
  group.add(cabin);
  
  // Grille
  const grille = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.8, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 })
  );
  grille.position.set(0, 0.8, 2.75);
  group.add(grille);

  // Cargo Box
  const cargo = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.0, 4.0),
    new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9 })
  );
  cargo.position.set(0, 1.2, -1.2);
  group.add(cargo);
  
  // Wheels (6 wheels)
  const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 12);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  [[1.0, 1.8], [-1.0, 1.8], [1.0, -1.0], [-1.0, -1.0], [1.0, -2.8], [-1.0, -2.8]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], 0.45, pos[1]);
    group.add(wheel);
  });
  
  return group;
}

function createLorry(color = 0xffaa00) {
  const group = new THREE.Group();
  
  // Cabin (Euro truck style)
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.5, 2.0),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  );
  cabin.position.set(0, 1.5, 3.0);
  group.add(cabin);
  
  // Windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.0, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  windshield.position.set(0, 2.0, 4.0);
  group.add(windshield);
  
  // Trailer
  const trailer = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 2.8, 8.0),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 })
  );
  trailer.position.set(0, 1.7, -2.0);
  group.add(trailer);
  
  // Side skirts
  const skirt = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.8, 4.0),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  skirt.position.set(0, 0.6, 3.0);
  group.add(skirt);

  // Wheels (8 wheels)
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  [[1.1, 3.0], [-1.1, 3.0], [1.1, -1.0], [-1.1, -1.0], [1.1, -3.0], [-1.1, -3.0], [1.1, -5.0], [-1.1, -5.0]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], 0.5, pos[1]);
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
 // Ground (Grass)
const groundGeo = new THREE.PlaneGeometry(2000, 2000);
const groundMat = new THREE.MeshStandardMaterial({ 
  color: 0x1a472a, // Dark green grass
  roughness: 1.0,
  metalness: 0.0
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1; // Slightly below road
scene.add(ground);
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

function flashSnark(text) {
  const el = document.querySelector("#floating-snark");
  if (el) {
    el.textContent = text;
    el.classList.add("visible");
    
    // Reset timer to hide
    if (el.hideTimer) clearTimeout(el.hideTimer);
    el.hideTimer = setTimeout(() => {
      el.classList.remove("visible");
    }, 3000);
  }
}

function updateUI(delta) {
  const speedKmh = Math.abs(state.velocity.z) * 3.6; // approx
  
  // Update new text HUD
  const hudRpm = document.querySelector("#hud-rpm");
  const hudSpeed = document.querySelector("#hud-speed");
  const hudGear = document.querySelector("#hud-gear");
  
  if (hudRpm) hudRpm.textContent = Math.floor(state.rpm);
  if (hudSpeed) hudSpeed.textContent = Math.floor(speedKmh);
  if (hudGear) {
    let gearLabel = "N";
    if (state.gear > 0) gearLabel = state.gear.toString();
    if (state.gear < 0) gearLabel = "R";
    hudGear.textContent = gearLabel;
  }

  // Update floating snark position
  const snarkEl = document.querySelector("#floating-snark");
  if (snarkEl && snarkEl.classList.contains("visible")) {
    // Project player position to screen
    const pos = player.position.clone();
    pos.y += 2.5; // Above car
    pos.project(camera);
    
    const x = (pos.x * .5 + .5) * window.innerWidth;
    const y = (-(pos.y * .5) + .5) * window.innerHeight;
    
    snarkEl.style.left = `${x}px`;
    snarkEl.style.top = `${y}px`;
    snarkEl.style.transform = `translate(-50%, -100%)`; // Center above point
  }

  // Update existing UI elements using the global 'ui' object
  if (ui.gear) {
    let gearLabel = "N";
    if (state.gear > 0) gearLabel = state.gear.toString();
    if (state.gear < 0) gearLabel = "R";
    ui.gear.textContent = gearLabel;
    ui.rpm.textContent = Math.floor(state.rpm);
    ui.speed.textContent = Math.floor(speedKmh);
    
    // Note: We removed the old text-based gear note in favor of the floating snark
    // The 'gearNote' element reference is still there but might not be used for text content anymore.
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
}

const ui = {
  gear: document.querySelector("#gear-label"),
  rpm: document.querySelector("#rpm-label"),
  speed: document.querySelector("#speed-label"),
  // snark: document.querySelector("#snark"), // Removed
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

// Removed old gauge canvas references - we now use text-based HUD
// drawGauge function removed - no longer needed


flashSnark(START_TIP);
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
let lampTimer = 0;
let houseTimer = 0;
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

// InstancedMesh Setup (Reduced for performance)
const MAX_TREES = 300; // Was 1000
const MAX_BUILDINGS = 150; // Was 500
const MAX_LAMPS = 100; // Was 400
const MAX_HOUSES = 100; // Was 400

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

// Panelák (High-rise) Geometry & Material
// Create a complex geometry for Panelák
const panelakGeo = new THREE.BoxGeometry(1, 1, 1);
const panelakMat = new THREE.MeshStandardMaterial({ 
  color: 0xaaaaaa, 
  roughness: 0.9,
  flatShading: true
});

// Add window details via texture or geometry? 
// For performance with InstancedMesh, geometry is best if simple.
// Let's stick to BoxGeometry but scale it to look like tall slabs.
// We can add a second InstancedMesh for "balconies" if we want extreme detail,
// but for now let's make them tall and grey.

const buildingsMesh = new THREE.InstancedMesh(panelakGeo, panelakMat, MAX_BUILDINGS);
buildingsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
buildingsMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_BUILDINGS * 3), 3);
buildingsMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
scene.add(buildingsMesh);

// Street Lamp Geometry & Material
const lampPostGeo = new THREE.CylinderGeometry(0.1, 0.15, 6, 6);
const lampPostMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6 });
const lampHeadGeo = new THREE.BoxGeometry(0.8, 0.2, 0.4);
const lampHeadMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, emissive: 0xffffee, emissiveIntensity: 1.0 });

const lampPostsMesh = new THREE.InstancedMesh(lampPostGeo, lampPostMat, MAX_LAMPS);
const lampHeadsMesh = new THREE.InstancedMesh(lampHeadGeo, lampHeadMat, MAX_LAMPS);
lampPostsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
lampHeadsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(lampPostsMesh);
scene.add(lampHeadsMesh);

// House (Rodinný dům) Geometry & Material
const houseBodyGeo = new THREE.BoxGeometry(1, 1, 1);
const houseBodyMat = new THREE.MeshStandardMaterial({ roughness: 0.8 }); // Colors will vary
const houseRoofGeo = new THREE.ConeGeometry(0.9, 0.6, 4); // Pyramidal roof
const houseRoofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 });

const housesBodyMesh = new THREE.InstancedMesh(houseBodyGeo, houseBodyMat, MAX_HOUSES);
const housesRoofMesh = new THREE.InstancedMesh(houseRoofGeo, houseRoofMat, MAX_HOUSES);
housesBodyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
housesBodyMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_HOUSES * 3), 3);
housesRoofMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(housesBodyMesh);
scene.add(housesRoofMesh);

// House Details (Garden & Path)
const gardenGeo = new THREE.PlaneGeometry(1, 1);
const gardenMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 }); // Slightly different green
const pathGeo = new THREE.PlaneGeometry(1, 1);
const pathMat = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Concrete path

const gardensMesh = new THREE.InstancedMesh(gardenGeo, gardenMat, MAX_HOUSES);
const pathsMesh = new THREE.InstancedMesh(pathGeo, pathMat, MAX_HOUSES);
gardensMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
pathsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(gardensMesh);
scene.add(pathsMesh);

// Instance Management
let treeIndex = 0;
let buildingIndex = 0;
let lampIndex = 0;
let houseIndex = 0;
const dummy = new THREE.Object3D();
const buildingColors = [
  new THREE.Color(0x8b7355),
  new THREE.Color(0x9b9b9b),
  new THREE.Color(0xd4a574),
  new THREE.Color(0xb85450),
];
const houseColors = [
  new THREE.Color(0xffeebb),
  new THREE.Color(0xccffcc),
  new THREE.Color(0xffcccc),
  new THREE.Color(0xeeeeff),
];

function spawnTree() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const x = side * (18 + Math.random() * 12); // Along roadside
  const z = player.position.z - 100 - Math.random() * 80; // Much wider z-spread
  
  // Trunk
  dummy.position.set(x, 1.5, z);
  dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
  dummy.scale.set(1, 1, 1);
  dummy.updateMatrix();
  treeTrunksMesh.setMatrixAt(treeIndex, dummy.matrix);
  
  // Crown
  dummy.position.set(x, 4, z);
  dummy.updateMatrix();
  treeCrownsMesh.setMatrixAt(treeIndex, dummy.matrix);
  
  treeTrunksMesh.instanceMatrix.needsUpdate = true;
  treeCrownsMesh.instanceMatrix.needsUpdate = true;
  
  treeIndex = (treeIndex + 1) % MAX_TREES;
}

function spawnBuilding() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const width = 12 + Math.random() * 8; // Wide
  const height = 20 + Math.random() * 15; // Tall (Panelák)
  const depth = 8 + Math.random() * 4;
  
  const x = side * (45 + Math.random() * 20); // Further back
  const z = player.position.z - 200 - Math.random() * 100;
  
  dummy.position.set(x, height / 2, z);
  // Paneláky are usually aligned with the street or perpendicular
  const rotation = Math.random() > 0.7 ? Math.PI / 2 : 0; 
  dummy.rotation.set(0, rotation, 0);
  dummy.scale.set(width, height, depth);
  dummy.updateMatrix();
  
  buildingsMesh.setMatrixAt(buildingIndex, dummy.matrix);
  
  // Concrete colors
  const greyVal = 0.5 + Math.random() * 0.3;
  const color = new THREE.Color(greyVal, greyVal, greyVal);
  // Occasional colorful panelák (renovated)
  if (Math.random() < 0.3) {
    color.setHSL(Math.random(), 0.4, 0.6);
  }
  
  buildingsMesh.setColorAt(buildingIndex, color);
  
  buildingsMesh.instanceMatrix.needsUpdate = true;
  buildingsMesh.instanceColor.needsUpdate = true;
  
  buildingIndex = (buildingIndex + 1) % MAX_BUILDINGS;
}

function spawnLamp() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const x = side * 12; // Closer to road
  const z = player.position.z - 150 - Math.random() * 60; // Much wider z-spread
  
  // Post
  dummy.position.set(x, 3, z);
  dummy.rotation.set(0, 0, 0);
  dummy.scale.set(1, 1, 1);
  dummy.updateMatrix();
  lampPostsMesh.setMatrixAt(lampIndex, dummy.matrix);
  
  // Head
  dummy.position.set(x - side * 0.5, 5.8, z); // Overhang road slightly
  dummy.rotation.set(0, 0, 0);
  dummy.scale.set(1, 1, 1);
  dummy.updateMatrix();
  lampHeadsMesh.setMatrixAt(lampIndex, dummy.matrix);
  
  lampPostsMesh.instanceMatrix.needsUpdate = true;
  lampHeadsMesh.instanceMatrix.needsUpdate = true;
  
  lampIndex = (lampIndex + 1) % MAX_LAMPS;
}

function spawnHouse() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const width = 5 + Math.random() * 2;
  const height = 3.5 + Math.random() * 1.5;
  const depth = 5 + Math.random() * 2;
  
  const x = side * (22 + Math.random() * 5); // Between road and paneláks
  const z = player.position.z - 150 - Math.random() * 100; // Wider z-spread
  
  // Body
  dummy.position.set(x, height / 2, z);
  dummy.rotation.set(0, 0, 0); // Align with road
  dummy.scale.set(width, height, depth);
  dummy.updateMatrix();
  housesBodyMesh.setMatrixAt(houseIndex, dummy.matrix);
  housesBodyMesh.setColorAt(houseIndex, houseColors[Math.floor(Math.random() * houseColors.length)]);
  
  // Roof
  dummy.position.set(x, height + 1.5, z);
  dummy.rotation.set(0, Math.PI / 4, 0); // Rotate 45deg for pyramid look
  dummy.scale.set(width * 0.8, 3, depth * 0.8);
  dummy.updateMatrix();
  housesRoofMesh.setMatrixAt(houseIndex, dummy.matrix);
  
  // Garden (Front yard)
  dummy.position.set(x, 0.05, z + (depth/2 + 2)); // In front of house? No, z is forward. 
  // Road is at x=0. House is at x=22. Front of house faces road (x=0).
  // So garden should be between house and road.
  // If side=1 (right), house at x=22. Garden at x=15.
  // If side=-1 (left), house at x=-22. Garden at x=-15.
  
  const gardenX = x - (side * (width/2 + 3));
  dummy.position.set(gardenX, 0.02, z);
  dummy.rotation.set(-Math.PI/2, 0, 0);
  dummy.scale.set(6, depth + 4, 1);
  dummy.updateMatrix();
  gardensMesh.setMatrixAt(houseIndex, dummy.matrix);
  
  // Path (to door)
  dummy.position.set(gardenX, 0.03, z);
  dummy.rotation.set(-Math.PI/2, 0, 0);
  dummy.scale.set(7, 1.5, 1); // Path leading to road
  dummy.updateMatrix();
  pathsMesh.setMatrixAt(houseIndex, dummy.matrix);
  
  housesBodyMesh.instanceMatrix.needsUpdate = true;
  housesBodyMesh.instanceColor.needsUpdate = true;
  housesRoofMesh.instanceMatrix.needsUpdate = true;
  gardensMesh.instanceMatrix.needsUpdate = true;
  pathsMesh.instanceMatrix.needsUpdate = true;
  
  houseIndex = (houseIndex + 1) % MAX_HOUSES;
}

function spawnRamp() {
  const type = Math.random();
  let scale = 1;
  let color = 0x666666;
  
  if (type < 0.5) {
    // Small Ramp
    scale = 0.8;
  } else if (type < 0.8) {
    // Medium Ramp
    scale = 1.2;
    color = 0x884444;
  } else {
    // Mega Jump
    scale = 1.8;
    color = 0xff0000;
  }

  const group = new THREE.Group();
  
  // Ramp geometry
  const rampGeo = new THREE.BoxGeometry(8 * scale, 0.5 * scale, 12 * scale);
  const rampMat = new THREE.MeshStandardMaterial({ 
    color: color,
    roughness: 0.8
  });
  const ramp = new THREE.Mesh(rampGeo, rampMat);
  ramp.position.y = 0.25 * scale;
  ramp.rotation.x = -0.3; // Slight angle for ramp
  group.add(ramp);
  
  // Warning stripes
  const stripeGeo = new THREE.BoxGeometry(8.1 * scale, 0.1 * scale, 1 * scale);
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.8 * scale, (-4 + i * 4) * scale);
    stripe.rotation.x = -0.3;
    group.add(stripe);
  }
  
  group.position.set(
    0, 
    0,
    player.position.z - 180 - Math.random() * 60
  );
  
  scene.add(group);
  ramps.push(group);
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
  lampTimer -= dt;
  houseTimer -= dt;
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
  if (treeTimer <=  0) {
    spawnTree();
    spawnTree();
    treeTimer = 3.0 + Math.random() * 2.0; // Much more spacing between tree pairs
  }
  if (buildingTimer <= 0) {
    spawnBuilding();
    buildingTimer = 8.0 + Math.random() * 6; // Spread out paneláky
  }
  if (lampTimer <= 0) {
    spawnLamp();
    spawnLamp(); // Both sides
    lampTimer = 8.0 + Math.random() * 4.0; // Much wider spacing between lamp posts
  }
  if (houseTimer <= 0) {
    spawnHouse();
    houseTimer = 6.0 + Math.random() * 4; // More space between houses
  }
  if (rampTimer <= 0) {
    spawnRamp();
    rampTimer = 15 + Math.random() * 10; // Slightly more spread
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
  
  // Helper to change color
  const changeColor = (mat) => {
    if (mat && mat.color) {
      mat.color.setHex(0xffffff * Math.random());
    }
  };

  if (mesh.traverse) {
    mesh.traverse((child) => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(changeColor);
        } else {
          changeColor(child.material);
        }
      }
    });
  } else if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(changeColor);
    } else {
      changeColor(mesh.material);
    }
  }
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
