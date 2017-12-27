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
  cells=[{id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},..]
/>
\`\`\`
`

const text = `
  # Allow to drop empty cell. Readonly
  ${code}
`


class  StoreAllowDropReadOnly extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SWAP", isDropOnEmptyAreaAllowed:false, isGridLocked:false};

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
      <div style={{marginBottom:550}}>
        <Markdown source={text}/>
        <label>mode:</label>
        <select
          style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="SWAP">SWAP</option>
          <option value="SORT">SORT</option>
        </select>
        <label style={{marginLeft:20}}>isDropOnEmptyAreaAllowed= {String(this.state.isDropOnEmptyAreaAllowed)}:
          <input type="checkbox" onChange={this.onAllowToEmpty.bind(this)} checked={this.state.isDropOnEmptyAreaAllowed}/>
        </label>
        <label style={{marginLeft:20}}>isGridLocked= {String(this.state.isGridLocked)}:
          <input type="checkbox" onChange={this.onDisableDrag.bind(this)} checked={this.state.isGridLocked}/>
        </label>
        <SortableReact
          mode={mode}
          isDropOnEmptyAreaAllowed={this.state.isDropOnEmptyAreaAllowed}
          isGridLocked={this.state.isGridLocked}
          cells={default_order}
        />
      </div>
    )
  }
}

export default StoreAllowDropReadOnly;
