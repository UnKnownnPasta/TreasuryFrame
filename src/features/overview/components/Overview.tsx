import { Stats } from "./Stats";
import { useData } from "../hooks/useData";
import "./styles/Overview.css";

export const Overview = () => {
  const { infos } = useData();

  return (
    <div className="overview">
      <Stats label={infos.label} value={infos.quantity} />
    </div>
  );
};
