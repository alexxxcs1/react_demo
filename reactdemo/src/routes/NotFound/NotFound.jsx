import React, { Component } from 'react'
import style from './NotFound.scss'

export class NotFound extends Component {
  render() {
    return (
      <div className={style.NotFoundBox}>
          
          <div className={style.NotFoundTips}>
            <p>404 NOT FOUND</p>  
          </div>

      </div>
    )
  }
}

export default NotFound
