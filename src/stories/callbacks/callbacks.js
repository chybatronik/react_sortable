import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import SortableReact from '../../SortableReact';

const default_order = [
  {id: "1", w:1, h:1, col:1, row:1, con: "1"},
  {id: "2", w:1, h:1, col:2, row:1, con: "2"},
  {id: "3", w:1, h:1, col:3, row:1, con: "3"},
  {id: "4", w:1, h:1, col:4, row:1, con: "4"},
  {id: "11", w:1, h:1, col:1, row:2, con: "11"},
  {id: "12", w:1, h:1, col:2, row:2, con: "12"},
  {id: "13", w:1, h:1, col:3, row:2, con: "13"},
  {id: "14", w:1, h:1, col:4, row:2, con: "14"},
  {id: "21", w:1, h:1, col:1, row:3, con: "21"},
  {id: "22", w:1, h:1, col:2, row:3, con: "22"},
  {id: "23", w:1, h:1, col:3, row:3, con: "23"},
  {id: "24", w:1, h:1, col:4, row:3, con: "24"}
]

const default_order_diff = [
  {id: "1", w:1, h:1, col:1, row:1, con: "1"},
  {id: "2", w:1, h:1, col:2, row:1, con: "2"},
  {id: "3", w:2, h:2, col:3, row:1, con: "3"},
  {id: "11", w:1, h:1, col:1, row:2, con: "11"},
  {id: "12", w:1, h:1, col:2, row:2, con: "12"},
  {id: "21", w:1, h:1, col:1, row:3, con: "21"},
  {id: "22", w:1, h:1, col:2, row:3, con: "22"},
  {id: "23", w:1, h:1, col:3, row:3, con: "23"},
  {id: "24", w:1, h:1, col:4, row:3, con: "24"},
]

storiesOf('callbacks', module)
  .addDecorator(withKnobs)
  .add('finished sort',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () =>{
        const my_alert = function(srt){
          alert(JSON.stringify(srt, "", 4))
        }
        return (<SortableReact
          sortable_mode="swap"
          finished={my_alert}
          order={default_order_diff}
        />)
      }
    )
  )
  .add('start sort',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () =>{
        const my_alert_start = function(srt){
          console.log(srt)
        }
        return (<SortableReact
          sortable_mode="swap"
          start={my_alert_start}
          order={default_order_diff}
        />)
      }
    )
  )
