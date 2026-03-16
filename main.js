const words = [
  'You',
  'Designer',
  'Student',
  'Publisher',
  'Editor',
  'Book Lover',
  'Writer',
  'Someone'
];

const leftStack = document.getElementById('leftWordStack');
const rightStack = document.getElementById('rightWordStack');
const heroScroll = document.getElementById('heroScroll');
const progressBar = document.getElementById('progressBar');
const fadeBlocks = document.querySelectorAll('.fade-block');
const heroVideo = document.getElementById('heroVideo');
const videoFallback = document.getElementById('videoFallback');

function createWordNodes(target, list) {
  return list.map((word) => {
    const el = document.createElement('div');
    el.className = 'word';
    el.textContent = word;
    target.appendChild(el);
    return el;
  });
}

const leftNodes = createWordNodes(leftStack, words);
const rightNodes = createWordNodes(rightStack, words);

function updateWordSequence() {
  const rect = heroScroll.getBoundingClientRect();
  const scrollable = heroScroll.offsetHeight - window.innerHeight;
  const passed = Math.min(Math.max(-rect.top, 0), scrollable);
  const progress = scrollable > 0 ? passed / scrollable : 0;

  progressBar.style.width = `${Math.min(progress * 100, 100)}%`;

  const holdTail = 1.4;
  const wordProgress = progress * (words.length + holdTail);
  const step = Math.floor(wordProgress);
  const local = wordProgress - step;

  [...leftNodes, ...rightNodes].forEach((node) => node.classList.remove('active'));

  if (step < words.length && local < 0.82) {
    const isLeft = step % 2 === 0;
    const node = isLeft ? leftNodes[step] : rightNodes[step];
    if (node) node.classList.add('active');
  }
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, { threshold: 0.2 });

fadeBlocks.forEach((block) => io.observe(block));

window.addEventListener('scroll', updateWordSequence, { passive: true });
window.addEventListener('resize', updateWordSequence);
updateWordSequence();

heroVideo.addEventListener('error', () => {
  heroVideo.hidden = true;
  videoFallback.hidden = false;
  videoFallback.innerHTML = '<div style="display:grid;place-items:center;width:100%;height:100%;font-size:14px;color:#666;text-align:center;padding:24px;line-height:1.6;">영상 파일을 불러오지 못했습니다.<br>video source 경로를 원하는 파일로 교체해 주세요.</div>';
});
