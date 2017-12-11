import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  width={width}
  height={height}
  delta={delta}
  order=[{id: "1", w:1, h:1, col:1, row:1, con: "1"},..]
/>
\`\`\`
`

const text = `
  # Width, height, delta
  ${code}
`


class  StoreWidthHeightDelta extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "swap", height:90, width: 90, delta: 5};

  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  onWidth(e){
    this.setState({width: parseInt(e.target.value)})
  }

  onHeight(e){
    this.setState({height: parseInt(e.target.value)})
  }

  onDelta(e){
    this.setState({delta: parseInt(e.target.value)})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div style={{marginBottom:550}}>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <label style={{marginLeft:20}}>width {this.state.width}:
          <input value={this.state.width} type="range" min={10} max={200} step={1} style={{ marginLeft:10}} onChange={this.onWidth.bind(this)}/>
        </label>
        <label style={{marginLeft:20}}>height {this.state.height}:
          <input value={this.state.height} type="range" min={10} max={200} step={1} style={{ marginLeft:10}} onChange={this.onHeight.bind(this)}/>
        </label>
        <label style={{marginLeft:20}}>delta {this.state.delta}:
          <input value={this.state.delta} type="range" min={1} max={50} step={1} style={{ marginLeft:10}} onChange={this.onDelta.bind(this)}/>
        </label>
        <SortableReact
          sortable_mode={mode}
          width={this.state.width}
          delta={this.state.delta}
          height={this.state.height}
          order={default_order}
        />
      </div>
    )
  }
}

export default StoreWidthHeightDelta;
