import React from 'react'

export default class CharacterList extends React.Component {

  render () {
    return (
      <div id="char_list_container" className="mw9 center dn">
        <ul id="char_list" className="flex flex-wrap justify-center ma0 pa0 list"></ul>
        <p id="no_filter_match" className="dn f3 tc">
          Nothing matches your search 😢
        </p>
      </div>
    )
  }

}
