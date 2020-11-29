function showNav() {
  if (document.getElementById('hand-burger') == null || document.getElementById('hand-burger') == undefined) {
    return;
  }

  elEvent = document.getElementById('hand-burger');
  elToChange = document.getElementById('nav');

  elEvent.addEventListener('click', (event) => {
    event.target.classList.toggle('fa-times')
    elToChange.classList.toggle('dn');
  });

}

showNav();

function slider() {
  if (document.getElementById('slide-container') == null || document.getElementById('slide-container') == undefined) {
    return;
  }

  let slideIndex = 1;

  let btns = document.querySelectorAll('.slide-btns');

  showSlide(slideIndex);

  let slideRunner = setInterval(() => showSlide(slideIndex += 1), 5000);

  btns[0].addEventListener('click', () => {
    showSlide(slideIndex -= 1)
    clearInterval(slideRunner);
    slideRunner = setInterval(() => showSlide(slideIndex += 1), 5000);
  })

  btns[1].addEventListener('click', () => {
    showSlide(slideIndex += 1)
    clearInterval(slideRunner);
    slideRunner = setInterval(() => showSlide(slideIndex += 1), 5000);
  })

  function showSlide(n) {

    let slides = document.querySelectorAll('.slide');

    slides.forEach((val, ind) => {
      val.classList.add('dn');
    });

    if (n > slides.length) {
      slideIndex = 1;
    } else if (n < 1) {
      slideIndex = slides.length;
    }

    // slides[slideIndex - 1].firstElementChild.classList.add('slideInRight');
    slides[slideIndex - 1].classList.remove('dn');
  }
}

slider();