import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./services/stores";
import "./scss/index.css";
import { ToastsProvider } from "./components/toast/ToastContext.tsx";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastsProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
