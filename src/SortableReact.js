import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './App.css';
import Sortable from './Sortable';

const springConfig = {stiffness: 300, damping: 50};

let step_y = 90
let step_x = 90
let delta = 10

class SortableReact extends Component {
  constructor(props) {
    super(props);
    let mode = props.sortable_mode ? props.sortable_mode : "swipe"
    this.sortable = new Sortable(step_x, step_y, delta, mode);
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
    e.preventswipe();
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
    console.log("pos", pos, st)
    this.setState({
      lastPress: pos,
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
    // console.log("lastPress", lastPress)
    let result = []
    // let st = this.sortable.get_state()
    order.forEach((value, key) => {
      // order[key_y].forEach((currentValue, key) => {
      let style;
      if (lastPress && value.id === lastPress.id && isPressed) {
        style = {
          scale: spring(1.2, springConfig),
          shadow: spring(1.2, springConfig),
          y: mouseY,
          x: mouseX,
        }
      }else{
        style = {
          scale: spring(1, springConfig),
          shadow: spring(1, springConfig),
          y: spring(value.y, springConfig),
          x: spring(value.x, springConfig),
        }
      }
      result.push((
        <Motion key={value.id} style={style}>
          {({scale, shadow, y, x}) =>
            <div
              onMouseDown={this.handleMouseDown.bind(null, value, [x, y])}
              onTouchStart={this.handleTouchStart.bind(null, value, [x, y])}
              className="demo-item"
              style={{
                width: value.width,
                height: value.height,
                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                zIndex: lastPress && value.id === lastPress.id ? 99 : 50
              }}>
              {value.con}
            </div>
          }
        </Motion>
      ));
      // })
    })
    return (
      <div>
        <div className="demo-outer ">
          <div className="demo">
            {result}
          </div>
        </div>
      </div>
    );
  }
}

export default SortableReact;
