import React, { Component } from 'react'
import style from './AnimateBackground.scss'

export class AnimateBackground extends Component {
  render() {
    return (
      <div className={style.AnimateBackgroundBox}>
        <div className={style.Box}>

            <span></span>
            <span></span>
            <span></span>

        </div>
      </div>
    )
  }
}

export default AnimateBackground
