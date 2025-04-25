import { useParams } from "react-router";
import songs_config from "../../config/songs_config.json"

const GamePage = () => {
  // song variable name
  const { song_var } = useParams();

  const songs_details = songs_config.songs.find((song) => song.var_name === song_var);

  return (
    <div>
      <div>{songs_details?.title}</div>
      <div>{songs_details?.author}</div>
    </div>
  );
};

export default GamePage;
