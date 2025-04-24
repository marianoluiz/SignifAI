import { NavLink } from "react-router"
import { AUDIO } from "../../../constants/audio"

const GamePage = () => {
  return (
    <div>
      <div>Game</div>
      <audio autoPlay loop>
        <source src={AUDIO.wonderful_world} />
      </audio>

      <audio autoPlay loop>
        <source src={AUDIO.click_sound} />
      </audio>

      <NavLink
        to="/play/song-select"
        className="m-8 px-4 py-2 bg-violet-500 text-white rounded-md"
      >
        Back to song select
      </NavLink>
    </div>
  );
};

export default GamePage;
