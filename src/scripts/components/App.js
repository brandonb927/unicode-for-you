import '../utils/polyfill'
import 'whatwg-fetch'
import React from 'react'

import Loader from './Loader'
import CharacterList from './CharacterList'

export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      unicodeCharacters: [],
      isLoaded: false
    }
  }

  componentDidMount () {
    fetch('unicode.json')
      .then((response) => { return response.json() })
      .then((unicodeCharacters) => {
        this.setState({
          unicodeCharacters: unicodeCharacters,
          isLoaded: true
        })
      })
  }

  render () {
    return (
      <div>
        <Loader
          isLoaded={this.state.isLoaded}
        />
        <CharacterList
          {...this.state}
        />
      </div>
    )
  }

}
