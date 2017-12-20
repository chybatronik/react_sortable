import React, { Component } from 'react';
import {default_order, default_order_diff} from "../demo_data";
// import SortableReact from '../../../lib/SortableReact';
// const LibSortableReact = require('../../../../build/index.js');
import SortableReact from '../../../lib/SortableReact';

import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  sortable_mode={sortable_mode}
  stiffness={95}      //  stiffness animation option
  damping={20}        //  damping animation option
  delta={30}          //  space between items
  scale_active={0.8}  // scale item when drag
  shadow_active={1.4} // shadow item when drag
  order=[
    {
      id: "1", w:2, h:2, col:1, row:1,
      con: (
        <div>
          <a id="im1" onClick={this.onClick.bind(this)} style={style_item}>
            x
          </a>
        </div>
      ),
      style:{background:"url(im1.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:10}
    },
    ...]
/>
\`\`\`
`

const text = `
  # Item with image
  Set content of item in "con" and "style" for each items. Add callback "this.onClick.bind(this)", when click on close button.
  ${code}
`

const style_item = { cursor:"pointer", lineHeight:1.5, "float": "right", paddingRight:10, color:"black"}

class  StoreItemWithImage extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "left_right"};
    console.log("state::::", this.state)

    this.new_order = [
      {id: "1", w:2, h:2, col:1, row:1, con: (<div><a id="im1" onClick={this.onClick.bind(this)} style={style_item}>x</a></div>), style:{overflow:"hidden", background:"url(im1.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "2", w:1, h:1, col:3, row:1, con: (<div><a id="im2" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im2.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      // {id: "3", w:2, h:2, col:3, row:1, con: "3"},
      {id: "11", w:1, h:1, col:3, row:2, con: (<div><a id="im3" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im3.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      // {id: "12", w:1, h:1, col:2, row:2, con: "12"},
      {id: "21", w:1, h:1, col:1, row:3, con: (<div><a id="im4" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im4.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "22", w:1, h:1, col:2, row:3, con: (<div><a id="im5" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im5.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "23", w:1, h:1, col:3, row:3, con: (<div><a id="im6" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im6.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      // {id: "24", w:1, h:1, col:4, row:3, con: "24"},
    ]

  }

  onClick(e){
    console.log("e",String(e.target.id))
    alert("click: "+ String(e.target.id))
  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div style={{marginBottom:550}}>
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
