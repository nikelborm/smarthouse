import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import './types';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
