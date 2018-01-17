import React, { Component } from 'react';
import {default_order} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
// import SortableReact from '../../../distribute0/app.js';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  cells=[{id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},..]
/>
\`\`\`
`

const text = `
# Sortable mode
Support two mode.
${code}
`


class  StoreSortableMode extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SORT"};

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
          cells={default_order}
        />
      </div>
    )
  }
}

export default StoreSortableMode;
