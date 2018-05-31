import React, { Component } from 'react'
import style from './Home.scss'

import ProgressBanner from '../../components/ProgressBanner'

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageonload:false,
    };
  }
  componentDidMount()
  {
    this.setState({
      pageonload:true,
    })
  }
  render() {
    return (
      <div>
        <ProgressBanner loaded={this.state.pageonload} />
        
        <div className={style.HomeBox}>
            HELLWORLD
        </div>

      </div>
    )
  }
}

export default Home
