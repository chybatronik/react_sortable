import React, { Component } from 'react';
import {default_order } from "../demo_data";
// const LibSortableReact = require('../../../../build/index.js');
import SortableReact from '../../../lib/SortableReact';


import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  stiffness={stiffness}
  damping={damping}
  cells=[{id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},..]
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
    this.state = {mode: "SORT", stiffness:88, damping:10};
  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  onStiffness(e){
    this.setState({"stiffness": parseInt(e.target.value, 10)})
  }

  onDamping(e){
    this.setState({"damping": parseInt(e.target.value, 10)})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div style={{marginBottom:550}}>
        <Markdown source={text}/>
        <label>mode:</label>
        <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="SORT">SORT</option>
          <option value="SWAP">SWAP</option>
        </select>
        <label style={{marginLeft:20}}>stiffness {this.state.stiffness}:
          <input value={this.state.stiffness} type="range" min={1} max={500} step={1} style={{ marginLeft:10}} onChange={this.onStiffness.bind(this)}/>
        </label>
        <label style={{marginLeft:20}}>damping {this.state.damping}:
          <input value={this.state.damping} type="range" min={1} max={100} step={1} style={{ marginLeft:10}} onChange={this.onDamping.bind(this)}/>
        </label>
        <SortableReact
          mode={mode}
          stiffness={this.state.stiffness}
          damping={this.state.damping}
          cells={default_order}
        />
      </div>
    )
  }
}

export default StoreAnimation;
