'use strict'

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const nav = document.querySelector('.nav')

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal)

btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

// Smooth scroll

btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect()

  section1.scrollIntoView({
    behavior: 'smooth',
  })
})

////////////////////////////////////
// Page navigation

document.querySelector('.nav__links').addEventListener('click', e => {
  const id = e.target.getAttribute('href')
  if (e.target.classList.contains('nav__link')) {
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    })
  }
  e.preventDefault()
})

////////////////////////////////////
// Tabbed component
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab')

  // Active tab
  if (!clicked) return
  const data = clicked.dataset.tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')

  // Active content area
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  )
  document
    .querySelector(`.operations__content--${data}`)
    .classList.add('operations__content--active')
})

////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5))
nav.addEventListener('mouseout', handleHover.bind(1))

////////////////////////////////////
// Sticky navigation: Intersection Observer API
const stickyNav = function (entries, observer) {
  const [entry] = entries
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky')
}

const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
})
headerObserver.observe(header)

////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section')
const revealSection = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return

  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

allSections.forEach(section => {
  sectionObserver.observe(section)
  // section.classList.add('section--hidden')
})

////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]')
const loadImg = function (entries, observer) {
  const [entry] = entries

  if (!entry.isIntersecting) return

  const img = entry.target
  img.src = img.dataset.src
  img.addEventListener('load', e => {
    img.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.5,
  rootMargin: '200px',
})

imgTargets.forEach(img => imgObserver.observe(img))

////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide')
  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRight = document.querySelector('.slider__btn--right')
  const dotContainer = document.querySelector('.dots')

  let curSlide = 0
  const maxSlide = slides.length

  // Functions
  const createDots = () => {
    slides.forEach((_, i) => {
      const button = document.createElement('button')
      button.setAttribute('class', 'dots__dot')
      button.setAttribute('data-slide', `${i}`)

      dotContainer.insertAdjacentElement('beforeend', button)
    })
  }
  const activateDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot')
    dots.forEach((d, i) => {
      d.classList.remove('dots__dot--active')
    })

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active')
  }
  const dotOnClick = function (e) {
    if (!e.target.classList.contains('dots__dot')) return
    const { slide } = e.target.dataset

    goToSlide(slide)
    activateDot(slide)
  }
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    })
  }
  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++
    goToSlide(curSlide)
    activateDot(curSlide)
  }
  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--
    goToSlide(curSlide)
    activateDot(curSlide)
  }

  const init = function () {
    goToSlide(0)
    createDots()
    activateDot(0)
  }
  init()
  // Event handlers
  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide)
  dotContainer.addEventListener('click', dotOnClick)

  document.addEventListener('keydown', e => {
    e.key === 'ArrowLeft' && prevSlide()
    e.key === 'ArrowRight' && nextSlide()
  })
}
slider()
////////////////////////////////////
