// slider section
sliderClassNames= {
    activeSlide: 'img-slider__slide--active',
    btn: 'img-slider__button',
    slides: 'js-slide',
    nextBtn: 'js-next',
    prevBtn: 'js-prev',
    hiddenBtn: 'img-slider__button--hidden',
    dots: 'js-dot',
    activeSlideDot: 'slider-dots__dot--active'
};


let currentSlide = 0;
let infinite = true;
let slidesArr = document.getElementsByClassName(sliderClassNames.slides);
let nextBtn = document.getElementsByClassName('img-slider__button--right')[0];
let prevBtn = document.getElementsByClassName('img-slider__button--left')[0];
let dotsArr = document.getElementsByClassName(sliderClassNames.dots);

hideArrows(currentSlide);

function hideArrows(currentSlide) {
    if (currentSlide === slidesArr.length - 1) {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'block';
    }
    else if (currentSlide === 0) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    }
    else if(currentSlide > 0 && currentSlide < slidesArr.length-1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

function currentDot(n) {
    [...slidesArr].forEach((slide) => {
        [...dotsArr].forEach((dot) => {
            dot.classList.remove(sliderClassNames.activeSlideDot);
            slide.classList.remove(sliderClassNames.activeSlide);
        })
    })
    slidesArr[n].classList.add(sliderClassNames.activeSlide);
    dotsArr[n].classList.add(sliderClassNames.activeSlideDot);
}

function incrementSlider(infinite) {
    // current slide, removing class activeSlide to move on to the next slide
    slidesArr[currentSlide].classList.remove(sliderClassNames.activeSlide);
    dotsArr[currentSlide].classList.remove(sliderClassNames.activeSlideDot);

    // if it is the last slide
    if (currentSlide == slidesArr.length - 1) {
        // infinite carousel
        if (infinite) {
            currentSlide = 0;
        } 
    } else {
        currentSlide++;
        hideArrows(currentSlide);
    }
    
    // adding active class
    slidesArr[currentSlide].classList.add(sliderClassNames.activeSlide); 
    dotsArr[currentSlide].classList.add(sliderClassNames.activeSlideDot);   
}

function decrementSlider(infinite) {
    // current slide, removing class activeSlide to move on to the next slide
    slidesArr[currentSlide].classList.remove(sliderClassNames.activeSlide);
    dotsArr[currentSlide].classList.remove(sliderClassNames.activeSlideDot);
    // if it is the first slide
    if (currentSlide === 0) {
        if (infinite) {
            currentSlide = slidesArr.length - 1;
        } 
    } else {
        currentSlide--;
        hideArrows(currentSlide);
    }

    // adding active class
    dotsArr[currentSlide].classList.add(sliderClassNames.activeSlideDot);
    slidesArr[currentSlide].classList.add(sliderClassNames.activeSlide);
}

[...dotsArr].forEach(element => {
    element.addEventListener('click', handleDotClick);
});

function handleDotClick () {
    this.className = this.className.replace("slider-dots__dot--active", "");   
}

// accordion section
const accordion = {
    button: 'js-accordion-button',
    content: 'js-accordion-content',
    activeBtn: 'accordion__button--active'
};

let accordionButtons = document.getElementsByClassName(accordion.button);

[...accordionButtons].forEach(element => {
    element.addEventListener('click', handleAccordionClick);
});

/* without animation when clicked
function handleAccordionClick ()  {
    this.classList.toggle(accordion.activeBtn);
//  nextElementSibling vraca element koji je odmah nakon izabranog
    let content = this.nextElementSibling;
//  menjamo display u zavisnosti od trenutnog 
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
}
*/

// with animation
function handleAccordionClick () {
    this.classList.toggle(accordion.activeBtn);
    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}


// burger section
navigation = {
    header: 'header__nav',
    headerActive: 'header__nav--active'
};

const nav = document.querySelector('.header__nav');
const burger = document.querySelector('.burger');
function navSlide() {

    if(nav!=null) {
        nav.classList.toggle(navigation.headerActive);
    }
}

function toggleBurger() {

    if(burger!=null) {
        burger.classList.toggle('toggle');
    }
}

if(burger!=null) {
    burger.addEventListener('click', navSlide);
    burger.addEventListener('click', toggleBurger);
}

