import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { Button, Welcome } from '@storybook/react/demo';

import SortableReact from '../SortableReact';

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
const default_order = [
  {id: 1, w:1, h:1, col:1, row:1, con: "1"},
  {id: 2, w:1, h:1, col:2, row:1, con: "2"},
  {id: 3, w:1, h:1, col:3, row:1, con: "3"},
  {id: 4, w:1, h:1, col:4, row:1, con: "4"},
  {id: 11, w:1, h:1, col:1, row:2, con: "11"},
  {id: 12, w:1, h:1, col:2, row:2, con: "12"},
  {id: 13, w:1, h:1, col:3, row:2, con: "13"},
  {id: 14, w:1, h:1, col:4, row:2, con: "14"},
  {id: 21, w:1, h:1, col:1, row:3, con: "21"},
  {id: 22, w:1, h:1, col:2, row:3, con: "22"},
  {id: 23, w:1, h:1, col:3, row:3, con: "23"},
  {id: 24, w:1, h:1, col:4, row:3, con: "24"}
]

const default_order_diff = [
  {id: 1, w:1, h:1, col:1, row:1, con: "1"},
  {id: 2, w:1, h:1, col:2, row:1, con: "2"},
  {id: 3, w:2, h:2, col:3, row:1, con: "3"},
  {id: 11, w:1, h:1, col:1, row:2, con: "11"},
  {id: 12, w:1, h:1, col:2, row:2, con: "12"},
  {id: 21, w:1, h:1, col:1, row:3, con: "21"},
  {id: 22, w:1, h:1, col:2, row:3, con: "22"},
  {id: 23, w:1, h:1, col:3, row:3, con: "23"},
  {id: 24, w:1, h:1, col:4, row:3, con: "24"},
  // {id: 25, w:1, h:1, col:5, row:3, con: "25"}
]

storiesOf('different mode', module)
  .add('swipe', () => <SortableReact sortable_mode="swipe" order={default_order}/>)
  .add('left right', () => <SortableReact sortable_mode="left_right"  order={default_order}/>);

storiesOf('diferent size item', module)
  .add('swipe', () => <SortableReact sortable_mode="swipe" order={default_order_diff}/>)
  .add('left right', () => <SortableReact sortable_mode="left_right"  order={default_order_diff}/>);

storiesOf('change width, height items', module)
  .addDecorator(withKnobs)
  .add('swipe', () => {
    const width = number("width", 80)
    const height = number("height", 40)
    return (<SortableReact width={width} height={height} sortable_mode="swipe" order={default_order_diff}/>)
  })
  .add('left right', () => {
    const width = number("width", 120)
    const height = number("height", 120)
    return (<SortableReact sortable_mode="left_right"  width={width} height={height}  order={default_order_diff}/>)
  });

storiesOf('change delta between items', module)
  .addDecorator(withKnobs)
  .add('swipe', () => {
    const delta = number("delta", 30)
    return (<SortableReact sortable_mode="swipe" delta={delta} order={default_order_diff}/>)
  })
  .add('left right', () =>{
    const delta = number("delta", 30)
    return (<SortableReact sortable_mode="left_right" delta={delta}  order={default_order_diff}/>)
  });

storiesOf('change animation', module)
  .addDecorator(withKnobs)
  .add('swipe', () =>{
    const stiffness = number("stiffness", 400)
    const damping = number("damping", 15)
    return (<SortableReact sortable_mode="swipe" damping={damping} stiffness={stiffness} order={default_order_diff}/>)
  })
  .add('left right', () =>{
    const stiffness = number("stiffness", 75)
    const damping = number("damping", 5)
    return (<SortableReact sortable_mode="left_right"  damping={damping} stiffness={stiffness}  order={default_order_diff}/>)
  });
