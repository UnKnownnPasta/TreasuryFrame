import { RootReducer } from "../../../app/shared/rootReducer";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fromNow } from "../../../lib/utils";

type Attributes = {
  quantity: number;
  label: string;
};
type DataLabel = "infos";
type Data = Record<DataLabel, Attributes>;

const getUpdatedAt = (date: number): string => `updated: ${fromNow(date)}`;

export const useData = () => {
  const { infos } = useSelector(
    (state: RootReducer) => state.background
  );

  const data: Data = useMemo(() => {
    const infosQuantity = infos.length;

    return {
      infos: {
        quantity: infosQuantity,
        label: `Infos (${getUpdatedAt(
          Date.now()
        )})`,
      },
    };
  }, [infos]);

  return data;
};
