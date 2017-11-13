import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import SortableReact from '../SortableReact';

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Sorting with 2 mode', module)
  .add('swipe', () => <SortableReact sortable_mode="swipe"/>)
  .add('left right', () => <SortableReact sortable_mode="left_right"/>);

storiesOf('diferent size item', module)
  .add('swipe', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('left right', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('change width, height items', module)
  .add('swipe', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('left right', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('change delta between items', module)
  .add('swipe', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('left right', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);
