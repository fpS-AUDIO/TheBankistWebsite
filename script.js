'use strict';

///////////////////////////////////////
// Modal window

//////////////////
//// Elements ////
//////////////////

const header = document.querySelector(`.header`);
const logoIMG = document.querySelector(`.nav__logo`);

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);

const section1 = document.getElementById(`section--1`);

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

///////////////////////////////////////////////////////////
console.log(`--------------THEORY LECT------------------`);
///////////////////////////////////////////////////////////

/////////////////////////////////
// Building a tabbed component //
/////////////////////////////////
