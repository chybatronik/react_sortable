# react_sortable

Sortable component for React.js.
### [Demo]

### SORT mode
![](https://chybatronik.github.io/react_sortable/img/ezgif.com-optimize.gif)

###  SWAP mode
![](https://chybatronik.github.io/react_sortable/img/screencast2.gif)


## Supports:

- multi rows and cols,
- size of item,
- two sortable mode,
- drag and drop with touching,
- different content and style of item
- animations,
- dynamic resize items (comming soon)

## Usage

Install packages in your project:

```sh
$ npm i --save react react-motion develexe-sortable
```

Add files to your folder ./src/SortableReact.js, ./src/SortableReact.css.

Import SortableReact component:

```javascript
import SortableReact from './SortableReact';
```

Use SortableReact component:

```javascript
<SortableReact
  cellWidth=90
  cellHeight=90
  cellSpacing=10
  mode="SWAP"
  cells=[{id: 1, colspan:1, rowspan:1, defaultColumn:1, defaultRow:1, content: (<h1>Hello</h1>), style:{backgroundColor:"green"}}]
/>
```

## Options
SortableReact has option order. It's array of dictionaries.

```javascript
order=[
  {
    id: 1,   // identifier of item unique
    colspan:1,     // width of item, width of item eq w*width
    rowspan:1,     // height of item, height of item eq h*height
    defaultColumn:1,   // column
    defaultRow:1,   // row
    content: (<h1>Hello World</h1>), // content  of item
    style: {{backgroundColor:"red"}} //style of item
  }
]
```

Default props:

```javascript
SortableReact.defaultProps = {
  mode: "SWAP", //set sortable mode: "swap" or "left_right"
  cellWidth: 90,              // set width item
  cellHeight: 90,             // set height item
  cellSpacing: 10,              // set distance between items
  cells: default_order,   // array of items with options
  stiffness: 300,         // set stiffness for animations
  damping: 50,            // set damping for animations
  scaleActiveCell:1.2,       //when drag item to scale
  shadowActiveCell:1.2       //when drag item to shadow
}
```

Types of props:

```javascript
SortableReact.propTypes = {
  mode: PropTypes.oneOf(["SWAP", "SORT"]),
  cells: PropTypes.arrayOf(PropTypes.shape({
     id: PropTypes.string.isRequired,
     colspan: PropTypes.number.isRequired,
     rowspan: PropTypes.number.isRequired,
     defaultColumn: PropTypes.number.isRequired,
     defaultRow: PropTypes.number.isRequired,
     content: PropTypes.string.isRequired,
     styles: PropTypes.string.isRequired,
   })).isRequired,
  cellWidth: PropTypes.number,
  cellHeight: PropTypes.number,
  cellSpacing: PropTypes.number,
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  scaleActiveCell: PropTypes.number,
  shadowActiveCell: PropTypes.number,
}
```

## To run demo locally

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

For build
```sh
$ npm build
```
Then open http://localhost:3000 as local file in your browser.

License
----

MIT

[//]: #

[Demo]: <https://chybatronik.github.io/react_sortable/build/>
