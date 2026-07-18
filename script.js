(() => {
  "use strict";

  const ATTEMPTS_TO_ESCAPE = 10;
  const ATTEMPTS_TO_WIN = 15;
  const SCENE_CLASSES = [
    "scene-grab",
    "scene-dodge",
    "scene-box-close",
    "scene-fight",
    "scene-cheese",
    "scene-hide",
    "scene-disguise",
    "scene-carrier",
    "scene-legs",
    "scene-fakes",
    "scene-escape",
    "scene-return",
  ];

  const elements = {
    stage: document.querySelector("#game-stage"),
    slice: document.querySelector("#pizza-slice"),
    attemptCount: document.querySelector("#attempt-count"),
    progressTrack: document.querySelector("#progress-track"),
    progressFill: document.querySelector("#progress-fill"),
    status: document.querySelector("#game-status"),
    roundStamp: document.querySelector("#round-stamp"),
    soundToggle: document.querySelector("#sound-toggle"),
    soundLabel: document.querySelector("#sound-label"),
    resetButton: document.querySelector("#reset-button"),
    celebration: document.querySelector("#celebration"),
    celebrationReset: document.querySelector("#celebration-reset"),
    confetti: document.querySelector("#confetti"),
    fakeSlices: document.querySelector("#fake-slices"),
    fakeSliceTemplate: document.querySelector("#fake-slice-template"),
    backgroundRegions: document.querySelectorAll(".topbar, .game-shell, body > footer"),
  };

  const gags = [
    {
      id: "grab",
      message: "A mystery hand called dibs first!",
      duration: 1250,
      sound: "snatch",
    },
    {
      id: "dodge",
      message: "The slice has suspiciously good footwork.",
      duration: 1150,
      sound: "whoosh",
    },
    {
      id: "box-close",
      message: "Nope. The box has made an executive decision.",
      duration: 1250,
      sound: "slam",
    },
    {
      id: "fight",
      message: "Two hands enter. One slice leaves. Maybe.",
      duration: 1400,
      sound: "fight",
    },
    {
      id: "cheese",
      message: "The mozzarella refuses to let go!",
      duration: 1450,
      sound: "stretch",
    },
    {
      id: "hide",
      message: "It slipped under the box. Very mature.",
      duration: 1250,
      sound: "hide",
    },
    {
      id: "disguise",
      message: "What slice? That's clearly a responsible salad.",
      duration: 1350,
      sound: "disguise",
    },
    {
      id: "carrier",
      message: "A tiny employee is relocating your dinner.",
      duration: 1550,
      sound: "steps",
    },
    {
      id: "legs",
      message: "It grew legs. This feels medically significant.",
      duration: 1400,
      sound: "run",
    },
    {
      id: "fakes",
      message: "Decoy slices! Trust no triangle.",
      duration: 1450,
      sound: "pop",
    },
  ];

  const state = {
    attempts: 0,
    busy: false,
    earned: false,
    fugitive: false,
    soundEnabled: true,
    lastGag: null,
    sequence: 0,
    timers: [],
    pointer: null,
    suppressNextClick: false,
    audioContext: null,
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function schedule(callback, delay) {
    const adjustedDelay = reducedMotion.matches ? Math.min(delay, 180) : delay;
    const timer = window.setTimeout(callback, adjustedDelay);
    state.timers.push(timer);
    return timer;
  }

  function clearTimers() {
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers = [];
  }

  function setStatus(message) {
    elements.status.textContent = message;
    elements.status.classList.remove("status-pop");
    void elements.status.offsetWidth;
    elements.status.classList.add("status-pop");
  }

  function updateScore() {
    const progress = Math.min(state.attempts / ATTEMPTS_TO_WIN, 1) * 100;
    elements.attemptCount.textContent = String(state.attempts);
    elements.attemptCount.classList.remove("count-pop");
    void elements.attemptCount.offsetWidth;
    elements.attemptCount.classList.add("count-pop");
    elements.progressFill.style.width = `${progress}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(state.attempts));
    elements.progressTrack.setAttribute(
      "aria-valuetext",
      `${state.attempts} of ${ATTEMPTS_TO_WIN} attempts`,
    );

    if (state.attempts >= ATTEMPTS_TO_WIN) {
      elements.roundStamp.textContent = "Earned!";
    } else if (state.attempts >= ATTEMPTS_TO_ESCAPE) {
      elements.roundStamp.textContent = "On the run";
    } else {
      elements.roundStamp.textContent = `Round ${state.attempts + 1}`;
    }
  }

  function clearScenes() {
    elements.stage.classList.remove(...SCENE_CLASSES);
    elements.fakeSlices.replaceChildren();
    elements.slice.style.removeProperty("--drag-x");
    elements.slice.style.removeProperty("--drag-y");
    elements.slice.classList.remove("is-dragging");
  }

  function finishScene(sequenceAtStart) {
    if (sequenceAtStart !== state.sequence || state.earned) {
      return;
    }

    clearScenes();
    state.busy = false;
    elements.slice.disabled = false;
    elements.slice.setAttribute("aria-label", "Try to take the last slice of pizza again");

    if (state.fugitive) {
      setStatus(`Still loose. ${ATTEMPTS_TO_WIN - state.attempts} tries until it gives in.`);
    } else {
      setStatus(`${ATTEMPTS_TO_ESCAPE - state.attempts} tries until the slice gets desperate.`);
    }
  }

  function chooseGag() {
    const choices = gags.filter((gag) => gag.id !== state.lastGag);
    const gag = choices[Math.floor(Math.random() * choices.length)];
    state.lastGag = gag.id;
    return gag;
  }

  function createFakeSlices() {
    const positions = [
      [18, 34, -18],
      [31, 71, 13],
      [66, 29, 9],
      [78, 69, -12],
      [49, 20, 18],
    ];

    positions.forEach(([left, top, rotation]) => {
      const fragment = elements.fakeSliceTemplate.content.cloneNode(true);
      const fakeSlice = fragment.querySelector(".fake-slice");
      fakeSlice.style.left = `${left}%`;
      fakeSlice.style.top = `${top}%`;
      fakeSlice.style.rotate = `${rotation}deg`;
      elements.fakeSlices.append(fragment);
    });
  }

  function playRandomGag() {
    const gag = chooseGag();
    const sequenceAtStart = state.sequence;
    elements.stage.classList.add(`scene-${gag.id}`);

    if (gag.id === "fakes") {
      createFakeSlices();
    }

    setStatus(gag.message);
    playSound(gag.sound);
    schedule(() => finishScene(sequenceAtStart), gag.duration);
  }

  function triggerEscape() {
    const sequenceAtStart = state.sequence;
    elements.stage.classList.add("scene-escape");
    setStatus("Ten attempts! The slice panics and makes a break for it!");
    playSound("escape");

    schedule(() => {
      if (sequenceAtStart !== state.sequence) {
        return;
      }

      clearScenes();
      state.fugitive = true;
      elements.stage.classList.add("fugitive");
      state.busy = false;
      elements.slice.disabled = false;
      elements.slice.setAttribute("aria-label", "Catch the fugitive last slice of pizza");
      setStatus("It escaped the box, not the table. Five more tries.");
    }, 1650);
  }

  function triggerWin() {
    const sequenceAtStart = state.sequence;
    state.earned = true;
    state.fugitive = false;
    elements.stage.classList.remove("fugitive");
    elements.stage.classList.add("scene-return");
    elements.slice.setAttribute("aria-label", "The last slice is yours");
    setStatus("The slice returns. The table goes quiet…");
    playSound("return");

    schedule(() => {
      if (sequenceAtStart !== state.sequence) {
        return;
      }

      elements.stage.classList.remove("scene-return");
      showCelebration();
    }, 1100);
  }

  function attemptSlice() {
    if (state.busy || state.earned) {
      return;
    }

    state.attempts += 1;
    state.busy = true;
    state.sequence += 1;
    elements.slice.disabled = true;
    updateScore();

    if (state.attempts === ATTEMPTS_TO_WIN) {
      triggerWin();
      return;
    }

    if (state.attempts === ATTEMPTS_TO_ESCAPE) {
      triggerEscape();
      return;
    }

    playRandomGag();
  }

  function buildConfetti() {
    const colors = ["#f6c84c", "#d94b34", "#4c9a68", "#fff3d5", "#65a7d8"];
    const pieces = document.createDocumentFragment();

    for (let index = 0; index < 42; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.setProperty("--left", `${Math.random() * 100}%`);
      piece.style.setProperty("--x", `${Math.round(Math.random() * 24 - 12)}vw`);
      piece.style.setProperty("--r", `${Math.round(Math.random() * 720 + 180)}deg`);
      piece.style.setProperty("--color", colors[index % colors.length]);
      piece.style.setProperty("--duration", `${Math.random() * 2.4 + 2.4}s`);
      piece.style.setProperty("--delay", `${Math.random() * -3}s`);
      pieces.append(piece);
    }

    elements.confetti.replaceChildren(pieces);
  }

  function showCelebration() {
    buildConfetti();
    elements.backgroundRegions.forEach((region) => region.setAttribute("inert", ""));
    elements.celebration.hidden = false;
    setStatus("You earned the last slice.");
    playSound("win");
    elements.celebrationReset.focus({ preventScroll: true });
  }

  function resetGame({ announce = true } = {}) {
    state.sequence += 1;
    clearTimers();
    clearScenes();
    state.attempts = 0;
    state.busy = false;
    state.earned = false;
    state.fugitive = false;
    state.lastGag = null;
    state.pointer = null;
    state.suppressNextClick = false;
    elements.stage.classList.remove("fugitive");
    elements.slice.disabled = false;
    elements.slice.setAttribute("aria-label", "Take the last slice of pizza");
    elements.celebration.hidden = true;
    elements.backgroundRegions.forEach((region) => region.removeAttribute("inert"));
    elements.confetti.replaceChildren();
    updateScore();
    setStatus(announce ? "Fresh box. Same suspicious slice. Try again." : "Go on. Take it. What could happen?");
    elements.slice.focus({ preventScroll: true });
    playSound("reset");
  }

  function getAudioContext() {
    if (state.audioContext) {
      return state.audioContext;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return null;
    }

    state.audioContext = new AudioContext();
    return state.audioContext;
  }

  function tone(context, frequency, start, duration, type = "sine", volume = 0.045) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function playSound(name) {
    if (!state.soundEnabled) {
      return;
    }

    const context = getAudioContext();
    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const now = context.currentTime + 0.01;
    const patterns = {
      snatch: [[420, 0, 0.08, "square"], [190, 0.08, 0.12, "sawtooth"]],
      whoosh: [[620, 0, 0.08, "sine"], [310, 0.06, 0.13, "sine"]],
      slam: [[95, 0, 0.18, "square", 0.065]],
      fight: [[170, 0, 0.07, "square"], [230, 0.1, 0.07, "square"], [150, 0.2, 0.09, "square"]],
      stretch: [[310, 0, 0.22, "sine"], [270, 0.18, 0.2, "triangle"]],
      hide: [[260, 0, 0.08, "triangle"], [160, 0.09, 0.11, "triangle"]],
      disguise: [[440, 0, 0.09, "triangle"], [554, 0.09, 0.09, "triangle"], [659, 0.18, 0.13, "triangle"]],
      steps: [[210, 0, 0.05, "square"], [250, 0.09, 0.05, "square"], [210, 0.18, 0.05, "square"], [250, 0.27, 0.05, "square"]],
      run: [[180, 0, 0.05, "square"], [220, 0.07, 0.05, "square"], [265, 0.14, 0.05, "square"], [320, 0.21, 0.08, "square"]],
      pop: [[420, 0, 0.06, "sine"], [520, 0.08, 0.06, "sine"], [620, 0.16, 0.08, "sine"]],
      escape: [[220, 0, 0.07, "square"], [277, 0.08, 0.07, "square"], [330, 0.16, 0.07, "square"], [440, 0.24, 0.18, "triangle"]],
      return: [[392, 0, 0.11, "triangle"], [523, 0.1, 0.11, "triangle"], [659, 0.2, 0.18, "triangle"]],
      win: [[523, 0, 0.22, "triangle"], [659, 0.08, 0.25, "triangle"], [784, 0.16, 0.34, "triangle"], [1047, 0.28, 0.42, "sine", 0.032]],
      reset: [[330, 0, 0.07, "sine"], [440, 0.08, 0.1, "sine"]],
      toggle: [[520, 0, 0.08, "sine"]],
    };

    (patterns[name] || patterns.toggle).forEach(([frequency, offset, duration, type, volume]) => {
      tone(context, frequency, now + offset, duration, type, volume);
    });
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    elements.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
    elements.soundToggle.setAttribute("aria-label", state.soundEnabled ? "Mute game sounds" : "Turn on game sounds");
    elements.soundLabel.textContent = state.soundEnabled ? "Sound on" : "Sound off";

    if (state.soundEnabled) {
      playSound("toggle");
    }
  }

  function resetDragPosition() {
    elements.slice.classList.remove("is-dragging");
    elements.slice.style.setProperty("--drag-x", "0px");
    elements.slice.style.setProperty("--drag-y", "0px");
  }

  function onPointerDown(event) {
    if (state.busy || state.earned || event.button !== 0) {
      return;
    }

    state.pointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragged: false,
    };
    elements.slice.setPointerCapture(event.pointerId);
    elements.slice.classList.add("is-dragging");
  }

  function onPointerMove(event) {
    if (!state.pointer || state.pointer.id !== event.pointerId || state.busy) {
      return;
    }

    const deltaX = event.clientX - state.pointer.startX;
    const deltaY = event.clientY - state.pointer.startY;
    const maxX = Math.min(elements.stage.clientWidth * 0.28, 180);
    const maxY = Math.min(elements.stage.clientHeight * 0.2, 120);
    const clampedX = Math.max(-maxX, Math.min(maxX, deltaX));
    const clampedY = Math.max(-maxY, Math.min(maxY, deltaY));

    if (Math.hypot(deltaX, deltaY) > 7) {
      state.pointer.dragged = true;
    }

    elements.slice.style.setProperty("--drag-x", `${clampedX}px`);
    elements.slice.style.setProperty("--drag-y", `${clampedY}px`);
  }

  function onPointerUp(event) {
    if (!state.pointer || state.pointer.id !== event.pointerId) {
      return;
    }

    const wasDragged = state.pointer.dragged;
    state.pointer = null;
    resetDragPosition();

    if (wasDragged) {
      event.preventDefault();
      state.suppressNextClick = true;
      attemptSlice();
      schedule(() => {
        state.suppressNextClick = false;
      }, 0);
    }
  }

  function onPointerCancel() {
    state.pointer = null;
    resetDragPosition();
  }

  elements.slice.addEventListener("click", () => {
    if (state.suppressNextClick) {
      state.suppressNextClick = false;
      return;
    }

    attemptSlice();
  });
  elements.slice.addEventListener("pointerdown", onPointerDown);
  elements.slice.addEventListener("pointermove", onPointerMove);
  elements.slice.addEventListener("pointerup", onPointerUp);
  elements.slice.addEventListener("pointercancel", onPointerCancel);
  elements.soundToggle.addEventListener("click", toggleSound);
  elements.resetButton.addEventListener("click", () => resetGame());
  elements.celebrationReset.addEventListener("click", () => resetGame());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.celebration.hidden) {
      resetGame();
    }
  });

  updateScore();
})();
