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
    this.refs.homebox.style.setProperty('--randomtime', (Math.random()+0.1) +'s');
    
    setTimeout(() => {
      this.setState({
        pageonload:true,
      })
    }, 3000);
    
    
  }
  render() {
    return (
      <div>
        <ProgressBanner loaded={this.state.pageonload} />
        
        <div className={style.HomeBox} ref='homebox'>
            <span>H</span>
            <span>E</span>
            <span>L</span>
            <span>L</span>
            <span>W</span>
            <span>O</span>
            <span>R</span>
            <span>L</span>
            <span>D</span>
        </div>

      </div>
    )
  }
}

export default Home
