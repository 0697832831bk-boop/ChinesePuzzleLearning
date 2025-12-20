let bgMusic = new Audio("./audio/study.mp3"); // you will add this later
bgMusic.loop = true;

const btn = document.getElementById("music-toggle");
let active = false;

btn.addEventListener("click", () => {
  active = !active;

  if (active) {
    bgMusic.play();
    btn.style.background = "#ff3434";
  } else {
    bgMusic.pause();
    btn.style.background = "#D72323";
  }
});
