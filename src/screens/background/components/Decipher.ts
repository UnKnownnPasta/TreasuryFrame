import axios from 'axios';
//@ts-ignore
import lzma from 'lzma';
import { log } from '../../../lib/log';

/**
 * Fetches stuff to convert internal-naming-scheme to warframe-naming-scheme
 * @param line which export to fetch (by line number)
 * @returns exported data in JSON format
 */
export async function fetchByWeb(line: number): Promise<Object | null> {
	const response = await axios.get(
		`https://origin.warframe.com/PublicExport/index_en.txt.lzma`,
		{ responseType: "arraybuffer" }
    );
	if (!response.data) {
		log("Failed to fetch LZMA data", "src/screens/background/components/GSFetch.tsx", "fetchByWeb");
        return null;
	}

    let result = null;

	await lzma.LZMA().decompress(new Uint8Array(response.data),
		async (res: string, err: Object) => {
			if (!err) {
				const extract_en_data = res.split("\n")[line];

				const schemaResponse = await axios.get(
					`http://content.warframe.com/PublicExport/Manifest/${extract_en_data}`
				);
				const schemaData = schemaResponse.data.replace(/\r\n|\r/g, "\\n");

                result = JSON.parse(schemaData)["ExportRelicArcane"];
			} else {
				console.error(err);
			}
		}
	)

    return result;
}