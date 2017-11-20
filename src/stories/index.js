import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Readme from '../import_readme';
import SortableReact from '../SortableReact';

storiesOf('Welcome', module)
  .add('default', ()=> (<Readme></Readme>));

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

storiesOf('different mode', module)
  .add('swipe',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order, "", 6)}
    `)(
      () => <SortableReact
        sortable_mode="swipe"
        order={default_order}
      />
    )
  )
  .add('left right',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order, "", 6)}
    `)(
      () => <SortableReact sortable_mode="left_right"  order={default_order}/>
    )
  );

storiesOf('diferent size item', module)
  .add('swipe',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () => <SortableReact sortable_mode="swipe" order={default_order_diff}/>
    )
  )
  .add('left right',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () => <SortableReact sortable_mode="left_right"  order={default_order_diff}/>
    )
  );

storiesOf('options item', module)
  .addDecorator(withKnobs)
  .add('width and height',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () => {
        const options = {
           range: true,
           min: 1,
           max: 300,
           step: 1,
        };
        const width = number("width", 80, options)
        const height = number("height", 60, options)
        // const delta = number("delta", 10, options)
        // const allow_use_empty = boolean("allow_use_empty", false)
        // console.log("allow_use_empty::", allow_use_empty)
        return (<SortableReact
          sortable_mode="swipe"
          width={width}
          height={height}
          order={default_order_diff}
        />)
      })
  )
  .add('delta between items',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () => {
        const options = {
           range: true,
           min: 1,
           max: 300,
           step: 1,
        };
        // const width = number("width", 120, options)
        // const height = number("height", 120, options)
        const delta = number("delta", 30, options)
        // const allow_use_empty = boolean("allow_use_empty", false)

        return (<SortableReact
          sortable_mode="left_right"
          delta={delta}
          order={default_order_diff}/>)
      }
    )
  )
  .add('allow to drop on empty cells',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () => {
        const options = {
           range: true,
           min: 1,
           max: 300,
           step: 1,
        };
        // const width = number("width", 120, options)
        // const height = number("height", 120, options)
        // const delta = number("delta", 30, options)
        const allow_use_empty = boolean("allow_use_empty", false)

        return (<SortableReact
          sortable_mode="left_right"
          allow_use_empty={allow_use_empty}
          order={default_order_diff}/>)
      }
    )
  )
  .add('animation',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () =>{
        const stiffness = number("stiffness", 400)
        const damping = number("damping", 15)
        const scale_active = number("scale_active", 1.2)
        const shadow_active = number("shadow_active", 1.2)
        return (<SortableReact
          sortable_mode="swipe"
          damping={damping}
          stiffness={stiffness}
          order={default_order_diff}
          shadow_active={shadow_active}
          scale_active={scale_active} />)
      }
    )
  )

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
          sortable_mode="swipe"
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
          sortable_mode="swipe"
          start={my_alert_start}
          order={default_order_diff}
        />)
      }
    )
  )
