import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import store from './app/store';

import Home from "./app/routes/home";
import GamePage from "./app/routes/play/game";
import SongSelectPage from "./app/routes/play/song-select";
import ResultPage from './app/routes/play/result';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          {/* Play */}
          <Route path="/play">
            {/* replace - to prevent looping back to /play route */}
            <Route
              index
              element={<Navigate to="/play/song-select" replace />}
            />
            <Route path="/play/song-select" element={<SongSelectPage />} />
            <Route path="/play/game" element={<GamePage />} />
            <Route path="/play/result" element={<ResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
