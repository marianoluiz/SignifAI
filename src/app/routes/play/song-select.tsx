import { NavLink } from "react-router";

const SongSelectPage = () => {
  return (
    <div>
      <div>song-select</div>

      <NavLink
        to="/"
        className="m-8 px-4 py-2 bg-violet-500 text-white rounded-md"
      >
        Back to home
      </NavLink>
      <NavLink
        to="/play/game"
        className="m-8 px-4 py-2 bg-violet-500 text-white rounded-md"
      >
        Choose Song
      </NavLink>
    </div>
  );
};

export default SongSelectPage;