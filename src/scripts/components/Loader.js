import React from 'react'

export default class Loader extends React.Component {

  render () {
    return (
      <div id="loading_container" className="mw9 mb4 center tc loading-container">
        <div className="f-6">
          <span className="anim-wave">🌊</span><span className="anim-ship">🛳</span>
        </div>
        <p className="f3">
          Loading…
        </p>
      </div>
    )
  }

}
