function smartJoin(arr1, arr2, arr3) {
  const sameSeq = arr2.length === arr3.length &&
                  arr2.every((v, i) => v === arr3[i]);

  const fullPrefix = arr2.every((v, i) => arr1[i] === v);
  if (sameSeq && fullPrefix) return arr1.join(' ');

  const arr3Prefix = arr3.every((v, i) => arr1[i] === v);
  if (arr3Prefix) return [...arr3, ...arr1.slice(arr3.length)].join(' ');

  let L = 0;
  while (L < arr1.length && L < arr2.length && arr1[L] === arr2[L]) L++;

  if (L > 1) {
    const suffix = arr1.slice(L);
    const trimmed = suffix.length > 1 ? suffix.slice(1) : suffix;
    return [...arr3, ...trimmed].join(' ');
  }
  
  const matchIndex = arr1.findIndex((token, idx) =>
    token === arr3[0] &&
    arr3.slice(1).every((v, i) => arr1[idx + 1 + i] === v)
  );

  if (matchIndex !== -1 && matchIndex < arr1.length - 1) {
    return [...arr3, ...arr1.slice(matchIndex + arr3.length)].join(' ');
  }

  return null;
}

// ─── Test Harness ─────────────────────────────────────────────────────────

const split = str => str.match(/[A-Z][a-z]*/g);

const testCases = [
  {
    input: [
      split("KaniPrimeHandle"),
      split("KaniPrime"),
      split("KaniPrime")
    ],
    expected: "Kani Prime Handle"
  },
  {
    input: [
      split("LongPoleArmPrimeHandle"),
      split("LongPoleArmPrime"),
      split("MonaPrime")
    ],
    expected: "Mona Prime Handle"
  },
  {
    input: [
      split("ShortKomPrimeAbs"),
      split("LongPoleArmPrime"),
      split("MonaPrime")
    ],
    expected: null
  },
  {
    input: [
      split("SicarusPrimeBarrel"),
      split("PrimeSicarusPistol"),
      split("SicarusPrime")
    ],
    expected: "Sicarus Prime Barrel"
  },
  {
    input: [
      split("PrimeBowLowerLimb"),
      split("PrimeBoWeapon"),
      split("BoPrime")
    ],
    expected: "Bo Prime Lower Limb"
  },
  {
    input: [
      split("PrimePolearmBlade"),
      split("PrimePolearmWeapon"),
      split("OrthosPrime")
    ],
    expected: "Orthos Prime Blade"
  },
  {
    input: [
      [
        "Prime",
        "Dual",
        "Kamas",
        "Handle"
    ],
    [
        "Prime",
        "Hikou"
    ],
    [
        "Hikou",
        "Prime"
    ]
    ],
    expected: null
  },
  {
    input: [
      [
        "Prime",
        "Bow",
        "Lower",
        "Limb"
    ],
    [
        "Prime",
        "Hikou"
    ],
    [
        "Hikou",
        "Prime"
    ],
    ],
    expected: null
  }
];

testCases.forEach(({input, expected}, i) => {
  const result = smartJoin(...input);
  const pass = result === expected;
  console.log(
    `Test ${i+1}:`, pass ? '✅' : '❌',
    ` Got: ${result}  |  Exp: ${expected}`
  );
});
