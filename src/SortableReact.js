import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './App.css';
import Sortable from './Sortable';

// const springConfig = {stiffness: 300, damping: 50};

// let delta = 10

class SortableReact extends Component {
  constructor(props) {
    super(props);
    let mode = props.sortable_mode ? props.sortable_mode : "swipe"
    let order = props.order ? props.order : null
    const width = props.width ? props.width : 90
    const height = props.height ? props.height : 90
    const delta = props.delta ? props.delta : 10
    // const stiffness = props.stiffness ? props.stiffness : 300
    // const damping = props.damping ? props.damping : 50
    this.sortable = new Sortable(width, height, delta, mode, order);
    this.state = this.sortable.get_state();
    // this.state["springConfig"] = {stiffness: stiffness, damping: damping};
    // this.state["scale_active"] = 1.2
    // this.state["shadow_active"] = 1.2
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillReceiveProps(nextProps){
    const step_x = nextProps.width ? nextProps.width : this.state.step_x
    const step_y = nextProps.height ? nextProps.height : this.state.step_y
    const sortable_mode = nextProps.sortable_mode ? nextProps.sortable_mode : this.state.mode
    const delta = nextProps.delta ? nextProps.delta : this.state.delta
    // const stiffness = nextProps.stiffness ? nextProps.stiffness : this.state.springConfig.stiffness
    // const damping = nextProps.damping ? nextProps.damping : this.state.springConfig.damping

    this.sortable = new Sortable(step_x, step_y, delta, sortable_mode, this.state.order, this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
    // this.setState({"springConfig.damping": damping, "springConfig.stiffness":stiffness})
  }

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
    const springConfig = {stiffness: this.props.stiffness ? this.props.stiffness : 300 , damping: this.props.damping ? this.props.damping : 50}
    const scale_active = this.props.scale_active ? this.props.scale_active: 1.2
    const shadow_active = this.props.shadow_active ? this.props.shadow_active: 1.2
    order.forEach((value, key) => {
      // order[key_y].forEach((currentValue, key) => {
      let style;
      if (lastPress && value.id === lastPress.id && isPressed) {
        style = {
          scale: spring(scale_active, springConfig),
          shadow: spring(shadow_active, springConfig),
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
