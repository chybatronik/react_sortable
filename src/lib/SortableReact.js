/* REVIEW: File name shoudld be sortable-react.js, per standard. */

import React from 'react';
// var React = require('react') /* REVIEW: provide reason why it is commented out or remove. */
import {Motion, spring} from 'react-motion';
// import Sortable from './index.js'; /* REVIEW: provide reason why it is commented out or remove. */
import Sortable from 'develexe-sortable';
import PropTypes from "prop-types"

class SortableReact extends React.Component {
  constructor(props) {
    super(props);

    this.sortable = new Sortable(props.cellWidth, props.cellHeight, props.cellSpacing, props.mode, props.cells, props.isDropOnEmptyAreaAllowed);
    this.state = this.sortable.get_state();
  };

  componentDidMount() {
    /* REVIEW: event listeners are added, but never explicitly removed.
    according to standard, event listeners should be explicily removed
    Applies for all 4 expressions below: */
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentWillReceiveProps(nextProps){
    // console.log("SortableReact componentWillReceiveProps") /* REVIEW: please do a code cleanup, if this console log is not really needed. */
    const step_x = nextProps.cellWidth ? nextProps.cellWidth : this.state.step_x /* REVIEW: step_x, to conform standard const names should be camelCase. */
    const step_y = nextProps.cellHeight ? nextProps.cellHeight : this.state.step_y /* REVIEW: step_y, to conform standard const names should be camelCase. */
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
      // console.log("handleTouchStart", key, pressLocation, e.touches[0]) /* REVIEW: please do a code cleanup, if this console.log is not really needed. */
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
        // console.log("handleMouseMove pageX, pageY", pageX, pageY) /* REVIEW: please do a code cleanup, if this console.log is not really needed. */
        this.sortable.handleMouseMove({pageX, pageY})
        let st = this.sortable.get_state()
        this.setState({mouseY: st.mouseY, mouseX: st.mouseX, cells: st.cells });
      }
    }
  };

  handleMouseDown = (pos, [pressX, pressY], {pageX, pageY}) => { /* REVIEW: 'pos' is non descriptive and misleading name,
                                                                    recommended to rename to 'cell' or 'cellData'. */
    if(!this.props.isGridLocked){
      // console.log("handleMouseDown:::", pos) /* REVIEW: please do a code cleanup, if this console.log is not really needed. */
      this.sortable.handleMouseDown(pos, [pressX, pressY], {pageX, pageY})
      let st = this.sortable.get_state()
      if(this.props.onCellDragStart){
        // console.log("onCellDragStart:::") /* REVIEW: please do a code cleanup, if this console.log is not really needed. */
        this.props.onCellDragStart(pos)
      }
      this.setState({
        lastPress: pos,
        isPressed: st.isPressed, /* REVIEW: isPressed key is a boolean and should be renamed to 'pressed', per standard. */
        mouseY: st.mouseY,
        mouseX: st.mouseX
      });
    }
  };

  handleMouseUp = () => {
    if(!this.props.isGridLocked){
      // console.log("handleMouseUp:::") /* REVIEW: please do a code cleanup, if this console.log is not really needed. */
      let is_call_callback = false /* REVIEW:  1. Variable names should be camelCase per standard.
                                              2. Recommended to get rid of this variable at all. */
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
        // console.log("sortable.get_state()", st) /* REVIEW: please do a code cleanup, if this console.log is not really needed. */
      }

      this.setState({
        isPressed: st.isPressed, /* REVIEW: The 'isPressed' key is a boolean and should be renamed to 'pressed', per standard. */
      });
    }
  };

  render() {
    const {cells, lastPress, isPressed, mouseX, mouseY} = this.state; /* REVIEW: isPressed key is a boolean and should be renamed to pressed, per standard. */
    let result = [] /* REVIEW: The 'result' is not descriptive name. Should be renamed to something descriptive, e.g. 'cellElements'. */
    const springConfig = {
      stiffness: this.props.stiffness,
      damping: this.props.damping
    }
    let count = 0; /* REVIEW: count is not descriptive name. and seems this is unnecessary variable,
                      its value can be always obtained as (key + 1) withing below forEach */
    cells.forEach((value, key) => { /*REVIEW: 'value' and 'key' are not descriptive names and 'key' is misleading.
      The 'key' should be renamed to 'index' or 'i' and 'value' shuld be 'cell' or 'cellData'. */
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
      let value_style = {} /* REVIEW: 1. variable names camelCase according to standard.
                                      2. variable name is non descriptive, recommended to rename to 'cellStyle'. */
      if(value.style){
        value_style = value.style
      }

      count += 1 /* REVIEW: count seems unnecessary here, isn't it's value always (key + 1)? */
      result.push((
        <Motion key={count} style={style}>
          {({scale, shadow, y, x}) =>
            <div
              onMouseDown={this.handleMouseDown.bind(null, value, [x, y])}
              onTouchStart={this.handleTouchStart.bind(null, value, [x, y])}
              className="sortable-item" /* REVIEW:  A hardcoded css class in reusable component that was not documented.
                                                    User has to know that this css class should be defined it his stylesheet.
                                                    Because this is the only one hard-coded class name, recommended to avoid using
                                                    of this hardcoded one and instead allow user to set className through cell
                                                    configuration object. */
              style={{...value_style, ...{
                width: value.width,
                height: value.height,
                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                WebkitTransform: `translate3d(${x-this.props.cellWidth}px, ${y-this.props.cellHeight}px, 0) scale(${scale})`,
                zIndex: lastPress && value.id === lastPress.id ? 99 : 50
              }}}>
              {value.content}
            </div>
          }
        </Motion>
      ));
      // }) /* REVIEW: provide reason why commented out or remove. */
    })
    /* REVIEW:  1. Excessive DOM within return statement, single parent div element should be enough.
                2. Root element css class name is not allowed being set by user.
                According standard, for reusable components root element class name should be available
                to be set by user. */
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
  // cells: default_order, /* REVIEW: provide reason why commented out or remove. */
  stiffness: 300,
  damping: 50,
  scaleActiveCell:1.2,
  shadowActiveCell:1.2,
  isDropOnEmptyAreaAllowed: false,
  isGridLocked: false,
  not_update_order:false //update cells after update component /* REVIEW: comment has different meaning from vairable name. Either remove/update misleading comment either rename property*/
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
  isDropOnEmptyAreaAllowed: PropTypes.bool, /* REVIEW: isDropOnEmptyAreaAllowed should be renamed to dropOnEmptyAreaAllowed, per standard (boolean properties name convention). */
  onCellDrop: PropTypes.func,
  onCellDragStart: PropTypes.func,
  isGridLocked: PropTypes.bool, /* REVIEW: isGridLocked should be renamed to gridLocked, per standard (boolean properties name convention). */
  not_update_order: PropTypes.bool /* REVIEW: property names should be camelCase. */
}


// exports.default = SortableReact; /* REVIEW: reason why this line is commented out should be provided or remove it. */
export default SortableReact;
