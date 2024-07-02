const colors = [
    "#6a0dad", "#6e0dd4", "#8c0de0", "#8c0dd4", "#9400d3", 
    "#c71585", "#ee82ee", "#dda0dd", "#87ceeb"
];
const body = document.body;
const interval = 5000;

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
function changeBackground() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    const color3 = getRandomColor();
    const color4 = getRandomColor();
    body.style.background = `linear-gradient(270deg, ${color1}, ${color2}, ${color3}, ${color4})`;
    body.style.backgroundSize = "400% 400%";
    body.style.animation = "gradientAnimation 30s ease infinite";
}

setInterval(changeBackground, interval);
changeBackground();
// ========================menu firxed===========================
let menu_bar = document.querySelector('.menu_bar')
window.addEventListener('scroll', function () {
  let scrolling = this.scrollY
  if (scrolling > 100) {
    menu_bar.classList.add('menu_fixed')
  } else {
    menu_bar.classList.remove('menu_fixed')
  }
});
// ==============================smooth scrolling
$(document).ready(function(){
  $('.smooth-scroll').smoothScroll();
});
// ============================ifram
document.querySelector('iframe').addEventListener('click', function() {
  if (this.style.width === '100%') {
      this.style.width = '200%';
      this.style.height = '200%';
  } else {
      this.style.width = '100%';
      this.style.height = '100%';
  }
});



