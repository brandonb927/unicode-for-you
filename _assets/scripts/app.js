let onLoad = (unicodeCharacters) => {
  const ARROW_LEFT = 37
  const ARROW_UP = 38
  const ARROW_RIGHT = 39
  const ARROW_DOWN = 40
  const ARROW_KEYS = [ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN]

  // Helper functions
  const promiseTimeout = (func, ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(func())
      }, ms)
    })
  }

  // Detect if an element is in the viewport
  // https://gist.github.com/jjmu15/8646226
  const isInViewport = (element) => {
    let rect = element.getBoundingClientRect()
    let html = document.documentElement
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    )
  }

  const getSelectedChar = () => {
    return document.querySelector('.js-selected-char')
  }

  const htmlToElement = (htmlString) => {
    let template = document.createElement('template')
    template.innerHTML = htmlString.trim()
    return template.content.firstChild
  }

  // Core app functions
  const resetCharBlocks = () => {
    Array.from(charBlocks).forEach((elem) => {
      elem.classList.remove('dn')
      elem.classList.add('flex')
    })
  }

  const filterUnicodeCharacters = () => {
    let text = keywordTitle.textContent.split(' ')
    let charsShown = charBlocks.length

    Array.from(charBlocks).forEach((elem) => {
      let keywords = elem.getAttribute('data-keywords')
      let name = elem.getAttribute('data-name')
      let match = false

      for (let textItem of text) {
        match = ~name.indexOf(textItem) || ~keywords.indexOf(textItem)
        if (match) {
          break
        }
      }

      if (match) {
        elem.classList.remove('dn')
        elem.classList.add('flex')
        charsShown += 1
      } else {
        elem.classList.remove('flex')
        elem.classList.add('dn')
        charsShown -= 1
      }
    })

    if (charsShown === 0) {
      noFilterMatch.classList.remove('dn')
    } else {
      noFilterMatch.classList.add('dn')
    }
  }

  // TODO: Not sure if this is appropriate use of const here...
  const handleArrowKeys = (event) => {
    let firstChar = charList.firstChild
    let selectedChar = getSelectedChar()
    let nextCharElem = null

    if (ARROW_KEYS.includes(event.keyCode)) {
      event.preventDefault()

      if (selectedChar === null) {
        selectedChar = firstChar
      }

      let selectedCharIndex = Array.from(charList.childNodes).indexOf(selectedChar)

      // Calculate how many items wide the grid is
      // so we can use it to calculate keyboard navigation
      let gridColumns = 0
      let gridHeight = 0
      let prevCoords = null
      let scrollingDown = true

      Array.from(charList.childNodes).forEach((currElem) => {
        if (gridHeight >= 1) { return }

        let currElemCoords = currElem.getBoundingClientRect()

        if (prevCoords === null) {
          prevCoords = currElemCoords
        }

        if (currElemCoords.left !== prevCoords.left && currElemCoords.top !== prevCoords.top) {
          return
        }

        if (currElemCoords.left !== prevCoords.left) {
          gridColumns++
        }

        if (currElemCoords.top !== prevCoords.top) {
          gridHeight++
        }

        prevCoords = currElemCoords
      })

      switch (event.keyCode) {
        case ARROW_UP:
          nextCharElem = charList.childNodes[selectedCharIndex - gridColumns - 1]
          scrollingDown = false
          break
        case ARROW_DOWN:
          nextCharElem = charList.childNodes[selectedCharIndex + gridColumns + 1]
          scrollingDown = true
          break
        case ARROW_LEFT:
          nextCharElem = charList.childNodes[selectedCharIndex - 1]
          break
        case ARROW_RIGHT:
          nextCharElem = charList.childNodes[selectedCharIndex + 1]
          break
        default:
          break
      }

      if (nextCharElem === undefined) {
        return
      }

      if (selectedChar === firstChar && !firstChar.classList.contains('c1-hover')) {
        firstChar.classList.add('c1-hover')
      } else {
        firstChar.classList.remove('c1-hover')

        selectedChar.classList.remove('c1-hover')
        selectedChar.classList.remove('js-selected-char')

        nextCharElem.classList.add('c1-hover')
        nextCharElem.classList.add('js-selected-char')

        if (!isInViewport(nextCharElem)) {
          let scrollHeight = (window.innerHeight / 2)

          if (!scrollingDown) {
            scrollHeight = -scrollHeight
          }

          console.log(scrollHeight)
          window.scrollBy(0, scrollHeight)
        }
      }
    }
  }

  const keyupHandler = (event) => {
    if (keywordTitle.textContent === originalTitle) {
      return resetCharBlocks()
    }

    filterUnicodeCharacters()
  }

  const keydownHandler = (event) => {
    // Arbitrary number for now, but 32 chars should be plenty to search with
    if (keywordTitle.textContent.split('').length >= 32) { return }

    // Escape key, clear the search
    if (event.keyCode === 27) {
      keywordTitle.textContent = originalTitle

      let selectedChar = getSelectedChar()
      selectedChar.classList.remove('c1-hover')
      selectedChar.classList.remove('js-selected-char')
      window.scrollTo(0, 0)

      return resetCharBlocks()
    }

    // Backspace key, clear the search
    if (event.keyCode === 8) {
      if (keywordTitle.textContent === originalTitle) { return }

      let title = keywordTitle.textContent.split('')
      title.pop()
      let newTitle = title.join('')
      keywordTitle.textContent = newTitle

      if (keywordTitle.textContent === '') {
        keywordTitle.textContent = originalTitle
      }
    }

    // Is key is between a and z?
    if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode === 32) {
      if (keywordTitle.textContent === originalTitle) {
        keywordTitle.textContent = ''
      }

      // Space needs to override the default handler
      if (event.keyCode === 32) {
        event.preventDefault()
        keywordTitle.textContent += ' '
      } else {
        keywordTitle.textContent += event.key
      }
    }

    handleArrowKeys(event)
  }

  const charCopyHandler = (e) => {
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

    if (keywordTitle.textContent === originalTitle) { return }

    window.location.hash = `#${encodeURIComponent(keywordTitle.textContent)}`
  }

  const htmlTemplate = (char) => {
    let {name, emoji, code, keywords} = char
    name = name.toLowerCase()

    let keywordsHTML = ''
    if (keywords.length > 0) {
      keywordsHTML = `
      <p class="mv1">
        <strong>keywords</strong>
        <br />
        ${keywords.join(', ')}
      </p>
      `
    }

    return htmlToElement(`
    <li class="flex flex-column
               c1 w5 ma3 pa3
               ba b--light-gray tl
               js-unicode-char"
        data-code="${code}"
        data-name="${name}"
        data-keywords="${keywords}">
      <div class="relative">
        <a href="#"
           class="link js-clipboard"
           data-clipboard-text="${emoji}">
          <h2 class="mv1 f-5 pa3 lh-solid tc">
            ${emoji}
          </h2>
        </a>
        <p class="mv1">
          <strong>Name</strong>
          <br />
          ${name}
        </p>
        <p class="mv1">
          <strong>Code</strong>
          <br />
          ${code}
        </p>
        ${keywordsHTML}
        <div class="flex items-center justify-center
                    absolute top-0 right-0 bottom-0 left-0 h-100 w-100
                    tc bg-white-90 dn o-0
                    notification-overlay
                    js-notification-overlay">
          <h3 class="f3">
            COPIED!
          </h3>
        </div>
      </div>
    </li>
    `)
  }

  let charList = document.querySelector('.js-char-list')
  for (let char of unicodeCharacters) {
    let template = htmlTemplate(char)
    charList.appendChild(template)
  }

  let noFilterMatch = document.querySelector('.js-no-filter-match')
  let loadingContainer = document.querySelector('.js-loading-container')

  let keywordTitle = document.querySelector('.js-keyword-title')
  let keywordTitleCopy = document.querySelector('.js-keyword-title-copy')
  let originalTitle = keywordTitle.textContent

  let charListContainer = document.querySelector('.js-char-list-container')
  let charBlocks = document.querySelectorAll('.js-unicode-char')

  // Create a new Clipboard.js object
  let clipboardBtns = document.querySelectorAll('.js-clipboard')
  let clipboard = new Clipboard(clipboardBtns) // eslint-disable-line

  // Stop browser from bubbling the blank hash to the document
  for (let btn of clipboardBtns) {
    btn.addEventListener('click', (event) => {
      event.preventDefault()
    })
  }

  clipboard
    .on('success', charCopyHandler)
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

    charListContainer.classList.remove('dn')
    charListContainer.classList.add('db')

    keywordTitleCopy.classList.remove('dn')
    keywordTitleCopy.classList.add('db')

    if (window.location.hash) {
      let searchText = decodeURIComponent(window.location.hash.replace('#', ''))
      keywordTitle.textContent = searchText
      filterUnicodeCharacters()
    }
  }, 3000)
}

fetch('/unicode.json') // eslint-disable-line
  .then((response) => {
    return response.json()
  })
  .then(onLoad)
