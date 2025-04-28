import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import store from './app/store';
import AppRoutes from "./app/routes";
import { CameraProvider } from './globals/camera/cameraContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CameraProvider>
        <AppRoutes />
      </CameraProvider>
    </Provider>
  </StrictMode>
);
