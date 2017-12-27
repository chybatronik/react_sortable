import React, { Component } from 'react';
import {default_order_diff} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  cells=[
    {id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},
    {id: "3", colspan:1, rowspan:1, defaultColumn:3, defaultRow:1, content: "3"},
    ...]
/>
\`\`\`
`

const text = `
  # Different size
  Size of item set in cells array.
  ###### colspan - width of item, width of item eq colspan * cellWidth.
  ###### rowspan - height of item, height of item eq rowspan * cellHeight.
  ###### defaultColumn -  column.
  ###### defaultRow -  row.
  ${code}
`

class  StoreDiferentSize extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SORT"};
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
      <div style={{marginBottom:550}}>
        <Markdown source={text}/>
        <label>mode:</label>
        <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="SORT">SORT</option>
          <option value="SWAP">SWAP</option>
        </select>
        <SortableReact
          mode={mode}
          cells={default_order_diff}
        />
      </div>
    )
  }
}

export default StoreDiferentSize;
