import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  order=[
    {id: "1", w:1, h:1, col:1, row:1, con: "1",
      style = {
        background:"url(favicon.ico) no-repeat",
        backgroundSize:"100%",
        color: "white",
        fontSize:40
      }
    },
    ...]
/>
\`\`\`
`

const text = `
  # Item with image
  ${code}
`

class  StoreItemWithImage extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "swap"};
    console.log("state::::", this.state)
    let new_order = []
    const default_order_diff2 = default_order_diff.clone()
    default_order_diff2.forEach((item)=>{
      item.style = {background:"url(favicon.ico) no-repeat", backgroundSize:"100%", color: "white", fontSize:40}
      new_order.push(item)
    })
    this.new_order = new_order
  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div>
        <Markdown source={text}/>
        <label>sortable_mode:</label>
        <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="swap">swap</option>
          <option value="left_right">left_right</option>
        </select>
        <SortableReact
          sortable_mode={mode}
          order={this.new_order }
        />
      </div>
    )
  }
}

export default StoreItemWithImage;
