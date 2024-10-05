import axios from 'axios';
//@ts-ignore
// import lzma from 'lzma';
import LZMA from 'lzma-web';
import { log } from '../../../lib/log';

/**
 * Fetches stuff to convert internal-naming-scheme to warframe-naming-scheme
 * @param line which export to fetch (by line number)
 * @returns exported data in JSON format
 */
export async function fetchByWeb(line: number): Promise<Object[] | null> {
	const response = await axios.get(
		`https://origin.warframe.com/PublicExport/index_en.txt.lzma`,
		{ responseType: "arraybuffer" }
    );
	if (!response.data) {
		log("Failed to fetch LZMA data", "src/screens/background/components/GSFetch.tsx", "fetchByWeb");
        return null;
	}

	const lzma = new LZMA();
	let result = await lzma.decompress(new Uint8Array(response.data));

	if (result && typeof result === "string") {
		const extract_en_data = result.split("\n")[line];

		const schemaResponse = await axios.get(
			`http://content.warframe.com/PublicExport/Manifest/${extract_en_data}`
		);
		const schemaData = schemaResponse.data.replace(/\r\n|\r/g, "\\n");
		
		return Object.values(JSON.parse(schemaData))[0] as Object[];
	} else {
		console.error("LZMA Error", "src/screens/background/components/GSFetch.tsx", "fetchByWeb");

		return [];
	}
}