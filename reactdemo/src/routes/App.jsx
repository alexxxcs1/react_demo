import React from 'react'
import { hashHistory, Router, Route, IndexRoute } from 'react-router'

import {saveUser} from '../redux/actions/STATE';

import { api } from 'common/app'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Provider} from 'react-redux';
import store from '../redux/store';

import NotFound from './notFound'

import Home from './Home'

// import 'common/flexible'
import FastClick from 'fastclick'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount () {
    // 初始化快速点击
    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
      }, false)
    }
    //初始化时间转换
    Date.prototype.format = function(format) {

        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
        <Router history={hashHistory} basename="/product/dist">
          {/* 首页 */}
          <Route path='/' component={Home} > 
            {/* <Route path="/login" component={Login}/> */}
          </Route>
          {/* 404页面 */}
          <Route path="*" component={NotFound}/> 

        </Router>
    )
  }
}
const mapStateToProps = (state) => {
  return {
      setUser: state
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      saveUser: (data) => {
          dispatch(saveUser(data))
      },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
App.contextTypes = { store: PropTypes.object.isRequired }
// export default App

