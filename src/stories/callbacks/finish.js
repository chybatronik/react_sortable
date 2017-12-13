import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  finished={(item)=>{
    let lastPress = "none"
    if(item && item.lastPress){
      lastPress = item.lastPress.con
    }
    let move  = "none"
    if(item && item.last_col){
      move = \`col: \${item.last_col}, row: \${item.last_row}\`
    }
    this.setState({lastPress: lastPress, move: move})
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

const style_label = {backgroundColor:"#f1e2e7", borderRadius: 5, padding:3}

class  StoreFinish extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "swap", lastPress:"none", move: "none"};
    // console.log("state::::", this.state)
  }

  onState(e){
    // console.log("onState:", e.target.valuse)
    this.setState({"mode": e.target.value})
  }

  render(){
    console.log("this.state:::;", this.state)
    const mode = this.state.mode
    return (
      <div style={{marginBottom: 550}}>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select style={{"width":200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <h2 style={{marginTop:20}}>Drag: <span style={style_label}>{this.state.lastPress}</span>. Move to: <span style={style_label}>{this.state.move}</span></h2>
        <SortableReact
          sortable_mode={mode}
          finished={(item)=>{
            let lastPress = "none"
            if(item && item.lastPress){
              lastPress = item.lastPress.con
            }
            let move  = "none"
            if(item && item.last_col){
              move = `col: ${item.last_col}, row: ${item.last_row}`
            }
            this.setState({lastPress: lastPress, move: move})
          }}
          order={default_order_diff}
          not_update_order={true}
        />
      </div>
    )
  }
}

export default StoreFinish;
