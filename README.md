# react-sortable

Sortable component for React.js.
### [Demo]

###  Swap mode
![](https://chybatronik.github.io/react_sortable/img/simple.gif)


### Left right mode
![](https://chybatronik.github.io/react_sortable/img/with_images.gif)

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
$ npm i --save react react-motion
```

Add files to your folder ./src/Sortable.js, ./src/SortableReact.js, ./src/utils.js, ./src/SortableReact.css.

Import SortableReact component:

```javascript
import SortableReact from './SortableReact';
```

Use SortableReact component:

```javascript
<SortableReact
  width=90
  height=90
  delta=10
  sortable_mode="swap"
  order=[{id: 1, w:1, h:1, col:1, row:1, con: (<h1>Hello</h1>), style:{backgroundColor:"green"}}]
/>
```

## Options
SortableReact has option order. It's array of dictionaries.

```javascript
order=[
  {
    id: 1,   // identifier of item unique
    w:1,     // width of item, width of item eq w*width
    h:1,     // height of item, height of item eq h*height
    col:1,   // column
    row:1,   // row
    con: (<h1>Hello World</h1>), // content  of item
    style: {{backgroundColor:"red"}} //style of item
  }
]
```

Default props:

```javascript
SortableReact.defaultProps = {
  sortable_mode: "swap", //set sortable mode: "swap" or "left_right"
  width: 90,              // set width item
  height: 90,             // set height item
  delta: 10,              // set distance between items
  order: default_order,   // array of items with options
  stiffness: 300,         // set stiffness for animations
  damping: 50,            // set damping for animations
  scale_active:1.2,       //when drag item to scale
  shadow_active:1.2       //when drag item to shadow
}
```

Types of props:

```javascript
SortableReact.propTypes = {
  sortable_mode: PropTypes.oneOf(["swap", "left_right"]),
  order: PropTypes.arrayOf(PropTypes.shape({
     id: PropTypes.string.isRequired,
     w: PropTypes.number.isRequired,
     h: PropTypes.number.isRequired,
     col: PropTypes.number.isRequired,
     row: PropTypes.number.isRequired,
     con: PropTypes.string.isRequired,
   })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  delta: PropTypes.number,
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  scale_active: PropTypes.number,
  shadow_active: PropTypes.number,
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
$ npm run-script start
```

Then open http://localhost:3000 as local file in your browser.

License
----

MIT

[//]: #

[Demo]: <https://chybatronik.github.io/react_sortable/storybook-static/?selectedKind=Welcome&selectedStory=guide&full=0&down=0&left=1&panelRight=0&downPanel=storybooks%2Fstorybook-addon-knobs>
