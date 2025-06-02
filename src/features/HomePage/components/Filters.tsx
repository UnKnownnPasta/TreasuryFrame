interface FilterHandlers {
  setTypeFilter: React.Dispatch<React.SetStateAction<'all' | 'relics' | 'primes'>>;
  setVaultedFilter: React.Dispatch<React.SetStateAction<'all' | 'true' | 'false'>>;
  setNameSearch: React.Dispatch<React.SetStateAction<string>>;
  setX2Filter: React.Dispatch<React.SetStateAction<'all' | 'true' | 'false'>>;
  setTokenFilter: React.Dispatch<React.SetStateAction<number | null>>;

  setEdMinFilter: React.Dispatch<React.SetStateAction<number | null>>;
  setRedMinFilter: React.Dispatch<React.SetStateAction<number | null>>;
  setOrangeMinFilter: React.Dispatch<React.SetStateAction<number | null>>;
  setYellowMinFilter: React.Dispatch<React.SetStateAction<number | null>>;
  setGreenMinFilter: React.Dispatch<React.SetStateAction<number | null>>;

  setSelectedRarities: React.Dispatch<React.SetStateAction<Record<string, Set<string | number>>>>;

  // Add value props
  typeFilter: 'all' | 'relics' | 'primes';
  vaultedFilter: 'all' | 'true' | 'false';
  nameSearch: string;
  x2Filter: 'all' | 'true' | 'false';
  tokenFilter: number | null;
  edMinFilter: number | null;
  redMinFilter: number | null;
  orangeMinFilter: number | null;
  yellowMinFilter: number | null;
  greenMinFilter: number | null;
  selectedRarities: Record<string, Set<string | number>>;
}

export const Filters = (props: FilterHandlers) => {
  const {
    setTypeFilter,
    setVaultedFilter,
    setNameSearch,
    setX2Filter,
    setTokenFilter,
    setEdMinFilter,
    setRedMinFilter,
    setOrangeMinFilter,
    setYellowMinFilter,
    setGreenMinFilter,
    setSelectedRarities,
    typeFilter,
    vaultedFilter,
    nameSearch,
    x2Filter,
    tokenFilter,
    edMinFilter,
    redMinFilter,
    orangeMinFilter,
    yellowMinFilter,
    greenMinFilter,
  } = props;

  // Handle rarity checkbox toggles
  const handleRarityChange = (color: string, rarity: string | number, checked: boolean) => {
    setSelectedRarities(prev => {
      const newSet = new Set(prev[color]);
      if (checked) {
        newSet.add(rarity);
      } else {
        newSet.delete(rarity);
      }
      return { ...prev, [color]: newSet };
    });
  };

  return (
    <>
      <div className="ae-timeline-filters-row">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="typeFilter">Type</label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as 'all' | 'relics' | 'primes')}
            >
              <option value="all">Relics & Primes</option>
              <option value="relics">Relics Only</option>
              <option value="primes">Primes Only</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="vaultedFilter">Vault Status</label>
            <select
              id="vaultedFilter"
              value={vaultedFilter}
              onChange={e => setVaultedFilter(e.target.value as 'all' | 'true' | 'false')}
            >
              <option value="all">All Vault Status</option>
              <option value="true">Vaulted</option>
              <option value="false">Unvaulted</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="nameSearch">Search</label>
            <input
              type="text"
              id="nameSearch"
              value={nameSearch}
              placeholder="Search name..."
              onChange={e => setNameSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="x2Filter">x2 Items</label>
            <select
              id="x2Filter"
              value={x2Filter}
              onChange={e => setX2Filter(e.target.value as 'all' | 'true' | 'false')}
            >
              <option value="all">All Items</option>
              <option value="true">Has an x2 item</option>
              <option value="false">No x2 items</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="labels" style={{display: 'flex', flexDirection: 'row', gap: '170px'}}>
              <label>Token Filter (Relics only)</label>
              <label>Custom:</label>
            </div>
            <div className="token-items" style={{display: "flex", flexDirection: "row", alignItems: "center", gap: '10px'}}>
              <div className="token-options">
                {[10, 12, 18, 24, 30].map(val => (
                  <button
                    key={val}
                    type="button"
                    className="token-preset"
                    onClick={() => setTokenFilter(val)}
                  >
                    {val}+
                  </button>
                ))}
                <button type="button" className="token-preset" onClick={() => setTokenFilter(null)}>
                  Clear
                </button>
              </div>
              <div className="token-input">
                <input
                  type="number"
                  id="tokenFilter"
                  value={tokenFilter ?? ''}
                  min={0}
                  placeholder="Min tokens"
                  onChange={e =>
                    setTokenFilter(e.target.value === '' ? null : Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <div className="color-filters">
            {[
              { color: 'ed', label: 'ED', setMinFilter: setEdMinFilter },
              { color: 'red', label: 'RED', setMinFilter: setRedMinFilter },
              { color: 'orange', label: 'ORANGE', setMinFilter: setOrangeMinFilter },
              { color: 'yellow', label: 'YELLOW', setMinFilter: setYellowMinFilter },
              { color: 'green', label: 'GREEN', setMinFilter: setGreenMinFilter },
            ].map(({ color, label, setMinFilter }) => (
              <div key={color} className="color-filter filter-item">
                <div className="color-filter-header">
                  <span className={`color-indicator color-${color}`}></span>
                  <label>{label}</label>
                  <input
                    type="number"
                    id={`${color}MinFilter`}
                    value={setMinFilter === setEdMinFilter ? edMinFilter ?? '' :
                           setMinFilter === setRedMinFilter ? redMinFilter ?? '' :
                           setMinFilter === setOrangeMinFilter ? orangeMinFilter ?? '' :
                           setMinFilter === setYellowMinFilter ? yellowMinFilter ?? '' :
                           greenMinFilter ?? ''}
                    placeholder="Min"
                    min={0}
                    max={10}
                    className="small-input"
                    onChange={e =>
                      setMinFilter(e.target.value === '' ? null : Number(e.target.value))
                    }
                  />
                </div>
                <div className="rarity-checkboxes">
                  {[{ label: 'COMMON', rarity: 25.33 }, { label: 'UNCOMMON', rarity: 11 }, { label: 'RARE', rarity: 2 }].map(({ label: rLabel, rarity }) => (
                    <label key={rLabel} className="rarity-checkbox">
                      <input
                        type="checkbox"
                        className="rarity-filter"
                        data-color={color}
                        data-rarity={rarity}
                        onChange={e =>
                          handleRarityChange(color, rarity, e.target.checked)
                        }
                      />{' '}
                      {rLabel}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
