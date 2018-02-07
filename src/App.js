import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink as Link
} from 'react-router-dom'

import StoreSortableMode from './demo/stories/features/sortable_mode';
import StoreDiferentSize from './demo/stories/features/diferent_size';
import StoreItemWithImage from './demo/stories/features/item_with_image';

import StoreWidthHeightDelta from './demo/stories/options_items/width_height_delta';
import StoreAllowDropReadOnly from './demo/stories/options_items/allow_to_drop_readonly';
import StoreAnimation from './demo/stories/options_items/animation';

import StoreFinish from './demo/stories/callbacks/finish';
import StoreStart from './demo/stories/callbacks/start';

import './lib/SortableReact.css';
import './Markdown.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div  className="wrapper">
          <div className="content">
            <Route exact path='/react_sortable/build/' component={StoreSortableMode}/>
            <Route path='/react_sortable/build/size'  component={StoreDiferentSize}/>
            <Route path='/react_sortable/build/image'  component={StoreItemWithImage}/>

            <Route path="/react_sortable/build/width_height" component={StoreWidthHeightDelta}/>
            <Route path="/react_sortable/build/allow" component={StoreAllowDropReadOnly}/>
            <Route path="/react_sortable/build/animation" component={StoreAnimation}/>

            <Route path="/react_sortable/build/finish" component={StoreFinish}/>
            <Route path="/react_sortable/build/start" component={StoreStart}/>
          </div>
          <div className="sidebar">
            <a href="https://github.com/chybatronik/react_sortable" className="main_title">react_sortable</a>
            <p className="title">Features</p>
            <ul>
              <li><Link exact to="/react_sortable/build/">sortable mode</Link></li>
              <li><Link to="/react_sortable/build/size">diferent size</Link></li>
              <li><Link to="/react_sortable/build/image">item with image</Link></li>
            </ul>
            <p className="title">Options</p>
            <ul>
              <li><Link to="/react_sortable/build/width_height">width and height</Link></li>
              <li><Link to="/react_sortable/build/allow">allow to drop on empty, locked grid</Link></li>
              <li><Link to="/react_sortable/build/animation">animation</Link></li>
            </ul>
            <p className="title">Callbacks</p>
            <ul>
              <li><Link to="/react_sortable/build/finish">finish drop</Link></li>
              <li><Link to="/react_sortable/build/start">start drag</Link></li>
            </ul>
          </div>
        </div>
      </Router>
  )
}
}


export default App;
