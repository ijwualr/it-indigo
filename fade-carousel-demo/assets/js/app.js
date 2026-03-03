const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');

let index = 0;
let autoPlay;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('button');

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove('visible'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[i].classList.add('visible');
  dots[i].classList.add('active');
}

function goToSlide(i) {
  index = (i + slides.length) % slides.length;
  showSlide(index);
  resetAutoPlay();
}

function nextSlide() {
  goToSlide(index + 1);
}

function prevSlide() {
  goToSlide(index - 1);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

function startAutoPlay() {
  autoPlay = setInterval(nextSlide, 4000);
}

function resetAutoPlay() {
  clearInterval(autoPlay);
  startAutoPlay();
}

startAutoPlay();

let startX = 0;

document.querySelector('.carousel').addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

document.querySelector('.carousel').addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (diff > 50) nextSlide();
  if (diff < -50) prevSlide();
});
