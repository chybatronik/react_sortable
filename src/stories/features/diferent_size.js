import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  order=[
    {id: "1", w:1, h:1, col:1, row:1, con: "1"},
    {id: "3", w:1, h:1, col:3, row:1, con: "3"},
    ...]
/>
\`\`\`
`

const text = `
  # Different size
  ${code}
`

class  StoreDiferentSize extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "swap"};
    console.log("state::::", this.state)
  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select style={{width:200, "margin-left":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <SortableReact
          sortable_mode={mode}
          order={default_order_diff}
        />
      </div>
    )
  }
}

export default StoreDiferentSize;
