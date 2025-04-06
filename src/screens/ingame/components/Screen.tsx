import { RootReducer } from "../../../app/shared/rootReducer";
import { Feed } from "../../../components/Feed";
import { Title } from "../../../components/Title/Title";
import { useSelector } from "react-redux";
import "./styles/Screen.css";

const Screen = () => {
  const { infos } = useSelector(
    (state: RootReducer) => state.background,
  );

  return (
    <div className="ingame">
      <Title color="white">InGame Screen</Title>
      <Feed
        title="Infos"
        data={
          infos.length
            ? JSON.stringify(infos[infos.length - 1])
            : "No infos yet"
        }
      />
    </div>
  );
};

export default Screen;
