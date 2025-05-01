import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import HomePage from "../features/home/home";
import GamePage from "../features/game/pages/game";
import SongSelectPage from "../features/game/pages/songSelect";
import ResultPage from "../features/game/pages/result";
import LeaderboardPage from "../features/leaderboard/leaderboard";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />
            {/* Leaderboard */}
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            {/* Play, replace prop to not loop when backing */}
            <Route path="/play">
                <Route index element={<Navigate to="/play/select" replace />} />
                <Route path="/play/select" element={<SongSelectPage />} />
                <Route path="/play/song/:song_var" element={<GamePage />} />
                <Route path="/play/result" element={<ResultPage />} />
            </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;