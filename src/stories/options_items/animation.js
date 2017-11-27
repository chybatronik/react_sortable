import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  stiffness={stiffness}
  damping={damping}
  order=[{id: "1", w:1, h:1, col:1, row:1, con: "1"},..]
/>
\`\`\`
`

const text = `
  # Animation
  ${code}
`


class  StoreAnimation extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "swap", stiffness:88, damping:10};
  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  onStiffness(e){
    this.setState({"stiffness": parseInt(e.target.value)})
  }

  onDamping(e){
    this.setState({"damping": parseInt(e.target.value)})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <label style={{marginLeft:20}}>stiffness {this.state.stiffness}:
          <input value={this.state.stiffness} type="range" min={1} max={500} step={1} style={{ marginLeft:10}} onChange={this.onStiffness.bind(this)}/>
        </label>
        <label style={{marginLeft:20}}>damping {this.state.damping}:
          <input value={this.state.damping} type="range" min={1} max={100} step={1} style={{ marginLeft:10}} onChange={this.onDamping.bind(this)}/>
        </label>
        <SortableReact
          sortable_mode={mode}
          stiffness={this.state.stiffness}
          damping={this.state.damping}
          order={default_order}
        />
      </div>
    )
  }
}

export default StoreAnimation;
