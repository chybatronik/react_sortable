import React from 'react';
// var React = require('react')
import {Motion, spring} from 'react-motion';
import Sortable from './index.js';
// import Sortable from 'develexe-sortable';
import PropTypes from "prop-types"

class SortableReact extends React.Component {
  constructor(props) {
    super(props);

    this.sortable = new Sortable(props.cellWidth, props.cellHeight, props.cellSpacing, props.mode, props.cells, props.isDropOnEmptyAreaAllowed);
    this.state = this.sortable.get_state();
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillReceiveProps(nextProps){
    // console.log("SortableReact componentWillReceiveProps")
    const step_x = nextProps.cellWidth ? nextProps.cellWidth : this.state.step_x
    const step_y = nextProps.cellHeight ? nextProps.cellHeight : this.state.step_y
    const mode = nextProps.mode ? nextProps.mode : this.state.mode
    const cellSpacing = nextProps.cellSpacing ? nextProps.cellSpacing : this.state.delta
    const isDropOnEmptyAreaAllowed = nextProps.isDropOnEmptyAreaAllowed

    let cells = []
    if(this.props.not_update_order){
      cells = this.state.cells
    }else{
      cells = this.props.cells
    }
    if(this.props.onCellDragStart && this.props.not_update_order){

    }else{
      this.sortable = new Sortable(step_x, step_y, cellSpacing, mode, cells, isDropOnEmptyAreaAllowed);
      this.setState(this.sortable.get_state());
    }
  };

  handleTouchStart = (key, pressLocation, e) => {
    if(!this.props.isGridLocked){
      // console.log("handleTouchStart", key, pressLocation, e.touches[0])
      this.handleMouseDown(key, pressLocation, e.touches[0]);
    }
  };

  handleTouchMove = (e) => {
    if(!this.props.isGridLocked){
      e.preventswipe();
      this.handleMouseMove(e.touches[0]);
    }
  };

  handleMouseMove = ({pageX, pageY}) => {
    if(!this.props.isGridLocked){
      if(this.state.isPressed){
        // console.log("handleMouseMove pageX, pageY", pageX, pageY)
        this.sortable.handleMouseMove({pageX, pageY})
        let st = this.sortable.get_state()
        this.setState({mouseY: st.mouseY, mouseX: st.mouseX, cells: st.cells });
      }
    }
  };

  handleMouseDown = (pos, [pressX, pressY], {pageX, pageY}) => {
    if(!this.props.isGridLocked){
      // console.log("handleMouseDown:::", pos)
      this.sortable.handleMouseDown(pos, [pressX, pressY], {pageX, pageY})
      let st = this.sortable.get_state()
      if(this.props.onCellDragStart){
        // console.log("onCellDragStart:::")
        this.props.onCellDragStart(pos)
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
    if(!this.props.isGridLocked){
      // console.log("handleMouseUp:::")
      let is_call_callback = false
      if(
        this.props.onCellDrop //&&
        //JSON.stringify(this.sortable.state.cells) !== JSON.stringify(this.sortable.state.old_order)
      ){
        is_call_callback = true
      }

      this.sortable.handleMouseUp()
      let st = this.sortable.get_state()

      if(is_call_callback){
        this.props.onCellDrop(st)
        // console.log("sortable.get_state()", st)
      }

      this.setState({
        isPressed: st.isPressed,
      });
    }
  };

  render() {
    const {cells, lastPress, isPressed, mouseX, mouseY} = this.state;
    let result = []
    const springConfig = {
      stiffness: this.props.stiffness,
      damping: this.props.damping
    }

    let count = 0;
    cells.forEach((value, key) => {
      let style;
      if (lastPress && value.id === lastPress.id && isPressed) {
        style = {
          scale: spring(this.props.scaleActiveCell, springConfig),
          shadow: spring(this.props.shadowActiveCell, springConfig),
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
              {value.content}
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
  mode: "SWAP",
  cellWidth: 90,
  cellHeight: 90,
  cellSpacing: 10,
  // cells: default_order,
  stiffness: 300,
  damping: 50,
  scaleActiveCell:1.2,
  shadowActiveCell:1.2,
  isDropOnEmptyAreaAllowed: false,
  isGridLocked: false,
  not_update_order:false //update cells after update component
}

SortableReact.propTypes = {
  mode: PropTypes.oneOf(["SWAP", "SORT"]).isRequired,
  cells: PropTypes.arrayOf(PropTypes.object),
  cellWidth: PropTypes.number,
  cellHeight: PropTypes.number,
  cellSpacing: PropTypes.number,
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  scaleActiveCell: PropTypes.number,
  shadowActiveCell: PropTypes.number,
  isDropOnEmptyAreaAllowed: PropTypes.bool,
  onCellDrop: PropTypes.func,
  onCellDragStart: PropTypes.func,
  isGridLocked: PropTypes.bool,
  not_update_order: PropTypes.bool
}


// exports.default = SortableReact;
export default SortableReact;
