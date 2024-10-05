import axios from 'axios';
import { log } from '../../../lib/log';
// import { useInternetConnection } from '../../../features/misc';


const googleSheets = async ({ spreadsheetId, range }: sheetParameters) => {
    return axios
        .get(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/pub?gid=0&single=true&output=csv&range=${range}`)
        .then((res) => res.data);
};

const colorRange = (num: number) => {
    const colorMap = {
        10: 'ED',
        16: 'RED',
        32: 'ORANGE',
        64: 'YELLOW',
        9999999999: 'GREEN',
    };
    const defaultColor = 'GREEN';
    for (const [lowerBound, color] of Object.entries(colorMap)) {
        if (num <= parseInt(lowerBound)) {
            return color;
        }
    }
    return defaultColor;
};

export async function updateRelicInfo(): Promise<SheetRelicInfo> {
    const sheetValues: string = await googleSheets({ 
        spreadsheetId: import.meta.env.VITE_GS_SHEETID,
        range: 'Sheet1!A2:I1000',
    })
    .catch((err: Object) => {
        console.error(err, 'Error fetching items and stock, using google client')
    })

    const values: string[] = sheetValues?.split(/\r?\n/);

    const allRelicData: SheetRelicData[] = [];
    let allPartData: SheetPartData[] = [];

    if (values?.[0] === "#ERROR!") {
        log(
            "Error fetching items: Items have invalid values (#ERROR!)",
            "src/screens/background/components/GSFetch.tsx",
            "updateRelicInfo",
        );
        return [allRelicData, allPartData];
    }

    if (values && values?.length) {
        for (const row of values) {
            if (!row) continue;
            let [
                vaultedText, tokens, name, item1, item2, item3, item4, item5, item6
            ] = row.split(",")

            const rewards: sheetRelicRewards[] = [];

            const vaulted = vaultedText == 'TRUE' ? true : false;

            for (const item of [item1, item2, item3, item4, item5, item6]) {
                if (!item) continue;
                let [part, stock] = item.split(' | ');
                part = part.replace(' and ', ' & ');
                if (part.endsWith('Prime')) part = part.replace(' Prime', ' Blueprint');
                if (part.includes('x2')) stock = `${parseInt(stock) / 2 | 0}`;

                if (!allPartData.some(thing => thing.item === part)) allPartData.push({ item: part, stock: stock });

                rewards.push({ item: part, stock: stock, color: part !== 'Forma' ? colorRange(parseInt(stock)) : '' });
            }

            allRelicData.push({ name, rewards, tokens, vaulted });
        }
    }

    return [allRelicData, allPartData];
}