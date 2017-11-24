import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import SortableReact from '../../SortableReact';

import {default_order, default_order_diff} from "../demo_data";


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
          sortable_mode="swap"
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
          sortable_mode="swap"
          damping={damping}
          stiffness={stiffness}
          order={default_order_diff}
          shadow_active={shadow_active}
          scale_active={scale_active} />)
      }
    )
  )
  .add('read only',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () => {
        const disable_drag = boolean("disable_drag", true)
        return (<SortableReact
          sortable_mode="left_right"
          disable_drag={disable_drag}
          order={default_order_diff}/>)
      }
    )
  )
