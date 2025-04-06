async function fetchAndDecompress(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Promise((resolve, reject) => {
    //@ts-ignore
    LZMA.decompress(new Uint8Array(arrayBuffer), (result, error) => {
      error ? reject(error) : resolve(result);
    });
  });
}

const baseURL_ping = "https://origin.warframe.com/PublicExport/index_en.txt.lzma";
const constructURL = (id: string) => `http://content.warframe.com/PublicExport/Manifest/${id}`;

export async function getNameTranslations() {
  const exports = await fetchAndDecompress(baseURL_ping);
  const VoidRelicsTranslations = exports.split("\n");
  const translationsData = await fetchAndDecompress(constructURL(VoidRelicsTranslations[8]));
  console.log(translationsData);
}