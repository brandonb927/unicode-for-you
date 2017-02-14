import React from 'react'
import Clipboard from 'clipboard'

export default class CharacterListItem extends React.Component {

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
    console.log(event.action, event.text)

    // // Send copy event to GA
    // ga('send', {
    //   eventCategory: `${e.text}`,
    //   eventAction: e.action
    // })
  }

  handleCopyError (event) {
    // Nothing right now
  }

  render () {
    let {name, emoji, code, keywords} = this.props
    name = name.toLowerCase()

    return (
      <li className="flex flex-column
                     c1 w5 ma3 pa3
                     ba b--light-gray tl
                     js-unicode-char"
          data-code="{code}"
          data-name="{name}"
          data-keywords="{keywords}">
        <div className="relative">
          <a href="#"
             className="link char-link js-clipboard"
             onClick={this.handleClick}
             ref={(element) => { this.anchor = element }}
             data-clipboard-text={emoji}>
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
          <div className="flex items-center justify-center
                          absolute top-0 right-0 bottom-0 left-0 h-100 w-100
                          tc bg-white-90 dn o-0
                          notification-overlay
                          js-notification-overlay">
            <h3 className="f3">
              COPIED!
            </h3>
          </div>
        </div>
      </li>
    )
  }

}
