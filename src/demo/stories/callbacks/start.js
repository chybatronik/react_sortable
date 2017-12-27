import React, { Component } from 'react';
import {default_order_diff} from "../demo_data";
import SortableReact from '../../../lib/SortableReact';
import Markdown from 'react-markdown';

const code = `
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
    ...]
/>
\`\`\`
`

const text = `
  # Start drag callback
  ${code}
`

const style_label = {backgroundColor:"#f1e2e7", borderRadius: 5, padding:3}

class  StoreStart extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SWAP", lastPress:"none", not_update_order: true};
    console.log("state::::", this.state)
  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value, not_update_order: false})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div  style={{marginBottom:550}}>
        <Markdown source={text}/>
        <h2 style={{marginTop:20}}>Drag: <span style={style_label}>{this.state.lastPress}</span>.</h2>
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
    )
  }
}

export default StoreStart;
