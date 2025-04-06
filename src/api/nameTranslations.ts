import { log } from "../lib/log";
import LZMA from "lzma-web";
import axios from "axios";
import store from "../app/shared/store";

export async function fetchByWeb(line: number): Promise<Object | null> {
	const response = await axios.get(
		`https://origin.warframe.com/PublicExport/index_en.txt.lzma`,
		{ responseType: "arraybuffer" }
	);
	if (!response.data) {
		log(
			"Failed to fetch LZMA data",
			"src/screens/background/components/GSFetch.tsx",
			"fetchByWeb"
		);
		return null;
	}

	const lzma = new LZMA();
	let result = await lzma.decompress(new Uint8Array(response.data));

	if (result && typeof result === "string") {
		const extract_en_data = result.split("\n")[line];

		const schemaResponse = await axios.get(`http://content.warframe.com/PublicExport/Manifest/${extract_en_data}`);

		//@ts-ignore
		return schemaResponse.data;
	} else {
		console.error(
			"LZMA Error",
			"src/screens/background/components/GSFetch.tsx",
			"fetchByWeb"
		);

		return {};
	}
}

type Object2 = { [key: string]: any; };
async function fetchTranslations(): Promise<Object2> {
  return new Promise((resolve, reject) => {
    fetchByWeb(8).then((data) => {
      if (data) {
        resolve(data);
      } else {
        reject("Failed to fetch name translations");
      }
    });
  })
}

type rewardItem = {
  "rewardName": string,
  "rarity": string,
  "tier": number,
  "itemCount": number
}

type relicItem = {
  "name": string,
  "uniqueName": string,
  "relicRewards": rewardItem[]
}

const refinement = (text: string) => {
  if (text.endsWith('Bronze')) return 'Intact';
  else if (text.endsWith('Silver')) return 'Exceptional';
  else if (text.endsWith('Gold')) return 'Flawless';
  else if (text.endsWith('Platinum')) return 'Radiant';
  else return "None";
}

export async function doTranslations() {
  const trns = await fetchTranslations();
  const iData = store.getState().background.infos;
  console.log(iData);

  const finalData = trns["ExportRelicArcane"].map((item: relicItem) => {
    if (!item.uniqueName.includes('Projections')) return null;
    //@ts-ignore
    const rewards = item['relicRewards'].map((reward: rewardItem) => {
      const rwn = reward.rewardName.split('/').at(-1);
      if (!rwn) return {};
      //@ts-ignore
      const inventory = iData.find((i) => i['ItemType'].split('/').at(-1) === reward.rewardName.split('/').at(-1));
      return {
        "rewardName": rwn.split(/(?=[A-Z])/).join(" "),
        "rarity": reward['rarity'],
        "tier": reward['tier'],
        //@ts-ignore
        "refinement": refinement(inventory?.['ItemType'] || "ASDF"),
        //@ts-ignore
        "itemCount": inventory?.['ItemCount'] || 0,
      }
    });
    return {
      "relicName": item['name'].split(" ").slice(0, -1).join(" "),
      "rewards": rewards,
    }
  }).filter(Boolean);
  console.log(finalData);

  return finalData;
}