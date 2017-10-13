import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import './App.css';

const springConfig = {stiffness: 300, damping: 50};

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseX: 0,
      mouseY: 0,
      lastPress: null,
      isPressed: false,
      order: [
        [1, 2, 3, 4, 5, 6],
        [11, 12, 13, 14, 15, 16],
        [21, 22, 23, 24, 25, 26]
      ],
    };
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
    const {isPressed, topDeltaY, topDeltaX, order, lastPress} = this.state;

    if (isPressed) {
      const mouseY = pageY -topDeltaY ;
      const currentRow = clamp(Math.round(mouseY / 100), 0, 10);
      console.log("currentRow", currentRow)
      // let newOrder = order;

      const mouseX = pageX-topDeltaX;
      const currentCol = clamp(Math.round(mouseX / 100), 0, 10);
      console.log("currentCol", currentCol)
      let result = []
      console.log("order[currentRow][currentCol]", order[currentRow][currentCol])
      let new_row = []
      order.forEach((_, key_y) => {
        if(key_y === currentRow){
          new_row = []
          order[key_y].forEach((current, key) => {
            if(currentCol === key){

              new_row.push(lastPress)

            }else{
              if(lastPress===current){
                new_row.push(order[currentRow][currentCol])
              }else{
                new_row.push(current)
              }
            }
          })
          result.push(new_row)
        }else{
          new_row = []
          order[key_y].forEach((current, key) => {
            if(lastPress===current){
              new_row.push(order[currentRow][currentCol])
            }else{
              new_row.push(current)
            }
          })
          result.push(new_row)
        }
      })
      console.log("result", result)
      this.setState({mouseY: mouseY, mouseX: mouseX, order: result });
    }
  };

  handleMouseDown = (pos, [pressX, pressY], {pageX, pageY}) => {
    this.setState({
      lastPress: pos,
      isPressed: true,
      mouseY: pressY,
      mouseX: pressX,
      topDeltaY: pageY - pressY,
      topDeltaX: pageX - pressX,
    });
  };

  handleMouseUp = () => {
    this.setState({isPressed: false, topDeltaY: 0, topDeltaX: 0});
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
