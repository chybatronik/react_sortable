import React from 'react';
import {default_order } from "../demo_data";
import SortableReact from '../../../lib/SortableReact';

// import SortableReact from '../../../source/SortableReact';
// import SortableReact from '../../../../build/index.js';

// var SortableReact = require('../../../../build/index.js');
import Markdown from 'react-markdown';

const code = `
\`\`\`js
<SortableReact
  mode={mode}
  cellWidth={cellWidth}
  cellHeight={cellHeight}
  cellSpacing={cellSpacing}
  cells=[{id: "1", colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: "1"},..]
/>
\`\`\`
`

const text = `
  # Width, height, cellSpacing
  ${code}
`


class  StoreWidthHeightDelta extends React.Component {
  constructor(props) {
    super(props)
    this.state = {mode: "SWAP", cellHeight:90, cellWidth: 90, cellSpacing: 5};

  }

  onState(e){
    console.log("onState:", e.target.value)
    this.setState({"mode": e.target.value})
  }

  onWidth(e){
    this.setState({cellWidth: parseInt(e.target.value, 10)})
  }

  onHeight(e){
    this.setState({cellHeight: parseInt(e.target.value, 10)})
  }

  onDelta(e){
    this.setState({cellSpacing: parseInt(e.target.value, 10)})
  }

  render(){
    // console.log("this.props.mode;;", this.props)
    const mode = this.state.mode
    return (
      <div style={{marginBottom:550}}>
        <Markdown source={text}/>
        <label>mode:</label>
        <select style={{width:200, "marginLeft":20}} onChange={this.onState.bind(this)}>
          <option value="SWAP">SWAP</option>
          <option value="SORT">SORT</option>
        </select>
        <label style={{marginLeft:20}}>cellWidth {this.state.cellWidth}:
          <input value={this.state.cellWidth} type="range" min={10} max={200} step={1} style={{ marginLeft:10}} onChange={this.onWidth.bind(this)}/>
        </label>
        <label style={{marginLeft:20}}>cellHeight {this.state.cellHeight}:
          <input value={this.state.cellHeight} type="range" min={10} max={200} step={1} style={{ marginLeft:10}} onChange={this.onHeight.bind(this)}/>
        </label>
        <label style={{marginLeft:20}}>cellSpacing {this.state.cellSpacing}:
          <input value={this.state.cellSpacing} type="range" min={1} max={50} step={1} style={{ marginLeft:10}} onChange={this.onDelta.bind(this)}/>
        </label>
        <SortableReact
          mode={mode}
          cellWidth={this.state.cellWidth}
          cellSpacing={this.state.cellSpacing}
          cellHeight={this.state.cellHeight}
          cells={default_order}
        />
      </div>
    )
  }
}

export default StoreWidthHeightDelta;
