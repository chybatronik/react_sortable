import React, { Component } from 'react';
import {default_order_diff} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  onCellDrop={(item)=>{
    let lastPress = "none"
    if(item && item.lastPress){
      lastPress = item.lastPress.content
    }
    let move  = "none"
    if(item && item.last_col){
      move = \`col: \${item.last_col}, row: \${item.last_row}\`
    }
    this.setState({lastPress: lastPress, move: move})
  }}
  cells=[
    {id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"}
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
    this.state = {mode: "SWAP", lastPress:"none", move: "none"};
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
        <label>mode:</label>
        <select style={{"width":200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="SWAP">SWAP</option>
          <option value="SORT">SORT</option>
        </select>
        <h2 style={{marginTop:20}}>Drag: <span style={style_label}>{this.state.lastPress}</span>. Move to: <span style={style_label}>{this.state.move}</span></h2>
        <SortableReact
          mode={mode}
          onCellDrop={(item)=>{
            let lastPress = "none"
            if(item && item.lastPress){
              lastPress = item.lastPress.content
            }
            let move  = "none"
            if(item && item.last_col){
              move = `col: ${item.last_col}, row: ${item.last_row}`
            }
            this.setState({lastPress: lastPress, move: move})
          }}
          cells={default_order_diff}
          not_update_order={true}
        />
      </div>
    )
  }
}

export default StoreFinish;
