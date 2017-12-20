import React from 'react';

import { storiesOf } from '@storybook/react';
import {default_order, default_order_diff} from "../demo_data";
import StoreStart from "./start"
import StoreFinish from "./finish"


storiesOf('callbacks', module)
  .add('finish drop',
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
  .add('start drag',
      () =>{
        const my_alert_start = function(srt){
          console.log(srt)
        }
        return (<StoreStart/>)
      }

  )
