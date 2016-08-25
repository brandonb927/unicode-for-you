window.onload = () => {
  let loadingContainer = document.querySelector('.js-loading-container')

  let keywordTitle = document.querySelector('.js-keyword-title')
  let keywordTitleCopy = document.querySelector('.js-keyword-title-copy')
  let originalTitle = keywordTitle.innerText

  let charList = document.querySelector('.js-char-list')
  let charBlocks = document.querySelectorAll('.js-unicode-char')

  // Create a new Clipboard.js object
  let clipboardBtns = document.querySelectorAll('.js-clipboard')
  let clipboard = new Clipboard(clipboardBtns) // eslint-disable-line

  const resetCharBlocks = () => {
    Array.from(charBlocks).forEach((elem) => {
      elem.classList.remove('dn')
      elem.classList.add('flex')
    })
  }

  const filterUnicodeCharacters = () => {
    let text = keywordTitle.innerText

    Array.from(charBlocks).forEach((elem) => {
      let keywords = elem.getAttribute('data-keywords')
      let name = elem.getAttribute('data-name')
      let match = ~name.indexOf(text) || ~keywords.indexOf(text)

      if (match) {
        elem.classList.remove('dn')
        elem.classList.add('flex')
      } else {
        elem.classList.remove('flex')
        elem.classList.add('dn')
      }
    })
  }

  const keyupHandler = (event) => {
    if (keywordTitle.innerText === originalTitle) {
      return resetCharBlocks()
    }

    filterUnicodeCharacters()
  }

  const keydownHandler = (event) => {
    // Arbitrary number for now, but 32 chars should be plenty to search with
    if (keywordTitle.innerText.split('').length >= 32) { return }

    // Escape key, clear the search
    if (event.keyCode === 27) {
      keywordTitle.innerText = originalTitle
      return resetCharBlocks()
    }

    // Backspace key, clear the search
    if (event.keyCode === 8) {
      if (keywordTitle.innerText === originalTitle) { return }

      let title = keywordTitle.innerText.split('')
      title.pop()
      let newTitle = title.join('')
      keywordTitle.innerText = newTitle

      if (keywordTitle.innerText === '') {
        keywordTitle.innerText = originalTitle
      }
    }

    // Is key is between a and z?
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      if (keywordTitle.innerText === originalTitle) {
        keywordTitle.innerText = ''
      }

      keywordTitle.innerText += event.key
    }
  }

  const promiseTimeout = (func, ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(func())
      }, ms)
    })
  }

  // Stop browser from bubbling the blank hash to the document
  for (let btn of clipboardBtns) {
    btn.addEventListener('click', (event) => {
      event.preventDefault()
    })
  }

  clipboard.on('success', (e) => {
    // Handle Clipboard success
    let charParentNode = e.trigger.parentNode.parentNode
    let overlay = charParentNode.querySelector('.js-notification-overlay')

    // Log a GA event
    ga('send', { // eslint-disable-line
      eventCategory: `${e.text}`,
      eventAction: e.action
    })

    // Hacks lie ahead - timing-based animation stuff to curb removing
    // the block-level CSS in order for the opacity animation to work
    overlay.classList.toggle('dn')

    promiseTimeout(() => {
      overlay.classList.toggle('o-0')
      overlay.classList.toggle('o-100')
    }, 50)
    .then(() => {
      return promiseTimeout(() => {
        overlay.classList.toggle('o-0')
        overlay.classList.toggle('o-100')
      }, 2000)
    })
    .then(() => {
      return promiseTimeout(() => {
        overlay.classList.toggle('dn')
      }, 300)
    })
  })
  .on('error', (e) => {
    // Handle Clipboard error
    console.error(e)
  })

  // Capture any keyboard input in the page
  document.addEventListener('keydown', keydownHandler)

  // Do this separately from above work so as not to block thread
  document.addEventListener('keyup', keyupHandler)

  // There's 1700+ DOM elements that need to be displayed (for now)
  // After a period of time, show them
  setTimeout(() => {
    loadingContainer.classList.add('dn')

    charList.classList.remove('dn')
    charList.classList.add('db')

    keywordTitleCopy.classList.remove('dn')
    keywordTitleCopy.classList.add('db')
  }, 3000)
}
