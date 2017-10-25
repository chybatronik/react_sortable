import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './App.css';
import Sortable from './Sortable';

const springConfig = {stiffness: 300, damping: 50};

let step_y = 90
let step_x = 90
let delta = 10

class App extends Component {
  constructor(props) {
    super(props);
    this.sortable = new Sortable(step_x, step_y, delta, "default");
    // this.sortable = new Sortable();
    // console.log("sortable::", this.sortable.get_state())

    this.state = this.sortable.get_state();
    // this.setState({step_x: step_x, step_y: step_y, delta: delta});
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

  onMode(event){
    console.log("onMode", event.target.value)
    this.setState({mode: event.target.value});
    this.sortable = new Sortable(this.state.step_x, this.state.step_y, this.state.delta, event.target.value);
    this.setState(this.sortable.get_state());
  }

  onDelta(event){
    const delta = parseInt(event.target.value);
    this.setState({delta: delta});
    this.sortable = new Sortable(this.state.step_x, this.state.step_y, delta, this.state.mode);
    this.setState(this.sortable.get_state());
  }

  onWidth(event){
    const step_x = parseInt(event.target.value);
    this.setState({step_x: step_x});
    this.sortable = new Sortable(step_x, this.state.step_y, this.state.delta, this.state.mode);
    this.setState(this.sortable.get_state());
  }

  onHeight(event){
    const step_y = parseInt(event.target.value)
    this.setState({step_y: step_y});
    this.sortable = new Sortable(this.state.step_x, step_y, this.state.delta, this.state.mode);
    this.setState(this.sortable.get_state());
  }

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
                zIndex: lastPress && value.id === lastPress.id ? 99 : value.id
              }}>
              {value.id}
            </div>
          }
        </Motion>
      ));
      // })
    })
    return (
      <div>
        <div className="navigate">
          <div className="col">
            <div className="group">
              <label>Mode sortable</label>
              <select onChange={this.onMode.bind(this)}>
                <option>default</option>
                <option>left_right</option>
              </select>
            </div>
            <div className="group">
              <label>Delta</label>
            <input onChange={this.onDelta.bind(this)} type="number" value={this.state.delta}></input>
            </div>
          </div>
          <div className="col">
            <div className="group">
              <label>Width</label>
            <input onChange={this.onWidth.bind(this)}  type="number" value={this.state.step_x}></input>
            </div>
            <div className="group">
              <label>Height</label>
            <input onChange={this.onHeight.bind(this)}  type="number" value={this.state.step_y}></input>
            </div>
          </div>
        </div>
        <div  className="demo-outer ">
          <div className="demo">
            {result}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
