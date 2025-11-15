// src/main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store.js";
import "./index.css";
import App from "./App.jsx";
import PlantContextProvider from "./context/PlantContext.jsx";
import { fetchUser } from "@/store/slices/userSlice"; // fetch current user on boot

function Bootstrapper({ children }) {
  useEffect(() => {
    // dispatch fetchUser once on app startup to restore auth from cookie
    store.dispatch(fetchUser());
  }, []);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Bootstrapper>
          <PlantContextProvider>
            <App />
          </PlantContextProvider>
        </Bootstrapper>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
