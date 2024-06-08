import axios from "axios";
import { getExtensionPath, writeFileContents } from "../lib/io";
import LZMA from "lzma-web";
import { log } from "../lib/log";

interface rewardType {
	rewardName: string
	rarity: string,
	tier: number,
	itemCount: number
}

interface relicSchema {
	uniqueName: string;
	name: string;
	codexSecret: boolean;
	description: string;
	relicRewards: rewardType[]
}

export async function fetchWFSchema(): Promise<undefined | rewardType | relicSchema[]> {
	try {
		const response = await axios.get<ArrayBuffer>(
			`https://origin.warframe.com/PublicExport/index_en.txt.lzma`,
			{
				responseType: "arraybuffer",
			}
		);

		if (!response.data) {
			return;
		}

		const lzma = new LZMA();

		await lzma
			.decompress(new Uint8Array(response.data))
			.then(async (res) => {
				const extract_en_relicArcanes = (res as string).split("\n")[8];
				const schemaResponse = await axios.get<string>(
					`http://content.warframe.com/PublicExport/Manifest/${extract_en_relicArcanes}`
				);
				const schemaData = schemaResponse.data.replace(/\r\n|\r/g, "\\n");

				await writeFileContents(`D:/Pictures/OWImgs/abc.txt`, (await JSON.parse(schemaData)["ExportRelicArcane"]));
				log('Worker loaded relic schemas successfully', 'features/relicRecords.ts', 'lzma#decompress')
			})
			.catch(console.error);
	} catch (error) {
		console.error(error);
	}
}


