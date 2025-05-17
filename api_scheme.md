# API Data Processing Specification

This document describes how to fetch, merge, and normalize JSON data from multiple sources into a unified inventory array in JavaScript. Each section shows a sample JSON response, the data-fetching function using `fbwWrapper`, processing logic, and explanatory notes. This is available in the `src/api` file import from `src/api/apiAggregator.ts` as a standalone function import.

---

## 1. Overwolf Game Events

**Data Fetching Function:**

```js
const payload = await useBackgroundInventory();
```

**Sample Response:**

```json
{
  "MiscItems": [
    { "ItemCount": 10, "ItemType": "/Lotus/Types/Items/MiscItems/Rubedo" },
    { "ItemCount": 2,  "ItemType": "/Lotus/Types/Items/MiscItems/BurstonPrimeReceiver" }
  ]
}
```

**Processing & Explanation:**

```js
const misc = payload.MiscItems; // array of { ItemCount, ItemType }
```

* Retrieves the `MiscItems` array from live game events, each entry marking a resource pickup.

---

## 2. Relic & Arcane Data

**Data Fetching Function:**

```js
const relicData = await fbwWrapper("RelicArcane");
```

**Sample Response:**

```json
{
  "ExportRelicArcane": [
    {
      "uniqueName": "LithA1",
      "name": "Lith A1",
      "codexSecret": false,
      "description": "Basic Lith relic",
      "relicRewards": [
        { "rewardName": "Rubedo", "rarity": "COMMON", "tier": 1, "itemCount": 5 }
      ]
    }
  ]
}
```

**Processing & Explanation:**

```js
const relics = relicData.ExportRelicArcane;
```

* Loads all relic definitions and rewards for exact matching by `uniqueName`.

---

## 3. Weapons & Railjack Weapons

**Data Fetching Function:**

```js
const weaponsData = await fbwWrapper("Weapons");
```

**Sample Response:**

```json
{
  "ExportWeapons": [
    { "uniqueName": "BurstonPrime", "name": "Burston Prime", /* ... */ }
  ],
  "ExportRailjackWeapons": [ /* same shape */ ]
}
```

**Processing & Explanation:**

```js
const weapons = [
  ...weaponsData.ExportWeapons,
  ...weaponsData.ExportRailjackWeapons,
];
```

* Merges standard and Railjack weapons into one list for fuzzy matching.

---

## 4. Sentinels

**Data Fetching Function:**

```js
const sentinelData = await fbwWrapper("Sentinels");
```

**Sample Response:**

```json
{
  "ExportSentinels": [
    { "uniqueName": "CarrierPrime", "name": "Carrier Prime", /* ... */ }
  ]
}
```

**Processing & Explanation:**

```js
const sentinels = sentinelData.ExportSentinels;
```

* Retrieves sentinel definitions and adds them to the master item list.

---

## 5. Warframes & Abilities

**Data Fetching Function:**

```js
const warframeData = await fbwWrapper("Warframes");
```

**Sample Response:**

```json
{
  "ExportWarframes": [
    {
      "uniqueName": "Excalibur",
      "name": "Excalibur",
      "abilities": [ /* ... */ ]
      /* other fields */
    }
  ]
}
```

**Processing & Explanation:**

```js
const warframes = warframeData.ExportWarframes;
```

* Adds Warframe definitions for matching component pickups.

---

## Utilities

```js
// Extracts the identifier after the last '/'
function extractId(path) {
  return path.split('/').pop();
}

// Splits CamelCase or PascalCase into words
function splitCamel(str) {
  return str.match(/[A-Z][a-z0-9]*/g) || [str];
}
```

* `extractId`: Simplifies paths like "/Lotus/.../Rubedo" to "Rubedo".
* `splitCamel`: Breaks "BurstonPrimeReceiver" into `["Burston","Prime","Receiver"]` for fuzzy logic.

---

## Merging Logic

```js
async function buildInventory() {
  // 1. Fetch all data in parallel
  const [events, relicData, weaponsData, sentinelData, warframeData] =
    await Promise.all([
      useBackgroundInventory(),
      fbwWrapper("RelicArcane"),
      fbwWrapper("Weapons"),
      fbwWrapper("Sentinels"),
      fbwWrapper("Warframes"),
    ]);

  // 2. Prepare lookup arrays
  const relics = relicData.ExportRelicArcane;
  const itemsAll = [
    ...weaponsData.ExportWeapons,
    ...weaponsData.ExportRailjackWeapons,
    ...sentinelData.ExportSentinels,
    ...warframeData.ExportWarframes,
  ];
  const inventory = [];

  // 3. Process each pickup
  for (const item of events.MiscItems) {
    const id = extractId(item.ItemType);

    // A. Exact relic
    const relicMatch = relics.find(r => r.uniqueName === id);
    if (relicMatch) {
      inventory.push({ ...relicMatch, itemCount: item.ItemCount });
      continue;
    }

    // B. Fuzzy match
    const parts = splitCamel(id);
    let matched = false;
    for (const o of itemsAll) {
      const nameParts = splitCamel(o.uniqueName);
      if (nameParts.every(p => parts.includes(p))) {
        const extra = parts.filter(p => !nameParts.includes(p));
        const baseWords = o.name.split(' ');
        const prefix = baseWords.every(w => parts.includes(w)) ? [] : baseWords;
        const fullName = [...prefix, ...extra].join(' ');

        inventory.push({ ...o, fullConstructedName: fullName, itemCount: item.ItemCount });
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // C. Fallback
    inventory.push({ fullConstructedName: id, itemCount: item.ItemCount });
  }

  return inventory;
}
```

### Key Steps Explained

1. **Parallel Fetch:** minimizes wait time by calling all data functions together.
2. **Exact Match:** preserves rich relic metadata when `uniqueName` matches.
3. **Fuzzy Match:** identifies multipart names using `splitCamel`.
4. **Name Construction:** builds `fullConstructedName` from base names and extras.
5. **Fallback:** ensures unrecognized pickups still appear.

---

Use this refined spec for clear, function-driven data merging in JavaScript. Adjust function signatures if needed for your project setup.
