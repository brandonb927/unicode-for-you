import React from 'react'

export default function Loader (props) {
  return (
    <div id="loading_container"
         className={`${props.isLoaded ? 'dn ' : ''}mw9 mb4 center tc loading-container`}>
      <div className="f-6">
        <span className="anim-wave">🌊</span><span className="anim-ship">🛳</span>
      </div>
      <p className="f3">
        Loading…
      </p>
    </div>
  )
}
