import React, { Component } from 'react';
import {default_order } from "../demo_data";
// const LibSortableReact = require('../../../../build/index.js');
import SortableReact from '../../../lib/SortableReact';


import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  stiffness={stiffness}               //  stiffness animation option
  damping={damping}                   //  damping animation option
  scaleActiveCell={scaleActiveCell}   // scale item when drag
  shadowActiveCell={shadowActiveCell} // shadow item when drag
  cells=[
    {id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},
    {id: "2", colspan:1, rowspan:1, defaultColumn:2, defaultRow:1, content: "2"},
    {id: "3", colspan:1, rowspan:1, defaultColumn:3, defaultRow:1, content: "3"},
    {id: "4", colspan:1, rowspan:1, defaultColumn:4, defaultRow:1, content: "4"},
    {id: "11", colspan:1, rowspan:1, defaultColumn:1, defaultRow:2, content: "11"},
    {id: "12", colspan:1, rowspan:1, defaultColumn:2, defaultRow:2, content: "12"},
    {id: "13", colspan:1, rowspan:1, defaultColumn:3, defaultRow:2, content: "13"},
    {id: "14", colspan:1, rowspan:1, defaultColumn:4, defaultRow:2, content: "14"},
    {id: "21", colspan:1, rowspan:1, defaultColumn:1, defaultRow:3, content: "21"},
    {id: "22", colspan:1, rowspan:1, defaultColumn:2, defaultRow:3, content: "22"},
    {id: "23", colspan:1, rowspan:1, defaultColumn:3, defaultRow:3, content: "23"},
    {id: "24", colspan:1, rowspan:1, defaultColumn:4, defaultRow:3, content: "24"}
  ]
/>
\`\`\`
`

const text = `
  #
  ${code}
`


class  StoreAnimation extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SORT", stiffness:88, damping:10, scaleActiveCell:0.8, shadowActiveCell:84};
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

  onScaleActiveCell(e){
    this.setState({"scaleActiveCell": parseFloat(e.target.value)})
  }

  onShadowActiveCell(e){
    this.setState({"shadowActiveCell": parseFloat(e.target.value)})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <h1>Animation</h1>
        <div style={{overflow:"scroll", height:450}}>
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
          <br />
          <br />
          <label>scaleActiveCell {this.state.scaleActiveCell}:
            <input value={this.state.scaleActiveCell} type="range" min={0} max={2} step={0.1} style={{ marginLeft:10}} onChange={this.onScaleActiveCell.bind(this)}/>
          </label>
          <label style={{marginLeft:20}}>shadowActiveCell {this.state.shadowActiveCell}:
            <input value={this.state.shadowActiveCell} type="range" min={0} max={100} step={1} style={{ marginLeft:10}} onChange={this.onShadowActiveCell.bind(this)}/>
          </label>
          <SortableReact
            mode={mode}
            stiffness={this.state.stiffness}
            damping={this.state.damping}
            scaleActiveCell={this.state.scaleActiveCell}
            shadowActiveCell={this.state.shadowActiveCell}
            cells={default_order}
          />
        </div>
        <Markdown source={text}/>
      </div>
    )
  }
}

export default StoreAnimation;
