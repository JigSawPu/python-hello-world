import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { AppProviders } from './app/providers';
import './styles/global.css';

const root = document.getElementById('app');

if (!root) {
  throw new Error('App root element not found');
}

render(
  <AppProviders>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProviders>,
  root,
);
