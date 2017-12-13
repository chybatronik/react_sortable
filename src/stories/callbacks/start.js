import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  start={function(srt){
    console.log(JSON.stringify(srt, "", 4))
  }}
  order=[
    {id: "1", w:1, h:1, col:1, row:1, con: "1"},
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
    this.state = {mode: "swap", lastPress:"none", not_update_order: true};
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
          sortable_mode={mode}
          start={(item)=>{
            console.log("ITEM::", item)
            let lastPress = "none"
            if(item){
              lastPress = item.con
            }
            this.setState({lastPress: lastPress, not_update_order:true})
          }}
          order={default_order_diff}
          not_update_order={this.state.not_update_order}
        />
      </div>
    )
  }
}

export default StoreStart;
