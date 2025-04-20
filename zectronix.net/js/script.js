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



