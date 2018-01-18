import React, { Component } from 'react';
import {default_order} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  isDropOnEmptyAreaAllowed={this.state.isDropOnEmptyAreaAllowed}
  isGridLocked={this.state.isGridLocked}
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


class  StoreAllowDropReadOnly extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SORT", isDropOnEmptyAreaAllowed:false, isGridLocked:false};

  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  onAllowToEmpty(e){
    console.log("e.target.value:", !this.state.isDropOnEmptyAreaAllowed)
    this.setState({"isDropOnEmptyAreaAllowed": !this.state.isDropOnEmptyAreaAllowed})
  }

  onDisableDrag(){
    this.setState({"isGridLocked": !this.state.isGridLocked})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <h1>Allow to drop empty cell. Locked grid.</h1>
        <div style={{overflow:"scroll", height:450}}>
          <label>mode:</label>
          <select
            style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
            <option value="SORT">SORT</option>
            <option value="SWAP">SWAP</option>
          </select>
          <label style={{marginLeft:40}}>isDropOnEmptyAreaAllowed:
            <input type="checkbox"  style={{marginLeft:5}} onChange={this.onAllowToEmpty.bind(this)} checked={this.state.isDropOnEmptyAreaAllowed}/>
          </label>
          <label style={{marginLeft:40}}>isGridLocked:
            <input type="checkbox" style={{marginLeft:5}} onChange={this.onDisableDrag.bind(this)} checked={this.state.isGridLocked}/>
          </label>
          <SortableReact
            mode={mode}
            isDropOnEmptyAreaAllowed={this.state.isDropOnEmptyAreaAllowed}
            isGridLocked={this.state.isGridLocked}
            cells={default_order}
          />
        </div>
        <Markdown source={text}/>
      </div>
    )
  }
}

export default StoreAllowDropReadOnly;
