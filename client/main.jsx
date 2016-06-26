'use strict';

import 'styles/main.scss';

import React from 'react';
import { render } from 'react-dom';

import Index from 'components/Index/Index';

render(<Index items={[1,'test',3]} />, document.getElementById('js-main'));
