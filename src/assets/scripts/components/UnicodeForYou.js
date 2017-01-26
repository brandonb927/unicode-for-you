import React from 'react'

class UnicodeForYou extends React.Component {

  componentDidMount () {
    fetch('/unicode.json')
      .then((response) => { return response.json() })
      .then((unicodeCharacters) => {
        this.setState({
          unicodeCharacters: unicodeCharacters
        })
        console.log(unicodeCharacters)
      })
  }

  render () {
    return (
      <div>Hello World!</div>
    )
  }

}

export default UnicodeForYou
