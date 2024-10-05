type sheetParameters = {
    spreadsheetId: string,
    range: string,
}

type sheetRelicRewards = {
    item: string,
    stock: string,
    color: string,
}

interface SheetRelicData {
  name: string;
  rewards: sheetRelicRewards[];
  tokens: string;
  vaulted: boolean;
}

interface SheetPartData {
  item: string;
  stock: string;
  color?: string;
}

type SheetRelicInfo = [
    RelicData: SheetRelicData[],
    PartData: SheetPartData[],
]