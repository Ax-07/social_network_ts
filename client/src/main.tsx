import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./services/stores";
import './scss/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </PersistGate> */}
  </Provider>
)
