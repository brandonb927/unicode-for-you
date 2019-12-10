import isElementInViewport from './is-element-in-viewport';
import promiseTimeout from './promise-timeout';
import htmlToElement from './html-to-element';
import range from './range';

const emojiVersion = '12.1.0';

(async function() {
  const response = await fetch(
    `https://unpkg.com/emoji.json@${emojiVersion}/emoji.json`
  );
  const unicodeCharacters = await response.json();

  // Arrow keys
  const ARROW_LEFT = 37;
  const ARROW_UP = 38;
  const ARROW_RIGHT = 39;
  const ARROW_DOWN = 40;
  const ARROW_KEYS = [ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN];

  // Other keys
  const KEY_BACKSPACE = 8;
  const KEY_ENTER = 13;
  const KEY_ESC = 27;
  const KEY_SPACE = 32;
  const KEY_ALPHA_A = 65;
  const KEY_ALPHA_Z = 90;

  let ALLOWED_KEYS = [KEY_BACKSPACE, KEY_ENTER, KEY_ESC, KEY_SPACE]
    .concat(ARROW_KEYS)
    .concat(range(KEY_ALPHA_A, KEY_ALPHA_Z));

  const IGNORED_KEYS = ['Dead', 'Meta'];

  const SELECTED_CHAR_CLASS = '.js-selected-char';

  let lastKey;

  // Core app functions
  const resetCharBlocks = () => {
    Array.from(charBlocks).forEach(elem => {
      elem.classList.remove('dn');
      elem.classList.add('flex');
    });
  };

  const filterUnicodeCharacters = () => {
    let text = keywordTitle.textContent.split(' ');

    let charsShown = charBlocks.length;

    Array.from(charBlocks).forEach(elem => {
      let keywords = elem.getAttribute('data-keywords');
      let name = elem.getAttribute('data-name');
      let match = false;

      for (let textItem of text) {
        match = ~name.indexOf(textItem) || ~keywords.indexOf(textItem);
        if (match) {
          break;
        }
      }

      if (match) {
        elem.classList.remove('dn');
        elem.classList.add('flex');
        charsShown += 1;
      } else {
        elem.classList.remove('flex');
        elem.classList.add('dn');
        charsShown -= 1;
      }
    });

    if (charsShown === 0) {
      noFilterMatch.classList.remove('dn');
    } else {
      noFilterMatch.classList.add('dn');
    }
  };

  const handleArrowKeys = event => {
    let firstChar = charList.firstChild;
    let selectedChar = document.querySelector(SELECTED_CHAR_CLASS);
    let nextCharElem = null;

    if (ARROW_KEYS.includes(event.keyCode)) {
      event.preventDefault();

      if (selectedChar === null) {
        selectedChar = firstChar;
      }

      let selectedCharIndex = Array.from(charList.childNodes).indexOf(
        selectedChar
      );

      // Calculate how many items wide the grid is
      // so we can use it to calculate keyboard navigation
      let gridColumns = 0;
      let gridHeight = 0;
      let prevCoords = null;
      let scrollingDown = true;

      Array.from(charList.childNodes).forEach(currElem => {
        if (gridHeight >= 1) {
          return;
        }

        let currElemCoords = currElem.getBoundingClientRect();

        if (prevCoords === null) {
          prevCoords = currElemCoords;
        }

        if (
          currElemCoords.left !== prevCoords.left &&
          currElemCoords.top !== prevCoords.top
        ) {
          return;
        }

        if (currElemCoords.left !== prevCoords.left) {
          gridColumns++;
        }

        if (currElemCoords.top !== prevCoords.top) {
          gridHeight++;
        }

        prevCoords = currElemCoords;
      });

      switch (event.keyCode) {
        case ARROW_UP:
          nextCharElem =
            charList.childNodes[selectedCharIndex - gridColumns - 1];
          scrollingDown = false;
          break;
        case ARROW_DOWN:
          nextCharElem =
            charList.childNodes[selectedCharIndex + gridColumns + 1];
          scrollingDown = true;
          break;
        case ARROW_LEFT:
          nextCharElem = charList.childNodes[selectedCharIndex - 1];
          break;
        case ARROW_RIGHT:
          nextCharElem = charList.childNodes[selectedCharIndex + 1];
          break;
        default:
          break;
      }

      if (nextCharElem === undefined) {
        return;
      }

      if (
        selectedChar === firstChar &&
        !firstChar.classList.contains('c1-hover')
      ) {
        firstChar.classList.add('c1-hover');
        firstChar.classList.add('js-selected-char');
      } else {
        firstChar.classList.remove('c1-hover');
        firstChar.classList.remove('js-selected-char');

        selectedChar.classList.remove('c1-hover');
        selectedChar.classList.remove('js-selected-char');

        nextCharElem.classList.add('c1-hover');
        nextCharElem.classList.add('js-selected-char');

        if (!isElementInViewport(nextCharElem)) {
          let scrollHeight = window.innerHeight / 2;

          if (!scrollingDown) {
            scrollHeight = -scrollHeight;
          }

          window.scrollBy(0, scrollHeight);
        }
      }
    }
  };

  const keyupHandler = () => {
    if (keywordTitle.textContent === originalTitle) {
      return resetCharBlocks();
    }

    filterUnicodeCharacters();
  };

  const keydownHandler = event => {
    let keyCode = event.keyCode;

    if (!ALLOWED_KEYS.includes(keyCode) || IGNORED_KEYS.includes(event.key)) {
      lastKey = event.key;
      return;
    }

    let selectedChar = document.querySelector(SELECTED_CHAR_CLASS);

    // Arbitrary number for now, but 32 chars should be plenty to search with
    if (keywordTitle.textContent.split('').length >= 32) {
      return;
    }

    switch (keyCode) {
      // Escape key, clear the search
      case KEY_ESC:
        keywordTitle.textContent = originalTitle;

        if (selectedChar !== null) {
          selectedChar.classList.remove('c1-hover');
          selectedChar.classList.remove('js-selected-char');
        }

        window.scrollTo(0, 0);

        return resetCharBlocks();

      // Backspace key, clear the search
      case KEY_BACKSPACE:
        if (keywordTitle.textContent === originalTitle) {
          return;
        }

        let title = keywordTitle.textContent.split('');
        title.pop();
        let newTitle = title.join('');
        keywordTitle.textContent = newTitle;

        if (keywordTitle.textContent === '') {
          keywordTitle.textContent = originalTitle;
        }

      // Enter key, trigger copy notification
      case KEY_ENTER:
        // Trigger a click
        if (selectedChar !== null) {
          selectedChar.querySelector('.js-clipboard').click();
        }
    }

    // A to Z or space
    if (
      (keyCode >= KEY_ALPHA_A && keyCode <= KEY_ALPHA_Z) ||
      keyCode === KEY_SPACE
    ) {
      // If the last key was an ignorable key, ignore on this key as well
      if (IGNORED_KEYS.includes(lastKey)) {
        lastKey = event.key;
        return;
      }

      // Is key is between a and z?
      if (keywordTitle.textContent === originalTitle) {
        keywordTitle.textContent = '';
      }

      // Space needs to override the default handler
      if (keyCode === KEY_SPACE) {
        event.preventDefault();
        keywordTitle.textContent += ' ';
      } else {
        keywordTitle.textContent += event.key;
      }
    }

    handleArrowKeys(event);

    lastKey = event.key;
  };

  const charCopyErrorHandler = e => {
    // Handle Clipboard error in the future
    console.error(e);
  };

  const charCopyHandler = async e => {
    // Handle Clipboard success
    let charParentNode = e.trigger.parentNode.parentNode;
    let overlay = charParentNode.querySelector('.js-notification-overlay');

    // Log a GA event
    ga('send', {
      eventCategory: `${e.text}`,
      eventAction: e.action
    });

    // Hacks lie ahead - timing-based animation stuff to curb removing
    // the block-level CSS in order for the opacity animation to work
    overlay.classList.toggle('notification-overlayshow');
    overlay.classList.toggle('dn');

    await promiseTimeout(() => {
      overlay.classList.toggle('o-0');
      overlay.classList.toggle('o-100');
    }, 50);

    await promiseTimeout(() => {
      overlay.classList.toggle('o-0');
      overlay.classList.toggle('o-100');
    }, 2000);

    await promiseTimeout(() => {
      overlay.classList.toggle('dn');
      overlay.classList.toggle('notification-overlayshow');
    }, 300);

    if (keywordTitle.textContent === originalTitle) {
      return;
    }

    window.location.hash = `#${encodeURIComponent(keywordTitle.textContent)}`;
  };

  const htmlTemplate = char => {
    let { name, char: emoji, codes, category } = char;
    name = name.toLowerCase();

    return htmlToElement(`
      <li class="js-unicode-char"
          data-code="${codes}"
          data-name="${name}"
          data-keywords="${category}">
        <div class="flex flex-column
                    c1 w5 ma3 pa3
                    ba b--light-gray tl">
          <div class="relative">
            <a href="#"
              class="link dark-gray char-link js-clipboard"
              data-clipboard-text="${emoji}">
              <h2 class="mv1 f-5 pa3 lh-solid tc">
                ${emoji}
              </h2>
              <p class="mv1">
                <strong>Name</strong>
                <br />
                ${name}
              </p>
              <p class="mv1">
                <strong>Code</strong>
                <br />
                ${codes}
              </p>
            </a>
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
        </div>
      </li>
    `);
  };

  const initApp = () => {
    loadingContainer.classList.add('dn');

    charListContainer.classList.remove('dn');
    charListContainer.classList.add('db');

    keywordTitleCopy.classList.remove('dn');
    keywordTitleCopy.classList.add('db');

    if (window.location.hash) {
      let searchText = decodeURIComponent(
        window.location.hash.replace('#', '')
      );
      keywordTitle.textContent = searchText;
      filterUnicodeCharacters();
    }
  };

  let charList = document.querySelector('.js-char-list');
  for (let char of unicodeCharacters) {
    let template = htmlTemplate(char);
    charList.appendChild(template);
  }

  let noFilterMatch = document.querySelector('.js-no-filter-match');
  let loadingContainer = document.querySelector('.js-loading-container');

  let keywordTitle = document.querySelector('.js-keyword-title');
  let keywordTitleCopy = document.querySelector('.js-keyword-title-copy');
  let originalTitle = keywordTitle.textContent;

  let charListContainer = document.querySelector('.js-char-list-container');
  let charBlocks = document.querySelectorAll('.js-unicode-char');

  // Create a new Clipboard.js object
  let clipboardBtns = document.querySelectorAll('.js-clipboard');
  let clipboard = new Clipboard(clipboardBtns);

  // Stop browser from bubbling the blank hash to the document
  for (let btn of clipboardBtns) {
    btn.addEventListener('click', event => {
      event.preventDefault();
    });
  }

  clipboard.on('success', charCopyHandler).on('error', charCopyErrorHandler);

  // Capture any keyboard input in the page
  document.addEventListener('keydown', keydownHandler);

  // Do this separately from above work so as not to block thread
  document.addEventListener('keyup', keyupHandler);

  // There's 1700+ DOM elements that need to be displayed (for now)
  // After a period of time, show them
  await promiseTimeout(initApp, 3000);
})();
