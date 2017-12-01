import React from 'react';

import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
// import { withInfo } from '@storybook/addon-info';
// import Markdown from 'react-markdown';
// import SortableReact from '../../SortableReact';
import {default_order, default_order_diff} from "../demo_data";
import StoreSortableMode from "./sortable_mode"
import StoreDiferentSize from "./diferent_size"
import StoreItemWithImage from "./item_with_image"


storiesOf('features', module)
  .add('sortable mode',
    () =>{
      // const sortable_mode = select("mode", ["swap", "left_right"], "left_right")
      // console.log("sortable_mode:", sortable_mode)
      return (
        <StoreSortableMode/>
      )
    }
  )
  .add('diferent size',
    () => {
      // const order = object("order", default_order_diff)
      return (<StoreDiferentSize/>)
    }
  )
  .add('item with image',
    () => {
      // const order = object("order", default_order_diff)
      return (<StoreItemWithImage />)
    }
  );
