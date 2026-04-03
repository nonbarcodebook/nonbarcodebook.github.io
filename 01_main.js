const barcodeCards = document.querySelectorAll(".barcode-card");
const cursorDot = document.getElementById("cursor-dot");

barcodeCards.forEach((card) => {
  let resetTimer = null;

  card.addEventListener("mouseenter", () => {
    if (card.classList.contains("is-revealed")) return;

    card.classList.add("is-revealed");

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      card.classList.remove("is-revealed");
    }, 5000);
  });
});

/* 커서 점 따라다니기 */
let mouseX = -100;
let mouseY = -100;
let dotX = -100;
let dotY = -100;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX + 14;  // 오른쪽
  mouseY = e.clientY + 14;  // 대각선 아래
});

function animateCursorDot() {
  dotX += (mouseX - dotX) * 0.18;
  dotY += (mouseY - dotY) * 0.18;

  cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

  requestAnimationFrame(animateCursorDot);
}

animateCursorDot();