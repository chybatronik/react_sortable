import React, { Component } from 'react';
import {default_order_diff} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
import Markdown from 'react-markdown';

const code = `
Param onCellDragStart is function with one parameter. This parameter is active item.

\`\`\`js
<SortableReact
  mode={mode}
  onCellDragStart={(item)=>{
    console.log("ITEM::", item)
    let lastPress = "none"
    if(item){
      lastPress = item.content
    }
    this.setState({lastPress: lastPress, not_update_order:true})
  }}
  not_update_order={this.state.not_update_order}
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

class  StoreStart extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SWAP", lastPress:"none", not_update_order: true};
    // console.log("state::::", this.state)
  }

  onState(e){
    // console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value, not_update_order: false})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <h1>Start drag callback</h1>
        <div style={{overflow:"scroll", height:400}}>
          <h3 style={{marginTop:20}}>Drag: <span style={style_label}>{this.state.lastPress}</span>.</h3>
          <SortableReact
            mode={mode}
            onCellDragStart={(item)=>{
              console.log("ITEM::", item)
              let lastPress = "none"
              if(item){
                lastPress = item.content
              }
              this.setState({lastPress: lastPress, not_update_order:true})
            }}
            cells={default_order_diff}
            not_update_order={this.state.not_update_order}
          />
        </div>
        <Markdown source={text}/>
      </div>
    )
  }
}

export default StoreStart;
