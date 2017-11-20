import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
// import './App.css';
import Sortable from './Sortable';
import SortableReact from './SortableReact';

// const springConfig = {stiffness: 300, damping: 50};
//
// let step_y = 90
// let step_x = 90
// let delta = 10

class App extends Component {
  constructor(props) {
    super(props);
    this.sortable = new Sortable(step_x, step_y, delta, "swipe");
    this.state = this.sortable.get_state();
  };


  onMode(event){
    console.log("onMode", event.target.value)
    this.setState({mode: event.target.value});
    this.sortable = new Sortable(this.state.step_x, this.state.step_y, this.state.delta, event.target.value, this.state.order, this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
  }

  onDelta(event){
    const delta = parseInt(event.target.value, 10);
    this.setState({delta: delta});
    this.sortable = new Sortable(this.state.step_x, this.state.step_y, delta, this.state.mode,  this.state.order, this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
  }

  onWidth(event){
    const step_x = parseInt(event.target.value, 10);
    this.setState({step_x: step_x});
    this.sortable = new Sortable(step_x, this.state.step_y, this.state.delta, this.state.mode, this.state.order, this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
  }

  onHeight(event){
    const step_y = parseInt(event.target.value, 10);
    this.setState({step_y: step_y});
    this.sortable = new Sortable(this.state.step_x, step_y, this.state.delta, this.state.mode, this.state.order, this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
  }

  onTextArea(event){
    // console.log("onTextArea", JSON.parse(event.target.value))
    try {
      this.setState({str_order: event.target.value});
      const new_order = JSON.parse(event.target.value);
      this.setState({order: new_order});
      this.sortable = new Sortable(this.state.step_x, this.state.step_y, this.state.delta, this.state.mode, new_order, this.state.allow_use_empty);
      this.setState(this.sortable.get_state());
    }catch(err) {

    }
  }

  onAddItemRight(){
    console.log("onItemRight")
    this.sortable.add_item_right_col()
  }

  onAddItemEnd(){
    console.log("onAddItemEnd")
    this.sortable.add_item_end_row()
  }

  onAllowEmpty(event){
    console.log("onAllowEmpty::", event.target.value)
    this.sortable = new Sortable(this.state.step_x, step_y, this.state.delta, this.state.mode, this.state.order, !this.state.allow_use_empty);
    this.setState(this.sortable.get_state());
    this.setState({
      allow_use_empty: !this.state.allow_use_empty,
    });
  }

  render() {
    const {order, lastPress, isPressed, mouseX, mouseY} = this.state;
    // console.log("lastPress", lastPress)
    let json_order;
    if(this.state.str_order){
      json_order = this.state.str_order
    }else{
      json_order = JSON.stringify(this.state.order, "", 4)
    }
    return (
      <div>
        <div className="navigate">
          <div className="col">
            <div className="group">
              <label>Mode sortable</label>
              <select onChange={this.onMode.bind(this)}>
                <option value="swipe">swipe</option>
                <option value="left_right">left_right</option>
              </select>
            </div>
            <div className="group">
              <label>Delta: {this.state.delta} px</label>
              <input onChange={this.onDelta.bind(this)} type="range" value={this.state.delta}  min="0" max="100">
              </input>
            </div>
          </div>
          <div className="col">
            <div className="group">
              <label>Width: {this.state.step_x} px</label>
              <input onChange={this.onWidth.bind(this)}  type="range" value={this.state.step_x}   min="0" max="300">
              </input>
            </div>
            <div className="group">
              <label>Height: {this.state.step_y} px</label>
              <input onChange={this.onHeight.bind(this)}  type="range" value={this.state.step_y}    min="0" max="300">
              </input>
            </div>
          </div>
          <div className="col">
            <div className="group">
              <label>Allow empty cell: {String(this.state.allow_use_empty)} </label>
              <input onChange={this.onAllowEmpty.bind(this)} checked={this.state.allow_use_empty} type="checkbox" value={this.state.allow_use_empty}>
              </input>
            </div>
            <div className="group">
              <button onClick={this.onAddItemRight.bind(this)} style={{width:120}}>
                Add item right
              </button>
            </div>
            <div className="group">
              <button onClick={this.onAddItemEnd.bind(this)} style={{width:120}}>
                Add on end page
              </button>
            </div>
          </div>
        </div>
        <div className="demo-outer ">
          <SortableReact/>
          <div className="edit">
            <textarea name="Text1" cols="80" rows="5" value={json_order} onChange={this.onTextArea.bind(this)}>
            </textarea>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
