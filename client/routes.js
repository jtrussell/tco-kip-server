/* eslint react/display-name: 0 react/no-multi-comp: 0 */

import React from 'react';
import GoodbyeArticle from './pages/GoodbyeArticle';

const routes = [
    { path: '/', action: () => <GoodbyeArticle/> },
];

export default routes;
