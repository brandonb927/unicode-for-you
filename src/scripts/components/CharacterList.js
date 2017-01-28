import React from 'react'

import CharacterListItem from './CharacterListItem'

export default function CharacterList (props) {
  return (
    <div id="char_list_container"
         className={`
           mw9 center
           ${props.isLoaded ? '' : 'dn '}
           ${props.isLoaded ? 'db ' : ''}
         `}>
      <ul id="char_list"
          className="flex flex-wrap justify-center ma0 pa0 list">
        {
          props.unicodeCharacters.map((unicodeCharacter, index) => {
            return (
              <CharacterListItem
                key={index}
                {...unicodeCharacter}
              />
            )
          })
        }
      </ul>
      <p id="no_filter_match" className="dn f3 tc">
        Nothing matches your search 😢
      </p>
    </div>
  )
}
