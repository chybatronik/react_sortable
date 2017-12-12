import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  finished={function(srt){
    alert(JSON.stringify(srt, "", 4))
  }}
  order=[
    {id: "1", w:1, h:1, col:1, row:1, con: "1"}
    ...]
/>
\`\`\`
`

const text = `
  # Finish drop callback
  ${code}
`

class  StoreFinish extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "swap"};
    // console.log("state::::", this.state)
  }

  onState(e){
    // console.log("onState:", e.target.valuse)
    this.setState({"mode": e.target.value})
  }

  my_alert(srt){
    // alert(JSON.stringify(srt, "", 4))
    console.log("SRT:::", srt)
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div style={{"marginBottom":"550"}}>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select style={{"width":200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <h2 style={{marginTop:20}}>Drag: {1+1}. Move to: {4-2}</h2>
        <SortableReact
          sortable_mode={mode}
          finished={this.my_alert.bind(this)}
          order={default_order_diff}
        />
      </div>
    )
  }
}

export default StoreFinish;
