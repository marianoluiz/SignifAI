import { NavLink } from "react-router"

const GamePage = () => {
  return (
    <div>
      <div>Game</div>


      <NavLink
        to="/play/select"
        className="m-8 px-4 py-2 bg-violet-500 text-white rounded-md"
      >
        Back to song select
      </NavLink>
    </div>
  );
};

export default GamePage;
