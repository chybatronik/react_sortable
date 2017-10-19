import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './App.css';
import Sortable from './Sortable';

const springConfig = {stiffness: 300, damping: 50};


class App extends Component {
  constructor(props) {
    super(props);
    this.sortable = new Sortable();
    console.log("sortable::", this.sortable.get_state())

    this.state = this.sortable.get_state();
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  handleTouchStart = (key, pressLocation, e) => {
    console.log("handleTouchStart", key, pressLocation, e.touches[0])
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = (e) => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseMove = ({pageX, pageY}) => {
    // console.log("handleMouseMove", pageX, pageY)
    this.sortable.handleMouseMove({pageX, pageY})
    let st = this.sortable.get_state()
    this.setState({mouseY: st.mouseY, mouseX: st.mouseX, order: st.order });
  };

  handleMouseDown = (pos, [pressX, pressY], {pageX, pageY}) => {
    this.sortable.handleMouseDown(pos, [pressX, pressY], {pageX, pageY})
    let st = this.sortable.get_state()
    this.setState({
      lastPress: st.lastPress,
      isPressed: st.isPressed,
      mouseY: st.mouseY,
      mouseX: st.mouseX
    });
  };

  handleMouseUp = () => {
    this.sortable.handleMouseUp()
    let st = this.sortable.get_state()
    this.setState({
      isPressed: st.isPressed,
    });
  };

  render() {
    const {order, lastPress, isPressed, mouseX, mouseY} = this.state;
    let result = []
    order.forEach((_, key_y) => {
      order[key_y].forEach((currentValue, key) => {
        let style;
        if (currentValue === lastPress && isPressed) {
          style = {
            scale: spring(1.3, springConfig),
            shadow: spring(1.3, springConfig),
            y: mouseY,
            x: mouseX,
          }
        }else{
          style = {
            scale: spring(1, springConfig),
            shadow: spring(1, springConfig),
            y: spring(key_y * 100, springConfig),
            x: spring(key * 100, springConfig),
          }
        }
        result.push((
          <Motion key={currentValue} style={style}>
            {({scale, shadow, y, x}) =>
              <div
                onMouseDown={this.handleMouseDown.bind(null, currentValue, [x, y])}
                onTouchStart={this.handleTouchStart.bind(null, currentValue, [x, y])}
                className="demo2-ball"
                style={{
                  boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  zIndex: currentValue === lastPress ? 99 : currentValue,
                }}>
                {currentValue}
              </div>
            }
          </Motion>
        ));
      })
    })
    return (
      <div  className="demo8-outer ">
        <div className="demo2">
          {result}
        </div>
      </div>
    );
  }
}

export default App;
