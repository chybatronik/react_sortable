# SortableReact

Sortable component for React.js.

**Supports:**

- Multi rows and cols,
- drag and drop with touching,
- animations with drap,
- resize items (comming soon),
- settings of cols and rows (comming soon).

## Usage

```javascript
<SortableReact width=90 height=90 delta=10 sortable_mode="swipe" order=[{id: 1, w:1, h:1, col:1, row:1, con: "1"}]/>
```

## Options

```javascript
SortableReact.defaultProps = {
  sortable_mode: "swipe",
  width: 90,
  height: 90,
  delta: 10,
  order: default_order,
  stiffness: 300,
  damping: 50,
  scale_active:1.2,
  shadow_active:1.2
}

SortableReact.propTypes = {
  sortable_mode: PropTypes.oneOf(["swipe", "left_right"]),
  order: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  delta: PropTypes.number,
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  scale_active: PropTypes.number,
  shadow_active: PropTypes.number,
}
```

#### [Demo]


**To run demo locally:**


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

[//]: #

[Demo and usage]: <https://chybatronik.github.io/react_sortable/storybook-static>
