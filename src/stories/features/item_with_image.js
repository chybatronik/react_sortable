import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
import SortableReact from '../../SortableReact';
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  stiffness={95}
  damping={20}
  delta={30}
  scale_active={0.8}
  shadow_active={1.4}
  order=[
    {id: "1", w:2, h:2, col:1, row:1, con: "1",
    style:{background:"url(im1.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
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
    this.state = {mode: "left_right"};
    console.log("state::::", this.state)
    // let new_order = []
    // const default_order_diff2 = default_order_diff.clone()
    // default_order_diff2.forEach((item)=>{
    //   item.style = {background:"url(favicon.ico) no-repeat", backgroundSize:"100%", color: "white", fontSize:40}
    //   new_order.push(item)
    // })
    this.new_order = [
      {id: "1", w:2, h:2, col:1, row:1, con: "1", style:{background:"url(im1.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
      {id: "2", w:1, h:1, col:3, row:1, con: "2", style:{background:"url(im2.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
      // {id: "3", w:2, h:2, col:3, row:1, con: "3"},
      {id: "11", w:1, h:1, col:3, row:2, con: "11", style:{background:"url(im3.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
      // {id: "12", w:1, h:1, col:2, row:2, con: "12"},
      {id: "21", w:1, h:1, col:1, row:3, con: "21", style:{background:"url(im4.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
      {id: "22", w:1, h:1, col:2, row:3, con: "22", style:{background:"url(im5.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
      {id: "23", w:1, h:1, col:3, row:3, con: "23", style:{background:"url(im6.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}},
      // {id: "24", w:1, h:1, col:4, row:3, con: "24"},
    ]

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
          <option value="left_right">left_right</option>
          <option value="swap">swap</option>
        </select>
        <SortableReact
          sortable_mode={mode}
          stiffness={95}
          damping={20}
          delta={30}
          scale_active={0.8}
          shadow_active={1.4}
          order={this.new_order }
        />
      </div>
    )
  }
}

export default StoreItemWithImage;
