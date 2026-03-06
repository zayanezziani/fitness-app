// Fitness App — Figma Plugin
// Generates 4 main screens as editable design frames in the current file.
//
// Screens created:
//   1. Home — Workouts list
//   2. Builder — New Workout editor
//   3. Session — Active workout tracker
//   4. History — Past sessions
//
// Target file: https://www.figma.com/design/MB6Gj7v85KV4vIfkOrjl7P/
// Font used: Inter (matches Figma default; swap to SF Pro on macOS if desired)

const W = 390;
const H = 844;

// ── Color helpers ─────────────────────────────────────────────────────────────

function rgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  };
}

function solid(hex, opacity = 1) {
  return [{ type: "SOLID", color: rgb(hex), opacity }];
}

// ── Node factories ────────────────────────────────────────────────────────────

function makeRect(parent, x, y, w, h, opts = {}) {
  const { fill, fillOpacity = 1, radius = 0 } = opts;
  const node = figma.createRectangle();
  node.resize(w, h);
  node.x = x;
  node.y = y;
  node.fills = fill ? solid(fill, fillOpacity) : [];
  if (radius) node.cornerRadius = radius;
  parent.appendChild(node);
  return node;
}

function makeEllipse(parent, x, y, w, h, opts = {}) {
  const { fill, fillOpacity = 1 } = opts;
  const node = figma.createEllipse();
  node.resize(w, h);
  node.x = x;
  node.y = y;
  node.fills = fill ? solid(fill, fillOpacity) : [];
  parent.appendChild(node);
  return node;
}

function makeFrame(parent, x, y, w, h, opts = {}) {
  const { fill, radius = 0, name = "Frame", clips = true } = opts;
  const node = figma.createFrame();
  node.resize(w, h);
  node.x = x;
  node.y = y;
  node.fills = fill ? solid(fill) : [];
  if (radius) node.cornerRadius = radius;
  node.name = name;
  node.clipsContent = clips;
  if (parent) parent.appendChild(node);
  return node;
}

function makeText(parent, content, x, y, opts = {}) {
  const {
    size = 14,
    weight = 400,
    color = "#1c1c1e",
    opacity = 1,
    letterSpacing = 0,
  } = opts;
  let style = "Regular";
  if (weight >= 800) style = "Extra Bold";
  else if (weight >= 700) style = "Bold";
  else if (weight >= 600) style = "Semi Bold";
  else if (weight >= 500) style = "Medium";

  const node = figma.createText();
  node.fontName = { family: "Inter", style };
  node.fontSize = size;
  node.fills = solid(color, opacity);
  node.characters = String(content);
  node.x = x;
  node.y = y;
  if (letterSpacing) node.letterSpacing = { value: letterSpacing, unit: "PIXELS" };
  parent.appendChild(node);
  return node;
}

// ── Shared components ─────────────────────────────────────────────────────────

function addBottomNav(frame, activeTab) {
  const nav = makeFrame(frame, 0, 761, W, 83, {
    fill: "#ffffff",
    name: "Bottom Nav",
  });
  // Top divider
  makeRect(nav, 0, 0, W, 1, { fill: "#000000", fillOpacity: 0.06 });

  const tabs = [
    { label: "Workouts", x: 65 },
    { label: "Session", x: 195 },
    { label: "History", x: 325 },
  ];

  tabs.forEach((tab, i) => {
    const isActive = i === activeTab;
    const col = isActive ? "#ff2d55" : "#aeaeb2";
    // Active indicator bar
    if (isActive) makeRect(nav, tab.x - 16, 0, 32, 3, { fill: "#ff2d55", radius: 2 });
    // Icon placeholder (colored dot for active, gray for inactive)
    makeEllipse(nav, tab.x - 10, 12, 20, 20, {
      fill: col,
      fillOpacity: isActive ? 0.15 : 0.1,
    });
    makeRect(nav, tab.x - 6, 16, 12, 12, { fill: col, radius: 3 });
    // Label
    makeText(nav, tab.label, tab.x - 22, 38, {
      size: 10,
      weight: isActive ? 600 : 500,
      color: col,
    });
  });
}

// Category pill: draws bg rect + label, returns width used
function addPill(parent, x, y, label, color) {
  const w = label.length * 6.5 + 18;
  makeRect(parent, x, y, w, 20, { fill: color, fillOpacity: 0.1, radius: 10 });
  makeText(parent, label, x + 8, y + 4, {
    size: 10,
    weight: 600,
    color,
    letterSpacing: 0.8,
  });
  return w;
}

// Simplified exercise icon: colored circle + inner square
function addExIcon(parent, x, y, color, large = false) {
  const sz = large ? 52 : 36;
  const pad = large ? 14 : 10;
  makeEllipse(parent, x, y, sz, sz, { fill: color, fillOpacity: 0.12 });
  makeRect(parent, x + pad, y + pad, sz - pad * 2, sz - pad * 2, {
    fill: color,
    radius: 4,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1: Home — Workouts
// ─────────────────────────────────────────────────────────────────────────────

function createHomeScreen() {
  const frame = makeFrame(null, 0, 0, W, H, {
    fill: "#f2f2f7",
    name: "Home — Workouts",
  });
  figma.currentPage.appendChild(frame);

  // ── Header ──
  const header = makeFrame(frame, 0, 0, W, 116, {
    fill: "#ffffff",
    name: "Header",
  });
  makeRect(header, 0, 115, W, 1, { fill: "#000000", fillOpacity: 0.04 });
  makeText(header, "Good Morning", 20, 58, { size: 15, weight: 500, color: "#8e8e93" });
  makeText(header, "Time to Exercise!", 20, 78, { size: 32, weight: 700, color: "#1c1c1e" });

  // ── Active session banner ──
  const banner = makeFrame(frame, 20, 128, 350, 56, {
    fill: "#ff2d55",
    radius: 16,
    name: "Active Session Banner",
  });
  makeEllipse(banner, 12, 12, 32, 32, { fill: "#ffffff", fillOpacity: 0.18 });
  makeRect(banner, 19, 19, 18, 18, { fill: "#ffffff", radius: 3 });
  makeText(banner, "Session in progress", 56, 11, { size: 14, weight: 600, color: "#ffffff" });
  makeText(banner, "Push Day", 56, 30, { size: 12, weight: 400, color: "#ffffff", opacity: 0.72 });
  makeText(banner, ">", 324, 17, { size: 18, weight: 400, color: "#ffffff", opacity: 0.6 });

  // ── Workout cards ──
  const cards = [
    {
      name: "Push Day",
      sub: "5 exercises  ·  16 sets",
      y: 196,
      pills: [
        { label: "CHEST", color: "#ff2d55" },
        { label: "SHOULDERS", color: "#af52de" },
      ],
      icons: ["#ff2d55", "#af52de", "#ff2d55", "#af52de", "#ff9500"],
    },
    {
      name: "Pull Day",
      sub: "4 exercises  ·  12 sets",
      y: 360,
      pills: [
        { label: "BACK", color: "#5856d6" },
        { label: "ARMS", color: "#ff9500" },
      ],
      icons: ["#5856d6", "#ff9500", "#5856d6", "#ff9500"],
    },
    {
      name: "Leg Day",
      sub: "6 exercises  ·  18 sets",
      y: 524,
      pills: [
        { label: "LEGS", color: "#34c759" },
        { label: "CORE", color: "#ffcc00" },
      ],
      icons: ["#34c759", "#ffcc00", "#34c759", "#ffcc00", "#34c759"],
    },
  ];

  for (const cd of cards) {
    const card = makeFrame(frame, 20, cd.y, 350, 152, {
      fill: "#ffffff",
      radius: 20,
      name: `Workout Card — ${cd.name}`,
    });

    // Pills
    let pillX = 20;
    for (const p of cd.pills) {
      pillX += addPill(card, pillX, 20, p.label, p.color) + 8;
    }

    makeText(card, cd.name, 20, 46, { size: 17, weight: 700, color: "#1c1c1e" });
    makeText(card, cd.sub, 20, 68, { size: 13, weight: 400, color: "#8e8e93" });

    // Exercise icons row
    for (let i = 0; i < cd.icons.length; i++) {
      addExIcon(card, 20 + i * 40, 88, cd.icons[i]);
    }

    // Action buttons
    makeRect(card, 20, 128, 40, 40, { fill: "#f2f2f7", radius: 12 });
    makeText(card, "Del", 27, 142, { size: 10, weight: 600, color: "#aeaeb2" });
    makeRect(card, 68, 128, 40, 40, { fill: "#f2f2f7", radius: 12 });
    makeText(card, "Edit", 74, 142, { size: 10, weight: 600, color: "#aeaeb2" });
    makeRect(card, 116, 128, 214, 40, { fill: "#ff2d55", radius: 16 });
    makeText(card, "Start Workout", 161, 143, { size: 14, weight: 600, color: "#ffffff" });
  }

  // ── FAB ──
  makeEllipse(frame, 314, 692, 56, 56, { fill: "#ff2d55" });
  makeText(frame, "+", 330, 698, { size: 28, weight: 400, color: "#ffffff" });

  addBottomNav(frame, 0);
  return frame;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2: Builder — New Workout
// ─────────────────────────────────────────────────────────────────────────────

function createBuilderScreen() {
  const frame = makeFrame(null, 430, 0, W, H, {
    fill: "#f2f2f7",
    name: "Builder — New Workout",
  });
  figma.currentPage.appendChild(frame);

  // ── Header ──
  const header = makeFrame(frame, 0, 0, W, 132, {
    fill: "#ffffff",
    name: "Header",
  });
  makeRect(header, 0, 131, W, 1, { fill: "#000000", fillOpacity: 0.04 });
  makeText(header, "<", 16, 62, { size: 20, weight: 400, color: "#8e8e93" });
  makeText(header, "New Workout", 46, 66, { size: 15, weight: 500, color: "#8e8e93" });

  // Name input field
  makeRect(header, 20, 86, 350, 48, { fill: "#f2f2f7", radius: 16 });
  makeText(header, "Back Day", 36, 100, { size: 20, weight: 700, color: "#1c1c1e" });

  // ── Exercise rows ──
  const exercises = [
    { name: "Barbell Row", cat: "Back", color: "#5856d6", sets: 4, reps: 8 },
    { name: "Pull-ups", cat: "Back", color: "#5856d6", sets: 3, reps: 10 },
    { name: "Bicep Curl", cat: "Arms", color: "#ff9500", sets: 3, reps: 12 },
  ];

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    const card = makeFrame(frame, 20, 144 + i * 96, 350, 88, {
      fill: "#ffffff",
      radius: 16,
      name: `Exercise — ${ex.name}`,
    });

    addExIcon(card, 12, 12, ex.color);

    makeText(card, ex.name, 58, 12, { size: 14, weight: 600, color: "#1c1c1e" });
    makeText(card, ex.cat, 58, 31, { size: 12, weight: 400, color: "#8e8e93" });

    // Up/down reorder
    makeText(card, "^", 286, 10, { size: 12, weight: 500, color: "#8e8e93" });
    makeText(card, "v", 286, 26, { size: 12, weight: 500, color: "#8e8e93" });

    // Delete button
    makeRect(card, 310, 10, 30, 30, { fill: "#f2f2f7", radius: 10 });
    makeText(card, "x", 320, 18, { size: 12, weight: 600, color: "#aeaeb2" });

    // Divider
    makeRect(card, 0, 58, 350, 1, { fill: "#000000", fillOpacity: 0.06 });

    // Sets stepper
    makeText(card, "Sets", 12, 67, { size: 12, weight: 500, color: "#8e8e93" });
    makeEllipse(card, 46, 61, 26, 26, { fill: "#f2f2f7" });
    makeText(card, "-", 54, 66, { size: 16, weight: 500, color: "#8e8e93" });
    makeText(card, String(ex.sets), 78, 67, { size: 15, weight: 700, color: "#1c1c1e" });
    makeEllipse(card, 94, 61, 26, 26, { fill: "#f2f2f7" });
    makeText(card, "+", 101, 66, { size: 16, weight: 500, color: "#8e8e93" });

    // Vertical divider
    makeRect(card, 134, 62, 1, 22, { fill: "#000000", fillOpacity: 0.06 });

    // Reps stepper
    makeText(card, "Reps", 144, 67, { size: 12, weight: 500, color: "#8e8e93" });
    makeEllipse(card, 180, 61, 26, 26, { fill: "#f2f2f7" });
    makeText(card, "-", 188, 66, { size: 16, weight: 500, color: "#8e8e93" });
    makeText(card, String(ex.reps), 214, 67, { size: 15, weight: 700, color: "#1c1c1e" });
    makeEllipse(card, 230, 61, 26, 26, { fill: "#f2f2f7" });
    makeText(card, "+", 237, 66, { size: 16, weight: 500, color: "#8e8e93" });
  }

  // ── Bottom actions ──
  const addBtn = makeFrame(frame, 20, 444, 350, 48, {
    fill: "#f2f2f7",
    radius: 16,
    name: "Add Exercise Button",
  });
  // Dashed border simulation with a slightly darker bg
  addBtn.fills = solid("#e8e8ed");
  makeText(addBtn, "+ Add Exercise", 120, 15, { size: 14, weight: 600, color: "#8e8e93" });

  makeRect(frame, 20, 500, 350, 52, { fill: "#ff2d55", radius: 16 });
  makeText(frame, "Create Workout", 131, 515, { size: 16, weight: 700, color: "#ffffff" });

  addBottomNav(frame, 0);
  return frame;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3: Session — Active Workout
// ─────────────────────────────────────────────────────────────────────────────

function createSessionScreen() {
  const frame = makeFrame(null, 860, 0, W, H, {
    fill: "#f2f2f7",
    name: "Session — Active Workout",
  });
  figma.currentPage.appendChild(frame);

  // ── Header ──
  const header = makeFrame(frame, 0, 0, W, 116, {
    fill: "#ffffff",
    name: "Session Header",
  });
  makeRect(header, 0, 115, W, 1, { fill: "#000000", fillOpacity: 0.04 });

  makeText(header, "Push Day", 20, 58, { size: 18, weight: 700, color: "#1c1c1e" });
  makeText(header, "8:24", 38, 80, { size: 13, weight: 500, color: "#8e8e93" });

  // Progress ring (two concentric circles)
  makeEllipse(header, 294, 50, 58, 58, { fill: "#f2f2f7" });
  makeEllipse(header, 301, 57, 44, 44, { fill: "#ffffff" });
  // Ring arc simulation: colored circle behind white
  makeEllipse(header, 294, 50, 58, 58, { fill: "#ff2d55", fillOpacity: 0 }); // placeholder — visual ring drawn as label
  makeText(header, "65%", 302, 72, { size: 13, weight: 700, color: "#ff2d55" });

  // X button
  makeEllipse(header, 354, 58, 32, 32, { fill: "#f2f2f7" });
  makeText(header, "X", 362, 66, { size: 13, weight: 600, color: "#8e8e93" });

  // Summary row
  makeText(header, "8/12 sets   ·   96 reps   ·   3 exercises", 20, 98, {
    size: 12,
    weight: 400,
    color: "#8e8e93",
  });

  // ── Current exercise card ──
  const exCard = makeFrame(frame, 20, 128, 350, 242, {
    fill: "#ffffff",
    radius: 20,
    name: "Current Exercise — Bench Press",
  });

  addExIcon(exCard, 20, 16, "#ff2d55", true);

  makeText(exCard, "CHEST", 82, 18, { size: 11, weight: 700, color: "#ff2d55", letterSpacing: 1 });
  makeText(exCard, "1 of 3", 130, 18, { size: 11, weight: 500, color: "#aeaeb2" });
  makeText(exCard, "Bench Press", 82, 34, { size: 20, weight: 700, color: "#1c1c1e" });
  makeText(exCard, "2/4 sets complete  ·  8 reps target", 82, 60, {
    size: 13,
    weight: 400,
    color: "#8e8e93",
  });

  // Progress bar
  makeRect(exCard, 20, 84, 310, 6, { fill: "#f2f2f7", radius: 3 });
  makeRect(exCard, 20, 84, 155, 6, { fill: "#ff2d55", radius: 3 });

  // Set rows
  const sets = [
    { label: "Set 1", done: true },
    { label: "Set 2", done: true },
    { label: "Set 3", done: false },
    { label: "Set 4", done: false },
  ];

  for (let i = 0; i < sets.length; i++) {
    const s = sets[i];
    const ry = 100 + i * 35;
    makeRect(exCard, 16, ry, 318, 31, {
      fill: s.done ? "#34c759" : "#f2f2f7",
      fillOpacity: s.done ? 0.1 : 1,
      radius: 12,
    });
    makeText(exCard, s.label, 28, ry + 9, { size: 13, weight: 600, color: "#8e8e93" });

    // Rep counter: − 8 /8 +
    makeText(exCard, "-", 134, ry + 8, { size: 16, weight: 400, color: "#8e8e93" });
    makeText(exCard, "8", 162, ry + 9, { size: 14, weight: 700, color: "#1c1c1e" });
    makeText(exCard, "/ 8", 178, ry + 11, { size: 12, weight: 400, color: "#aeaeb2" });
    makeText(exCard, "+", 216, ry + 8, { size: 16, weight: 400, color: "#8e8e93" });

    // Complete circle
    makeEllipse(exCard, 284, ry + 4, 24, 24, {
      fill: s.done ? "#34c759" : "#ffffff",
      fillOpacity: s.done ? 1 : 1,
    });
    if (!s.done) {
      // Empty circle border (simulated with a ring)
      makeEllipse(exCard, 286, ry + 6, 20, 20, { fill: "#e5e5ea" });
      makeEllipse(exCard, 288, ry + 8, 16, 16, { fill: "#ffffff" });
    } else {
      makeText(exCard, "v", 290, ry + 9, { size: 11, weight: 700, color: "#ffffff" });
    }
  }

  // ── All exercises section ──
  makeText(frame, "ALL EXERCISES", 20, 382, {
    size: 12,
    weight: 600,
    color: "#aeaeb2",
    letterSpacing: 2,
  });

  const allEx = [
    { name: "Bench Press", sub: "2/4 sets  ·  8 reps target", color: "#ff2d55", focused: true },
    { name: "Overhead Press", sub: "0/3 sets  ·  10 reps target", color: "#af52de", focused: false },
    { name: "Tricep Dip", sub: "0/3 sets  ·  12 reps target", color: "#ff9500", focused: false },
  ];

  for (let i = 0; i < allEx.length; i++) {
    const ex = allEx[i];
    const chip = makeFrame(frame, 20, 402 + i * 58, 350, 50, {
      fill: "#ffffff",
      radius: 16,
      name: `Exercise chip — ${ex.name}`,
    });
    if (ex.focused) {
      chip.strokes = [{ type: "SOLID", color: rgb(ex.color) }];
      chip.strokeWeight = 2;
      chip.strokeAlign = "INSIDE";
    }
    addExIcon(chip, 10, 8, ex.color);
    makeText(chip, ex.name, 54, 8, { size: 14, weight: 600, color: "#1c1c1e" });
    makeText(chip, ex.sub, 54, 27, { size: 12, weight: 400, color: "#8e8e93" });
  }

  // ── End session button ──
  makeRect(frame, 20, 584, 350, 48, { fill: "#f2f2f7", radius: 16 });
  makeText(frame, "End Session Early", 126, 598, { size: 14, weight: 600, color: "#8e8e93" });

  addBottomNav(frame, 1);
  return frame;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 4: History — Past Sessions
// ─────────────────────────────────────────────────────────────────────────────

function createHistoryScreen() {
  const frame = makeFrame(null, 1290, 0, W, H, {
    fill: "#f2f2f7",
    name: "History — Past Sessions",
  });
  figma.currentPage.appendChild(frame);

  // ── Header ──
  makeText(frame, "History", 20, 66, { size: 32, weight: 700, color: "#1c1c1e" });
  makeText(frame, "5 sessions completed", 20, 106, { size: 14, weight: 400, color: "#8e8e93" });

  // ── Session cards ──
  const sessions = [
    { name: "Push Day", date: "Fri, Mar 6", dur: "42m", sets: "12/16", reps: 96, expanded: false },
    { name: "Pull Day", date: "Wed, Mar 4", dur: "38m", sets: "10/12", reps: 80, expanded: true },
    { name: "Leg Day", date: "Mon, Mar 2", dur: "55m", sets: "16/18", reps: 120, expanded: false },
    { name: "Push Day", date: "Fri, Feb 28", dur: "40m", sets: "12/16", reps: 88, expanded: false },
  ];

  let y = 132;

  for (const s of sessions) {
    const cardH = s.expanded ? 176 : 78;
    const card = makeFrame(frame, 20, y, 350, cardH, {
      fill: "#ffffff",
      radius: 16,
      name: `Session — ${s.name} (${s.date})`,
    });

    // Trophy icon container
    makeRect(card, 12, 17, 44, 44, { fill: "#ff2d55", fillOpacity: 0.1, radius: 14 });
    makeText(card, "T", 26, 29, { size: 16, weight: 700, color: "#ff2d55" });

    // Session info
    makeText(card, s.name, 68, 17, { size: 15, weight: 700, color: "#1c1c1e" });
    makeText(card, s.date, 68, 38, { size: 12, weight: 400, color: "#8e8e93" });
    makeText(card, s.dur, 152, 38, { size: 12, weight: 400, color: "#8e8e93" });
    makeText(card, s.sets + " sets", 202, 38, { size: 12, weight: 400, color: "#8e8e93" });
    makeText(card, s.reps + " reps", 262, 38, { size: 12, weight: 400, color: "#8e8e93" });

    // Chevron
    makeText(card, s.expanded ? "^" : "v", 326, 28, { size: 14, weight: 400, color: "#aeaeb2" });

    if (s.expanded) {
      makeRect(card, 0, 70, 350, 1, { fill: "#000000", fillOpacity: 0.06 });

      const details = [
        { name: "Barbell Row", info: "3/4 sets  ·  24 reps", done: false },
        { name: "Pull-ups", info: "3/3 sets  ·  27 reps", done: true },
        { name: "Bicep Curl", info: "3/3 sets  ·  36 reps", done: true },
      ];

      for (let j = 0; j < details.length; j++) {
        const d = details[j];
        const dy = 78 + j * 32;
        addExIcon(card, 12, dy, "#5856d6");
        makeText(card, d.name, 54, dy + 2, { size: 13, weight: 500, color: "#1c1c1e" });
        makeText(card, d.info, 54, dy + 17, { size: 11, weight: 400, color: "#8e8e93" });
        if (d.done) {
          makeEllipse(card, 318, dy + 7, 18, 18, { fill: "#34c759" });
          makeText(card, "v", 323, dy + 9, { size: 10, weight: 700, color: "#ffffff" });
        }
      }
    }

    y += cardH + 12;
  }

  addBottomNav(frame, 2);
  return frame;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

(async () => {
  try {
    // Load all Inter weights we'll use
    await Promise.all(
      [
        { family: "Inter", style: "Regular" },
        { family: "Inter", style: "Medium" },
        { family: "Inter", style: "Semi Bold" },
        { family: "Inter", style: "Bold" },
        { family: "Inter", style: "Extra Bold" },
      ].map((f) => figma.loadFontAsync(f))
    );

    const home = createHomeScreen();
    const builder = createBuilderScreen();
    const session = createSessionScreen();
    const history = createHistoryScreen();

    figma.viewport.scrollAndZoomIntoView([home, builder, session, history]);
    figma.closePlugin("4 screens created successfully!");
  } catch (err) {
    figma.closePlugin("Error: " + err.message);
  }
})();
