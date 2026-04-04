const siteShell = document.getElementById("siteShell");
const overlayTriggers = document.querySelectorAll(".overlay-trigger");
const cursorDot = document.getElementById("cursorDot");
const centerVideo = document.getElementById("centerVideo");
const heroTextBlocks = document.querySelectorAll(".hero-text");

let isRevealed = false;
let goneCount = 0;
const totalTriggers = overlayTriggers.length;

/* 1) 배경 텍스트 글자 단위 분해 */
heroTextBlocks.forEach((block) => {
  const rawText = block.textContent || "";
  block.innerHTML = "";

  [...rawText].forEach((char) => {
    const span = document.createElement("span");

    if (char === " ") {
      span.innerHTML = "&nbsp;";
      span.classList.add("space");
    } else {
      span.textContent = char;
    }

    block.appendChild(span);
  });
});

const letters = document.querySelectorAll(".hero-text span:not(.space)");

/* 2) 커서 */
let mouseX = window.innerWidth * 0.5;
let mouseY = window.innerHeight * 0.5;
let dotX = -100;
let dotY = -100;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

/* 3) 글자 좌우 repel */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const REPEL_RADIUS = 78;
const REPEL_FORCE = 18;

function animateRepel() {
  if (!prefersReducedMotion && !isRevealed) {
    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - mouseX;
      const dy = centerY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < REPEL_RADIUS) {
        const power = (1 - distance / REPEL_RADIUS) * REPEL_FORCE;
        const dirX = dx >= 0 ? 1 : -1;
        const moveX = dirX * power;
        letter.style.transform = `translateX(${moveX}px)`;
      } else {
        letter.style.transform = "translateX(0px)";
      }
    });
  } else {
    letters.forEach((letter) => {
      letter.style.transform = "translateX(0px)";
    });
  }

  requestAnimationFrame(animateRepel);
}

animateRepel();

/* 4) 커서 점 */
function animateCursorDot() {
  dotX += (mouseX + 14 - dotX) * 0.16;
  dotY += (mouseY + 14 - dotY) * 0.16;

  if (cursorDot) {
    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
  }

  requestAnimationFrame(animateCursorDot);
}

animateCursorDot();

/* 5) reveal */
function revealVideoScene() {
  if (isRevealed) return;

  isRevealed = true;
  siteShell.classList.add("is-revealed");

  if (centerVideo) {
    const playPromise = centerVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }
}

/* 6) 개별 오버레이 제거 */
function removeTrigger(trigger) {
  if (!trigger || trigger.classList.contains("is-gone")) return;

  trigger.classList.add("is-gone");
  goneCount += 1;

  if (goneCount >= totalTriggers) {
    setTimeout(() => {
      revealVideoScene();
    }, 420);
  }
}

overlayTriggers.forEach((trigger) => {
  trigger.addEventListener("mouseenter", () => removeTrigger(trigger), { passive: true });
  trigger.addEventListener("click", () => removeTrigger(trigger), { passive: true });
  trigger.addEventListener("touchstart", () => removeTrigger(trigger), { passive: true });
});

window.addEventListener("keydown", (event) => {
  const active = document.activeElement;
  if (
    (event.key === "Enter" || event.key === " ") &&
    active &&
    active.classList.contains("overlay-trigger")
  ) {
    event.preventDefault();
    removeTrigger(active);
  }
});