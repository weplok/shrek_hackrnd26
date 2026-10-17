const quotes = [
  "Deep dark fantasies",
  "Oh shit, I'm sorry. — Sorry for what?",
  "Boy next door",
  "Do you like what you see?",
  "Welcome to the club, buddy",
  "Fucking slaves, get your ass back here!",
  "Take it, boy",
  "That turns me on",
  "Ass we can",
  "Thank you, sir!",
  "You got me mad now",
  "It's a dungeon, master",
];

const countEl = document.getElementById("count");
const quoteEl = document.getElementById("quote");

let count = 0;
try {
  count = Number(localStorage.getItem("spanks")) || 0;
} catch {}
countEl.textContent = count;

let audio;

// Synthesized slap: a short burst of filtered noise.
function slap() {
  audio ??= new AudioContext();
  const len = audio.sampleRate * 0.15;
  const buffer = audio.createBuffer(1, len, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  }
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  src.connect(filter).connect(audio.destination);
  src.start();
}

function pop(x, y) {
  const el = document.createElement("div");
  el.className = "pop";
  el.textContent = Math.random() < 0.5 ? "♂" : "💪";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.append(el);
  el.addEventListener("animationend", () => el.remove());
}

document.getElementById("spank").addEventListener("click", (e) => {
  slap();
  pop(e.clientX, e.clientY);
  count++;
  countEl.textContent = count;
  try {
    localStorage.setItem("spanks", count);
  } catch {}
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
});

let lastQuote = -1;
document.getElementById("next-quote").addEventListener("click", () => {
  let i;
  do {
    i = Math.floor(Math.random() * quotes.length);
  } while (i === lastQuote);
  lastQuote = i;
  quoteEl.textContent = quotes[i];
});
