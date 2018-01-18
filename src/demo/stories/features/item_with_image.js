import React, { Component } from 'react';
// import {default_order, default_order_diff} from "../demo_data";
// import SortableReact from '../../../lib/SortableReact';
// const LibSortableReact = require('../../../../build/index.js');
import SortableReact from '../../../lib/SortableReact';

import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  cells=[
    {id: "1", colspan:2, rowspan:2, defaultColumn:1, defaultRow:1, content: (<div><a id="im1" onClick={this.onClick.bind(this)} style={style_item}>x</a></div>), style:{overflow:"hidden", background:"url(im1.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
    {id: "2", colspan:1, rowspan:1, defaultColumn:3, defaultRow:1, content: (<div><a id="im2" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im2.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
    {id: "11", colspan:1, rowspan:1, defaultColumn:3, defaultRow:2, content: (<div><a id="im3" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im3.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
    {id: "21", colspan:1, rowspan:1, defaultColumn:1, defaultRow:3, content: (<div><a id="im4" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im4.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
    {id: "22", colspan:1, rowspan:1, defaultColumn:2, defaultRow:3, content: (<div><a id="im5" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im5.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
    {id: "23", colspan:1, rowspan:1, defaultColumn:3, defaultRow:3, content: (<div><a id="im6" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im6.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
  ]
  stiffness={95}      //  stiffness animation option (more about this param in animation section)
  damping={20}        //  damping animation option (more about this param in animation section)
  cellSpacing={30}          //  space between items (more about this param in animation section)
  scaleActiveCell={0.8}  // scale item when drag (more about this param in animation section)
  shadowActiveCell={84} // shadow item when drag (more about this param in animation section)
/>
\`\`\`
`

const text = `
  #
  Set content of item in "content" and "style" for each items. Add callback "this.onClick.bind(this)", when click on close button.
  ${code}
`

const style_item = { cursor:"pointer", lineHeight:1.5, "float": "right", paddingRight:10, color:"black"}

class  StoreItemWithImage extends Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SORT"};
    console.log("state::::", this.state)

    this.new_order = [
      {id: "1", colspan:2, rowspan:2, defaultColumn:1, defaultRow:1, content: (<div><a id="im1" onClick={this.onClick.bind(this)} style={style_item}>x</a></div>), style:{overflow:"hidden", background:"url(im1.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "2", colspan:1, rowspan:1, defaultColumn:3, defaultRow:1, content: (<div><a id="im2" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im2.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "11", colspan:1, rowspan:1, defaultColumn:3, defaultRow:2, content: (<div><a id="im3" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im3.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "21", colspan:1, rowspan:1, defaultColumn:1, defaultRow:3, content: (<div><a id="im4" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im4.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "22", colspan:1, rowspan:1, defaultColumn:2, defaultRow:3, content: (<div><a id="im5" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im5.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
      {id: "23", colspan:1, rowspan:1, defaultColumn:3, defaultRow:3, content: (<div><a id="im6" onClick={this.onClick.bind(this)}  style={style_item}>x</a></div>), style:{background:"url(im6.jpg) no-repeat", backgroundSize:"cover", color: "white", fontSize:15}},
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
      <div>
        <h1>Item with image</h1>
        <div style={{height:450}}>
          <label>mode:</label>
          <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
            <option value="SORT">SORT</option>
            <option value="SWAP">SWAP</option>
          </select>
          <SortableReact
            mode={mode}
            stiffness={95}
            damping={20}
            cellSpacing={30}
            scaleActiveCell={0.8}
            shadowActiveCell={84}
            cells={this.new_order }
          />
        </div>
        <Markdown source={text}/>
      </div>
    )
  }
}

export default StoreItemWithImage;
