import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/global.css';

const root = document.getElementById('app');

if (!root) {
  throw new Error('App root element not found');
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  root,
);
