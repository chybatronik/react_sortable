import React from 'react';

import { storiesOf } from '@storybook/react';
import {default_order, default_order_diff} from "../demo_data";
import StoreSortableMode from "./sortable_mode"
import StoreDiferentSize from "./diferent_size"
import StoreItemWithImage from "./item_with_image"


storiesOf('features', module)
  .add('sortable mode',
    () =>{
      return (
        <StoreSortableMode/>
      )
    }
  )
  .add('diferent size',
    () => {
      return (<StoreDiferentSize/>)
    }
  )
  .add('item with image',
    () => {
      return (<StoreItemWithImage />)
    }
  );
