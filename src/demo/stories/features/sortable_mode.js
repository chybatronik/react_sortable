import React, { Component } from 'react';
import {default_order} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
// import SortableReact from '../../../distribute0/app.js';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
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
      <div style={{marginBottom:0}}>
        <h1>Sortable mode</h1>
        <div style={{height:400}}>
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
        <Markdown source={text} style={{marginTop:90}} />
      </div>
    )
  }
}

export default StoreSortableMode;
