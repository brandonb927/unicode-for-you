window.onload = () => {
  let keywordTitle = document.querySelector('.js-keyword-title')
  let originalTitle = keywordTitle.innerText

  let charList = document.querySelector('.js-char-list')

  let charBlocks = document.querySelectorAll('.js-unicode-char')
  let codeCharacterMap = {}

  // Create a new Clipboard.js object
  let clipboardBtns = document.querySelectorAll('.js-clipboard')
  let clipboard = new Clipboard(clipboardBtns) // eslint-disable-line

  // Stop browser from bubbling the blank hash to the document
  for (let btn of clipboardBtns) {
    btn.addEventListener('click', (event) => {
      event.preventDefault()
    })
  }

  // Build a map of character codes to keywords so we can do a lookup quickly
  for (let char of charBlocks) {
    let code = char.getAttribute('data-code')
    let keywords = char.getAttribute('data-keywords')
    codeCharacterMap[code] = keywords.split(', ')
  }
  // console.log(Object.keys(codeCharacterMap).length)
  // console.log(codeCharacterMap)

  // Handle Clipboard success
  clipboard.on('success', (e) => {
    let character = e.text
    Notification.requestPermission() // eslint-disable-line
      .then((result) => {
        let msg = `${character} copied to your clipboard!`
        let notification = new Notification(msg) // eslint-disable-line
      })
  })
  // Handle Clipboard error
  .on('error', (e) => {
    console.error(e)
  })

  // Capture any keyboard input in the page
  document.addEventListener('keydown', (event) => {
    // Arbitrary number for now, but 32 chars should be plenty to search with
    if (keywordTitle.innerText.split('').length >= 32) { return }

    // Escape key, clear the search
    if (event.keyCode === 27) {
      keywordTitle.innerText = originalTitle
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
  })

  // Do this separately from above work so as not to block thread too much
  // document.addEventListener('keyup', (event) => {
  //   if (event.keyCode === 8) { return }
  //
  //   // TODO: get this working to show chars that match what is being typed
  //   let text = keywordTitle.innerText
  //   for (let code in codeCharacterMap) {
  //     let keywords = codeCharacterMap[code]
  //     keywords.filter((keyword) => {
  //       return keyword.startsWith(text)
  //     })
  //   }
  // })

  // There's 1700+ DOM elements that need to be displayed (for now)
  // After a period of time, show them
  setTimeout(() => {
    charList.classList.remove('dn')
    charList.classList.add('db')
  }, 3000)
}
