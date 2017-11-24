import React from 'react';

import { storiesOf } from '@storybook/react';
import Readme from './import_readme';

storiesOf('Welcome', module)
  .add('guide', ()=> (<Readme></Readme>));
