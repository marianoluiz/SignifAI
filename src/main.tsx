import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import store from './app/store';

import HomePage from "./app/routes/home";
import GamePage from "./app/routes/play/game";
import SongSelectPage from "./app/routes/play/song-select";
import ResultPage from './app/routes/play/result';
import LeaderboardPage from "./app/routes/leaderboard"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          {/* Leaderboard */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          {/* Play, replace param to not loop when backing */}
          <Route path="/play">
            <Route
              index
              element={<Navigate to="/play/select" replace />}
            />
            <Route path="/play/select" element={<SongSelectPage />} />
            <Route path="/play/song/:songId" element={<GamePage />} />
            <Route path="/play/result" element={<ResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
