let bgMusic = new Audio("./audio/study.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.35;

const btn = document.getElementById("music-toggle");
let active = false;

btn.addEventListener("click", () => {
  active = !active;

  if (active) {
    bgMusic.play();
    btn.classList.add("is-on");
    btn.textContent = "Music On";
  } else {
    bgMusic.pause();
    btn.classList.remove("is-on");
    btn.textContent = "Music";
  }
});
