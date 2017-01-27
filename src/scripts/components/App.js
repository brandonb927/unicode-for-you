import React from 'react'

import Loader from './Loader'
import CharacterList from './CharacterList'

export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      unicodeCharacters: []
    }
  }

  componentDidMount () {
    fetch('unicode.json')
      .then((response) => { return response.json() })
      .then((unicodeCharacters) => {
        this.setState({
          unicodeCharacters: unicodeCharacters
        })
      })
  }

  render () {
    return (
      <div>
        <Loader />
        <CharacterList />
      </div>
    )
  }

}
