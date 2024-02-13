'use strict';

///////////////////////////////////////
// Modal window

//////////////////
//// Elements ////
//////////////////

const header = document.querySelector(`.header`);
const logoIMG = document.querySelector(`.nav__logo`);
const navBar = document.querySelector(`.nav`);

const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsBtns = document.querySelectorAll(`.operations__tab`);
const tabsContents = document.querySelectorAll(`.operations__content`);

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);

const section1 = document.getElementById(`section--1`);
const allSections = document.querySelectorAll(`.section`);

const lazyImages = document.querySelectorAll(`img[data-src]`);

const slider = document.querySelector(`.slider`);
const slides = document.querySelectorAll(`.slide`);
const slideRightBtn = document.querySelector(`.slider__btn--right`);
const slideLeftBtn = document.querySelector(`.slider__btn--left`);

///////////////////////////////////////////////
//// page navigation with smooth scrolling ////
///////////////////////////////////////////////

// To implement the page navigation I used the event delegation
// so I use the fact that event is bubbled up and
// I need to attach event listener to the common parent (container) of all interested elements.

//  add event listener to common parent (container) of all interested elements.
document
  .querySelector(`.nav__links`)
  .addEventListener(`click`, function (event) {
    // prevent default behavior
    event.preventDefault();

    // determine what element originated the event
    const eventElement = event.target;

    // check if eventElement is actually interested element (.nav__link)
    if (eventElement.classList.contains(`nav__link`)) {
      // if it's interested element get the href attribute of the element and store it in "idHref"
      const idHref = eventElement.getAttribute(`href`);
      // then scroll to that id "idHref"
      document.querySelector(idHref).scrollIntoView({ behavior: `smooth` });
    }
  });

////////////////////////////////////////////////////
// implementing the opacity effect on <nav> links //
////////////////////////////////////////////////////

// NOTE:
//  `mouseover` and `mouseout` do bubbling
//  `mouseenter` and `mouseleave` don't do bubbling

// The best way to pass argument into an event handlers' callback function
// is to use bind method, set the `this` keyword and pass `this` as variable inside the callback body
// any event handler function can have only 1 real argument, which is the `event`
// if you want to pass more arguments set `this` in bind to an array or object

const changeOpacityNav = function (event) {
  // get the element provocated the event
  const provocatorEvent = event.target;

  // check if `provocatorEvent` is actual <a> so with class "nav__link"
  if (provocatorEvent.classList.contains(`nav__link`)) {
    // get all the siblings of `provocatorEvent`
    const siblingsProvocator = provocatorEvent
      .closest(`.nav`)
      .querySelectorAll(`.nav__link`);

    // get also logo image
    const imageNav = provocatorEvent.closest(`.nav`).querySelector(`img`);

    // change the opacity of all `siblingsProvocator` but not of the `provocatorEvent`
    siblingsProvocator.forEach(sibling => {
      if (sibling !== provocatorEvent) sibling.style.opacity = this;
    });

    // change also the opacity of logo image
    imageNav.style.opacity = this;
  }
};

navBar.addEventListener(`mouseover`, changeOpacityNav.bind(0.5));
navBar.addEventListener(`mouseout`, changeOpacityNav.bind(1));

/////////////////////////////////
// Building a tabbed component //
/////////////////////////////////

// using event delegation, so add event listener on container
tabsContainer.addEventListener(`click`, function (event) {
  // preventing default just to be sure (not really necessary)
  event.preventDefault();

  // get the element (during bubbling) which provocated event --> event.target
  // and find the actual button because there is the <span> inside --> .closest(`.operations__tab`);
  const clickedBtn = event.target.closest(`.operations__tab`);

  // if `clickedBtn` is null so there was a click on container and not button then just exit function
  if (!clickedBtn) return;

  // otherwise get the `data-tab` attribute to understand which content should be shown
  const numberContent = clickedBtn.dataset.tab;

  // remove active class from all tab buttons
  // and add active class only on clicked tab button
  tabsBtns.forEach(el => el.classList.remove(`operations__tab--active`));
  clickedBtn.classList.add(`operations__tab--active`);

  // remove active class from all <div>s with content to show
  // and add active class only to <div> with correct numberContent class
  tabsContents.forEach(el =>
    el.classList.remove(`operations__content--active`)
  );
  document
    .querySelector(`.operations__content--${numberContent}`)
    .classList.add(`operations__content--active`);
});

///////////////////
//// Functions ////
///////////////////

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

///////////////////////////
//// Creating Elements ////
///////////////////////////

// Cookies Div
const cookieMessageDiv = document.createElement(`div`);
cookieMessageDiv.classList.add(`cookie-message`);
cookieMessageDiv.innerHTML = `I know cookies are so annoying, but we're using them to improve functionality 🤷‍♀️ <button class="btn btn--close-cookie">Got it!</button>`;
header.append(cookieMessageDiv);
// selecting AFTER creating
const btnCloseCookie = document.querySelector(`.btn--close-cookie`);
// styling cookieMessageDiv
cookieMessageDiv.style.backgroundColor = `#37383d`;
cookieMessageDiv.style.width = `120%`;
cookieMessageDiv.style.height =
  Number.parseFloat(getComputedStyle(cookieMessageDiv).height) + 30 + `px`;

///////////////////////
//// EventListener ////
///////////////////////

// EventListener open Modal window
btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

// EventListener close Modal window
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// EventListener close Cookies Div
btnCloseCookie.addEventListener(`click`, function () {
  cookieMessageDiv.remove();
});

// implementing Smooth scrolling
btnScrollTo.addEventListener(`click`, function (event) {
  // get the coordinates of seciton1
  const seciton1Coordinates = section1.getBoundingClientRect();

  // to get the correct coordinates you need to sum:
  //  1. px from top of viewport
  //  2. current scroll position
  // like this:
  const sect1X = seciton1Coordinates.x + window.scrollX;
  const sect1Y = seciton1Coordinates.y + window.scrollY;

  // creating the object with options for scroll()
  const scrollOptions = {
    top: sect1Y,
    left: sect1X,
    behavior: `smooth`,
  };

  // scroll to the correct position
  window.scroll(scrollOptions);

  // MODERN WAY:
  // element.scrollIntoView({behavior: `smooth`});
  // section1.scrollIntoView({ behavior: `smooth` });
});

///////////////////////////////////////////////////////////////////////////////
// Implementing a .nav sticky navigation using the intersection Observer API //
///////////////////////////////////////////////////////////////////////////////

// making an oberver which obsevre the .header element
// and adds the .sticky class to the .nav when .header is not visible

// Remember (defined before):
// const header = document.querySelector(`.header`);
// const navBar = document.querySelector(`.nav`);

// Remember:
// .sticky {
//   position: fixed;
//   background-color: rgba(255, 255, 255, 0.95);
// }

// defining the callback for headerObserver
const addRemoveSticky = function (entries) {
  // same as "const entry = entries[0]" but using destructuring
  const [entry] = entries;
  // console.log(entry);
  // if header is not intersecting the viewport add .sticky class to the .nav
  // else remove the .sticky class from the .nav
  if (!entry.isIntersecting) navBar.classList.add(`sticky`);
  else navBar.classList.remove(`sticky`);
};

// calculate the height of navBar to the dinamically add margin to the options object
const navbarHeight = navBar.getBoundingClientRect().height;

// defining options object for headerObserver
const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navbarHeight}px`,
};

// defining the observer
const headerObserver = new IntersectionObserver(
  addRemoveSticky,
  headerObserverOptions
);

// start observing the .header
headerObserver.observe(header);

////////////////////////////////////////////////////////////////////
// Revealing sections on scrolling with intersection Observer API //
////////////////////////////////////////////////////////////////////

// Remember:
// const allSections = document.querySelectorAll(`.section`);

// Remember:
// .section--hidden {
//   opacity: 0;
//   transform: translateY(8rem);
// }

// function to reveal sections
const revealSection = function (entries, observer) {
  // select the only one entry of treshold
  const entry = entries[0];

  // if target in not intersecting just exit the function
  if (!entry.isIntersecting) return;
  // select the target and remove its hidden class
  entry.target.classList.remove(`section--hidden`);
  // also stop observing that target (very good for performance)
  observer.unobserve(entry.target);
};

// creating options for oberverSections
const revealSectionOptions = {
  root: null,
  threshold: 0.15,
};

// creating observer
const oberverSections = new IntersectionObserver(
  revealSection,
  revealSectionOptions
);

// looping over all sections to observe them and hide them
allSections.forEach(function (section) {
  oberverSections.observe(section);
  // and hide every section
  // section.classList.add(`section--hidden`);      // <<<--- UNCOMMENT THIS
});

////////////////////////////////////////////////////////
// Lazy loading images with intersection Observer API //
////////////////////////////////////////////////////////

// Remember:
/* <img
  src="img/digital-lazy.jpg"
  data-src="img/digital.jpg"
  alt="Computer"
  class="features__img lazy-img"
/>; */

// Remember:
// const lazyImages = document.querySelectorAll(`img[data-src]`);

// Remember:
// .lazy-img {
//   filter: blur(20px);
// }

/*  Explanation of how it works:

 1. First we are loading the images with really low resolution and size,
    this helps the performance for slow internet users and old phones
    for example: 
    - img/digital-lazy.jpg is 200x120px and 16.8KB
    - img/digital.jpg is 2000x1200px and 514KB

 2. Also we apply the .lazy-img class with blur effect on these lazy images,
    this helps to hide the bad low resolution of images

 3. Then, when the user scrolls down, we change the `src` attribute (with low size image)
    to the `data-src` attribute with the real size image.
    Note: we do it with `rootMargin` property inside the options object of the observer,
    this helps load the images before the user can see them, so he doesn't know they are loaded lazy.

 4. Only when the image is completly loaded we remove the .lazy-img class with blur effect.
    To achive this this we use the eventListener for `load`.
    Note: if we just remove this class right after changing the src attribute,
    the users with slow internet may have issues and see pixeled images,
    so first completly load image and then remove the blur effect.
 */

// creating function for complete load the lazy image
const loadLazyImage = function (entries, observer) {
  // get the actual entry object from array
  const [entry] = entries;

  // just exit the function is it's not intersecting
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // only when completly loaded remove the blur
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  // stop obersving the target for performance
  observer.unobserve(entry.target);
};

// creating options for the lazyImgObserver
const lazyImgObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
};

// create observer for lazy images
const lazyImgObserver = new IntersectionObserver(
  loadLazyImage,
  lazyImgObserverOptions
);

// looping over lazy images and start observing on each of them
lazyImages.forEach(function (lazyImage) {
  lazyImgObserver.observe(lazyImage);
});

//////////////////////
// Slider Component //
//////////////////////

// Remember:
// const slider = document.querySelector(`.slider`);
// const slides = document.querySelectorAll(`.slide`);
// const slideRightBtn = document.querySelector(`.slider__btn--right`);
// const slideLeftBtn = document.querySelector(`.slider__btn--left`);


// --- variables for slider ---
let currentSlide = 0;
const slidesNumber = slides.length;


// --- functions for slider ---
const goToSlide = function (slide) {
  slides.forEach((sld, indx) => {
    sld.style.transform = `translateX(${100 * (indx - slide)}%)`;
  });
};

const goToNextSlide = function () {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
};
const goToPreviousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
};

// initial view of slides
goToSlide(currentSlide);

// buttons event listeners
slideRightBtn.addEventListener(`click`, goToNextSlide);
slideLeftBtn.addEventListener(`click`, goToPreviousSlide);

