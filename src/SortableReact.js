import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './App.css';
import Sortable from './Sortable';
import PropTypes from "prop-types"

class SortableReact extends Component {
  constructor(props) {
    super(props);

    let mode = props.sortable_mode ? props.sortable_mode : "swipe"
    let order = props.order ? props.order : null
    const width = props.width ? props.width : 90
    const height = props.height ? props.height : 90
    const delta = props.delta ? props.delta : 10

    this.sortable = new Sortable(width, height, delta, mode, order);
    this.state = this.sortable.get_state();
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

    this.sortable = new Sortable(step_x, step_y, delta, sortable_mode, this.state.order, this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
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
    let result = []
    const springConfig = {stiffness: this.props.stiffness ? this.props.stiffness : 300 , damping: this.props.damping ? this.props.damping : 50}
    const scale_active = this.props.scale_active ? this.props.scale_active: 1.2
    const shadow_active = this.props.shadow_active ? this.props.shadow_active: 1.2
    order.forEach((value, key) => {
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
const default_order = [
  {id: 1, w:1, h:1, col:1, row:1, con: "1"},
  {id: 2, w:1, h:1, col:2, row:1, con: "2"},
  {id: 3, w:1, h:1, col:3, row:1, con: "3"},
  {id: 4, w:1, h:1, col:4, row:1, con: "4"},
  {id: 11, w:1, h:1, col:1, row:2, con: "11"},
  {id: 12, w:1, h:1, col:2, row:2, con: "12"},
  {id: 13, w:1, h:1, col:3, row:2, con: "13"},
  {id: 14, w:1, h:1, col:4, row:2, con: "14"},
  {id: 21, w:1, h:1, col:1, row:3, con: "21"},
  {id: 22, w:1, h:1, col:2, row:3, con: "22"},
  {id: 23, w:1, h:1, col:3, row:3, con: "23"},
  {id: 24, w:1, h:1, col:4, row:3, con: "24"}
]

SortableReact.defaultProps = {
  sortable_mode: "swipe",
  width: 90,
  height: 90,
  delta: 10,
  order: default_order,
  stiffness: 300,
  damping: 50,
  scale_active:1.2,
  shadow_active:1.2
}

SortableReact.propTypes = {
  sortable_mode: PropTypes.oneOf(["swipe", "left_right"]).isRequired,
  order: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    con: PropTypes.string.isRequired,
   })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  delta: PropTypes.number,
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  scale_active: PropTypes.number,
  shadow_active: PropTypes.number,
}

export default SortableReact;
