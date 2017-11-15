import React, { Component } from 'react';

class Readme extends Component {
  render(){
    return (
      <div style={{margin:20, padding: 20}}>
        <h1> SortableReact</h1>

        <p>React.js sortable component.</p>

        <h2>Supports:</h2>
        <ul>
          <li>
             Multi rows and cols,
          </li>
          <li>
            drag and drop with touching,
          </li>
          <li>
            animations with drap,
          </li>
          <li>
            resize items (comming soon),
          </li>
          <li>
            settings of cols and rows (comming soon).
          </li>
        </ul>
        <h3>To run demo locally:</h3>


        ```sh
        $ git clone https://github.com/chybatronik/react_sortable.git
        ```
        Then cd into react_sortable
        ```sh
        $ npm install
        ```
        Then
        ```sh
        $ npm start
        ```

        Then open http://localhost:3000 as local file in your browser.

        License
        ----

        MIT

      </div>
    )
  }
}

export default Readme;
