import { NavLink } from "react-router";

const ResultPage = () => {
  return (
    <div>
      <div>Result page</div>
      <p>You win bro</p>
      <NavLink
        to="/"
        className="m-8 px-4 py-2 bg-violet-500 text-white rounded-md"
      >
        Back to Home
      </NavLink>
    </div>
  );
};

export default ResultPage;