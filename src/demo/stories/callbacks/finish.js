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
    {id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},
    {id: "2", colspan:1, rowspan:1, defaultColumn:2, defaultRow:1, content: "2"},
    {id: "3", colspan:2, rowspan:2, defaultColumn:3, defaultRow:1, content: "3"},
    {id: "11", colspan:1, rowspan:1, defaultColumn:1, defaultRow:2, content: "11"},
    {id: "12", colspan:1, rowspan:1, defaultColumn:2, defaultRow:2, content: "12"},
    {id: "21", colspan:1, rowspan:1, defaultColumn:1, defaultRow:3, content: "21"},
    {id: "22", colspan:1, rowspan:1, defaultColumn:2, defaultRow:3, content: "22"},
    {id: "23", colspan:1, rowspan:1, defaultColumn:3, defaultRow:3, content: "23"},
    {id: "24", colspan:1, rowspan:1, defaultColumn:4, defaultRow:3, content: "24"},
  ]
/>
\`\`\`
`

const text = `
  #
  ${code}
`

const style_label = {backgroundColor:"#f1e2e7", borderRadius: 5, padding:3}

class  StoreFinish extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SORT", lastPress:"none", move: "none"};
    // console.log("state::::", this.state)
  }

  onState(e){
    // console.log("onState:", e.target.valuse)
    this.setState({"mode": e.target.value})
  }

  render(){
    // console.log("this.state:::;", this.state)
    const mode = this.state.mode
    return (
      <div>
        <h1>Finish drop callback</h1>
        <div style={{overflow:"scroll", height:450}}>
          <label>mode:</label>
          <select style={{"width":200, "marginLeft":20}} onChange={this.onState.bind(this)}>
            <option value="SORT">SORT</option>
            <option value="SWAP">SWAP</option>
          </select>
          <h3 style={{marginTop:20}}>Drag: <span style={style_label}>{this.state.lastPress}</span>. Move to: <span style={style_label}>{this.state.move}</span></h3>
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
        <Markdown source={text}/>
      </div>
    )
  }
}

export default StoreFinish;
