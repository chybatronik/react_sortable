import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './SortableReact.css';
import Sortable from './Sortable';
import PropTypes from "prop-types"

class SortableReact extends Component {
  constructor(props) {
    super(props);

    this.sortable = new Sortable(props.width, props.height, props.delta, props.sortable_mode, props.order, props.allow_use_empty);
    this.state = this.sortable.get_state();
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillReceiveProps(nextProps){
    console.log("SortableReact componentWillReceiveProps")
    const step_x = nextProps.width ? nextProps.width : this.state.step_x
    const step_y = nextProps.height ? nextProps.height : this.state.step_y
    const sortable_mode = nextProps.sortable_mode ? nextProps.sortable_mode : this.state.mode
    const delta = nextProps.delta ? nextProps.delta : this.state.delta
    const allow_use_empty = nextProps.allow_use_empty

    this.sortable = new Sortable(step_x, step_y, delta, sortable_mode, this.props.order, allow_use_empty);
    // console.log("this.sortable.get_state()::", this.sortable.get_state())
    this.setState(this.sortable.get_state());
  }

  handleTouchStart = (key, pressLocation, e) => {
    if(!this.props.disable_drag){
      console.log("handleTouchStart", key, pressLocation, e.touches[0])
      this.handleMouseDown(key, pressLocation, e.touches[0]);
    }
  };

  handleTouchMove = (e) => {
    if(!this.props.disable_drag){
      e.preventswipe();
      this.handleMouseMove(e.touches[0]);
    }
  };

  handleMouseMove = ({pageX, pageY}) => {
    // console.log("handleMouseMove", pageX, pageY)
    if(!this.props.disable_drag){
      this.sortable.handleMouseMove({pageX, pageY})
      let st = this.sortable.get_state()
      this.setState({mouseY: st.mouseY, mouseX: st.mouseX, order: st.order });
    }
  };

  handleMouseDown = (pos, [pressX, pressY], {pageX, pageY}) => {
    if(!this.props.disable_drag){
      this.sortable.handleMouseDown(pos, [pressX, pressY], {pageX, pageY})
      let st = this.sortable.get_state()
      // console.log("pos", pos, st)
      if(this.props.start){
        this.props.start(pos)
      }
      this.setState({
        lastPress: pos,
        isPressed: st.isPressed,
        mouseY: st.mouseY,
        mouseX: st.mouseX
      });
    }
  };

  handleMouseUp = () => {
    if(!this.props.disable_drag){
      let is_call_callback = false
      if(
        this.props.finished &&
        JSON.stringify(this.sortable.state.order) !== JSON.stringify(this.sortable.state.old_order)
      ){
        is_call_callback = true
      }

      this.sortable.handleMouseUp()
      let st = this.sortable.get_state()

      if(is_call_callback){
        this.props.finished(st)
        console.log("sortable.get_state()", st)
      }

      this.setState({
        isPressed: st.isPressed,
      });
    }
  };

  render() {
    const {order, lastPress, isPressed, mouseX, mouseY} = this.state;
    let result = []
    const springConfig = {
      stiffness: this.props.stiffness,
      damping: this.props.damping
    }

    let count = 0;
    order.forEach((value, key) => {
      let style;
      if (lastPress && value.id === lastPress.id && isPressed) {
        style = {
          scale: spring(this.props.scale_active, springConfig),
          shadow: spring(this.props.shadow_active, springConfig),
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
      let value_style = {}
      if(value.style){
        value_style = value.style
      }

      count += 1
      result.push((
        <Motion key={count} style={style}>
          {({scale, shadow, y, x}) =>
            <div
              onMouseDown={this.handleMouseDown.bind(null, value, [x, y])}
              onTouchStart={this.handleTouchStart.bind(null, value, [x, y])}
              className="demo-item"
              style={{...value_style, ...{
                width: value.width,
                height: value.height,
                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                zIndex: lastPress && value.id === lastPress.id ? 99 : 50
              }}}>
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

SortableReact.defaultProps = {
  sortable_mode: "swap",
  width: 90,
  height: 90,
  delta: 10,
  // order: default_order,
  stiffness: 300,
  damping: 50,
  scale_active:1.2,
  shadow_active:1.2,
  allow_use_empty: false,
  disable_drag: false
}

SortableReact.propTypes = {
  sortable_mode: PropTypes.oneOf(["swap", "left_right"]).isRequired,
  order: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    con: PropTypes.string.isRequired,
    style: PropTypes.object,
  })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  delta: PropTypes.number,
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  scale_active: PropTypes.number,
  shadow_active: PropTypes.number,
  allow_use_empty: PropTypes.bool,
  finished: PropTypes.func,
  start: PropTypes.func,
  disable_drag: PropTypes.bool
}

export default SortableReact;
