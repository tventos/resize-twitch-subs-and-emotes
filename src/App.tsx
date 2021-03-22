import * as React from 'react';
import 'reflect-metadata';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '@src/layout/Layout';

export const App = () => (
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
