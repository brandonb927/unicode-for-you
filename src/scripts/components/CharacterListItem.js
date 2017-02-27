import React from 'react'
import Clipboard from 'clipboard'

import promiseTimeout from '../utils/promise-timeout'

export default class CharacterListItem extends React.Component {

  state = {
    showOverlay: false
  }

  componentDidMount () {
    const anchor = this.anchor
    this.clipboard = new Clipboard(anchor)

    this.clipboard
      .on('success', this.handleCopySuccess)
      .on('error', this.handleCopyError)
  }

  componentWillUnmount() {
    this.clipboard.destroy()
  }

  handleClick (event) {
    // NOTE: Prevent anchors from modifying URL
    event.preventDefault()
  }

  handleCopySuccess (event) {
    // Handle Clipboard success
    let charParentNode = this.anchor.parentNode.parentNode
    // let overlay = # GET OVERLAY ELEMENT OR SOMETHING

    // Log a GA event
    ga('send', { // eslint-disable-line
      eventCategory: event.text,
      eventAction: event.action
    })

    // Hacks lie ahead - timing-based animation stuff to curb removing
    // the block-level CSS in order for the opacity animation to work
    overlay.classList.toggle('notification-overlay-show')
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
        overlay.classList.toggle('notification-overlay-show')
      }, 300)
    })

    if (keywordTitle.textContent === originalTitle) { return }

    window.location.hash = `#${encodeURIComponent(keywordTitle.textContent)}`
  }

  handleCopyError (event) {
    // Handle Clipboard error in the future
      console.error(event)
  }

  render () {
    let {name, emoji, code, keywords} = this.props
    name = name.toLowerCase()

    return (
      <li className="flex flex-column
                     c1 w5 ma3 pa3
                     ba b--light-gray tl
                     js-unicode-char">
        <div className="relative">
          <a href="#"
             className="link char-link js-clipboard"
             onClick={this.handleClick}
             ref={(element) => { this.anchor = element }}>
            <h2 className="mv1 f-5 pa3 lh-solid tc">
              {emoji}
            </h2>
          </a>
          <p className="mv1">
            <strong>Name</strong>
            <br />
            {name}
          </p>
          <p className="mv1">
            <strong>Code</strong>
            <br />
            {code}
          </p>
          {
            keywords.length > 0
            ? <p className="mv1">
                <strong>keywords</strong>
                <br />
                {keywords.join(', ')}
              </p>
            : ''
          }
          <div className={'flex items-center justify-center \
                          absolute top-0 right-0 bottom-0 left-0 h-100 w-100 \
                          tc bg-white-90 dn \
                          notification-overlay' + this.state.showOverlay ? 'o-0' : 'o-100'
                        }>
            <h3 className="f3">
              COPIED!
            </h3>
          </div>
        </div>
      </li>
    )
  }

}
