import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import SortableReact from '../../SortableReact';

import {default_order, default_order_diff} from "../demo_data";
import StoreStart from "./start"
import StoreFinish from "./finish"

// import StoreDiferentSize from "./diferent_size"
// import StoreItemWithImage from "./item_with_image"


storiesOf('callbacks', module)
  // .addDecorator(withKnobs)
  .add('finish drop',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () =>{
        const my_alert = function(srt){
          alert(JSON.stringify(srt, "", 4))
        }
        return (<StoreFinish
          sortable_mode="swap"
          finished={my_alert}
          order={default_order_diff}
        />)
      }
    )
  )
  .add('start drag',
    withInfo(`
      Content order:\n
      ${JSON.stringify(default_order_diff, "", 6)}
    `)(
      () =>{
        const my_alert_start = function(srt){
          console.log(srt)
        }
        return (<StoreStart/>)
      }
    )
  )
