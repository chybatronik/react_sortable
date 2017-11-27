import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  allow_use_empty={this.state.allow_use_empty}
  disable_drag={this.state.disable_drag}
  order=[{id: "1", w:1, h:1, col:1, row:1, con: "1"},..]
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
    this.state = {mode: "swap", allow_use_empty:false, disable_drag:false};

  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  onAllowToEmpty(e){
    console.log("e.target.value:", !this.state.allow_use_empty)
    this.setState({"allow_use_empty": !this.state.allow_use_empty})
  }

  onDisableDrag(){
    this.setState({"disable_drag": !this.state.disable_drag})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select
          style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <label style={{marginLeft:20}}>allow_use_empty= {String(this.state.allow_use_empty)}:
          <input type="checkbox" onChange={this.onAllowToEmpty.bind(this)} checked={this.state.allow_use_empty}/>
        </label>
        <label style={{marginLeft:20}}>disable_drag= {String(this.state.disable_drag)}:
          <input type="checkbox" onChange={this.onDisableDrag.bind(this)} checked={this.state.disable_drag}/>
        </label>
        <SortableReact
          sortable_mode={mode}
          allow_use_empty={this.state.allow_use_empty}
          disable_drag={this.state.disable_drag}
          order={default_order}
        />
      </div>
    )
  }
}

export default StoreAllowDropReadOnly;
