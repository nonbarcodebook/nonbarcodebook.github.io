const words = [
  "You",
  "Designer",
  "Student",
  "Publisher",
  "Editor",
  "Book Lover",
  "Writer",
  "Someone"
];

const heroScroll = document.getElementById("heroScroll");
const leftWordStack = document.getElementById("leftWordStack");
const rightWordStack = document.getElementById("rightWordStack");
const fadeBlocks = document.querySelectorAll(".fade-block");

const wordElements = [];

words.forEach((word, index) => {
  const el = document.createElement("div");
  el.className = "word";
  el.textContent = word;

  if (index % 2 === 0) {
    leftWordStack.appendChild(el);
  } else {
    rightWordStack.appendChild(el);
  }

  wordElements.push({
    el,
    index
  });
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateWordAnimation() {
  const rect = heroScroll.getBoundingClientRect();
  const scrollable = heroScroll.offsetHeight - window.innerHeight;

  if (scrollable <= 0) return;

  const progress = clamp(-rect.top / scrollable, 0, 1);
  const segment = 1 / words.length;

  wordElements.forEach(({ el, index }) => {
    const start = segment * index;
    const local = (progress - start) / segment;

    if (local > 0 && local < 1) {
      let opacity = 0;
      let y = 0;

      if (local < 0.25) {
        const t = local / 0.25;
        opacity = t;
        y = 90 * (1 - t);
      } else if (local < 0.72) {
        opacity = 1;
        y = 0;
      } else {
        const t = (local - 0.72) / 0.28;
        opacity = 1 - t;
        y = -90 * t;
      }

      el.style.opacity = opacity;
      el.style.transform = `translateY(${y}px)`;
    } else {
      el.style.opacity = 0;
      el.style.transform = "translateY(90px)";
    }
  });
}

function updateFadeBlocks() {
  const trigger = window.innerHeight * 0.88;

  fadeBlocks.forEach((block) => {
    const rect = block.getBoundingClientRect();

    if (rect.top < trigger) {
      block.classList.add("is-visible");
    }
  });
}

function onScroll() {
  updateWordAnimation();
  updateFadeBlocks();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

window.addEventListener("load", () => {
  onScroll();
});