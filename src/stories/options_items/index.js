import React from 'react';

import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
// import { withInfo } from '@storybook/addon-info';
// import SortableReact from '../../SortableReact';
//
import {default_order, default_order_diff} from "../demo_data";

import StoreWidthHeightDelta from "./width_height_delta"
import StoreAllowDropReadOnly from "./allow_to_drop_readonly"
import StoreAnimation from "./animation"

storiesOf('options item', module)
  // .addDecorator(withKnobs)
  .add('width and height',
      () => {
        return (<StoreWidthHeightDelta/>)
      })

  .add('allow to drop on empty cells, readonly',
      () => {
        return (<StoreAllowDropReadOnly/>)
      }
    )

  .add('animation',
    () =>{
      return (<StoreAnimation />)
    }
  )
