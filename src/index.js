// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { StoreProvider } from './Store';
// import { HelmetProvider } from 'react-helmet-async';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
// <StoreProvider>
//   <HelmetProvider>
//     <App />
//   </HelmetProvider>
// </StoreProvider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table-6/react-table.css';
import ReactScrollableFeed from 'react-scrollable-feed';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <ReactScrollableFeed>
          <App />
        </ReactScrollableFeed>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
