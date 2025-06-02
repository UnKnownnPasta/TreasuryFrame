import React, { useRef, useEffect, useState, useCallback } from "react"
import { ExternalApiResponse } from "../../../api/types"
import { useBackgroundTranslatedRelics, useBackgroundTranslatedPrimes } from '../../../screens/background/hooks';

interface InventoryProps {
  typeFilter: "all" | "relics" | "primes"
  vaultedFilter: "all" | "true" | "false"
  nameSearch: string
  x2Filter: "all" | "true" | "false"
  tokenFilter: number | null
  edMinFilter: number | null
  redMinFilter: number | null
  orangeMinFilter: number | null
  yellowMinFilter: number | null
  greenMinFilter: number | null
  selectedRarities: Record<string, Set<string | number>>
  setResultCount: React.Dispatch<React.SetStateAction<[number, number]>>
  currentPage: number
  onPageChange: (page: number) => void
}

export const Inventory: React.FC<InventoryProps> = ({
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
  selectedRarities,
  setResultCount,
  currentPage,
  onPageChange
}) => {
  const translatedRelics = useBackgroundTranslatedRelics();
  const translatedPrimes = useBackgroundTranslatedPrimes();
  const inventoryRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [tooltipPositions, setTooltipPositions] = useState<Record<number, boolean>>({});
  const itemsPerPage = 10;
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
  const updateTimeoutRef = useRef<number>();
  const pendingUpdatesRef = useRef<Record<number, HTMLDivElement | null>>({});

  // Transform the data into the format we need
  const initialData = React.useMemo((): ExternalApiResponse => {
    const uniqueRelics = new Map();
    const uniquePrimes = new Map();

    // Process relics
    translatedRelics.forEach(relic => {
      const key = relic.name || relic.processedName;
      if (key) {
        uniqueRelics.set(key, {
          name: key,
          rewards: relic.rewards || [],
          tokens: relic.tokens || 0,
          vaulted: relic.vaulted || false,
          inventoryCount: relic.inventoryCount || 0,
          _kind: 'relics' as const
        });
      }
    });

    // Process primes
    translatedPrimes.forEach(prime => {
      const key = prime.ItemName;
      if (key) {
        uniquePrimes.set(key, {
          name: key,
          item: prime.ItemInventoryName,
          x2: false,
          stock: prime.ItemInStockCount,
          color: 'ed',
          rarity: 2,
          relicFrom: [],
          inventoryCount: prime.ItemOwnedCount,
          _kind: 'primes' as const
        });
      }
    });

    return {
      relics: Array.from(uniqueRelics.values()),
      primes: Array.from(uniquePrimes.values())
    };
  }, [translatedRelics, translatedPrimes]);

  const getColorClass = (color: string) => {
    if (!color) return "";
    const colorLower = color.toLowerCase();
    if (colorLower === "ed") return "text-ed";
    if (colorLower === "red") return "text-red";
    if (colorLower === "orange") return "text-orange";
    if (colorLower === "yellow") return "text-yellow";
    if (colorLower === "green") return "text-green";
    return "";
  };

  const hasX2Rewards = (item: any) => {
    if (item._kind === "primes") {
      return item.x2;
    } else {
      return item.rewards.some((r: any) => r.x2);
    }
  };

  const getRarityName = (rarity: number) => {
    if (rarity === 2) return "RARE";
    if (rarity === 11) return "UNCOMMON";
    if (rarity === 25.33) return "COMMON";
    return rarity;
  };

  const getRarityColor = (rarity: number) => {
    if (rarity === 2) return "var(--color-ed)";
    if (rarity === 11) return "var(--color-orange)";
    if (rarity === 25.33) return "var(--color-green)";
    return "var(--text-secondary)";
  };

  const filterItems = () => {
    let list: any[] = [];

    // Add relics and primes based on type filter
    if (typeFilter === "all" || typeFilter === "relics") {
      list.push(...initialData.relics.map((r) => ({ ...r, _kind: "relics" })));
    }
    if (typeFilter === "all" || typeFilter === "primes") {
      list.push(...initialData.primes.map((p) => ({ ...p, _kind: "primes" })));
    }

    const filtered = list.filter((item) => {
      // Token filter (only for relics)
      if (item._kind === "relics" && tokenFilter && item.tokens < tokenFilter) {
        return false;
      }

      // Vaulted filter (only for relics)
      if (item._kind === "relics" && vaultedFilter !== "all" && String(item.vaulted) !== vaultedFilter) {
        return false;
      }

      // Name search
      if (nameSearch) {
        const txt = item._kind === "primes" ? item.item : item.name;
        if (!txt.toLowerCase().includes(nameSearch.toLowerCase())) {
          return false;
        }
      }

      // x2 filter
      if (x2Filter !== "all") {
        const hasX2 = hasX2Rewards(item);
        if (String(hasX2) !== x2Filter) {
          return false;
        }
      }

      // Color filters with rarity (only for relics)
      if (item._kind === "relics") {
        const colorFilters = {
          ed: edMinFilter,
          red: redMinFilter,
          orange: orangeMinFilter,
          yellow: yellowMinFilter,
          green: greenMinFilter
        };

        for (const [color, min] of Object.entries(colorFilters)) {
          const selectedRaritiesForColor = selectedRarities[color] || new Set();
          const matchingRewardsRarity = item.rewards.filter(
            (r: any) => r.color.toLowerCase() === color && selectedRaritiesForColor.has(r.rarity)
          );

          const matchingRewards = item.rewards.filter(
            (r: any) => r.color.toLowerCase() === color
          );

          if (min && min > 0) {
            if (matchingRewards.length < min) return false;
          }
          if (selectedRaritiesForColor.size > 0) {
            if (matchingRewardsRarity.length === 0) return false;
          }
        }
      }

      // Color filters for primes
      if (item._kind === "primes") {
        const color = item.color.toLowerCase();
        const minFilters = {
          ed: edMinFilter,
          red: redMinFilter,
          orange: orangeMinFilter,
          yellow: yellowMinFilter,
          green: greenMinFilter
        };

        // If any filter is active, and the item's color is not in the filtered set, reject it
        const anyFilterActive = Object.values(minFilters).some(val => val && val > 0);
        if (anyFilterActive && !(color in minFilters)) {
          return false;
        }

        // If the item's color has an active filter, check rarity match
        if (color in minFilters && minFilters[color as keyof typeof minFilters]) {
          const selectedRaritiesForColor = selectedRarities[color] || new Set();
          if (selectedRaritiesForColor.size > 0 && !selectedRaritiesForColor.has(item.rarity)) {
            return false;
          }
          return true;
        }

        // If no filters, or color has no min filter, let it through
        return !anyFilterActive;
      }

      return true;
    });

    setFilteredItems(filtered);
    onPageChange(1); // Reset to first page when filters change

    // Update result count with total items
    setResultCount([filtered.length, filtered.length]);
  };

  // Filter items whenever any filter changes
  useEffect(() => {
    filterItems();
  }, [
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
    selectedRarities,
    initialData
  ]);

  // Calculate current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Update result count when page changes
  useEffect(() => {
    setResultCount([currentItems.length, filteredItems.length]);
  }, [currentPage, filteredItems.length, currentItems.length]);

  const updateTooltipPositions = useCallback(() => {
    const inventoryRect = inventoryRef.current?.getBoundingClientRect();
    if (!inventoryRect) return;

    const newPositions: Record<number, boolean> = {};
    Object.entries(itemRefs.current).forEach(([index, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        // Check if tooltip would go off screen to the right
        const wouldOverflow = rect.right + 320 > inventoryRect.right; // 320px is tooltip width + padding
        newPositions[Number(index)] = wouldOverflow;
      }
    });

    // Only update if positions have actually changed
    const hasChanges = Object.keys(newPositions).some(
      key => newPositions[Number(key)] !== tooltipPositions[Number(key)]
    );

    if (hasChanges) {
      setTooltipPositions(newPositions);
    }
  }, [tooltipPositions]);

  // Debounced resize handler
  useEffect(() => {
    const handleResize = () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = window.setTimeout(updateTooltipPositions, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [updateTooltipPositions]);

  return (
    <div className="inventory" ref={inventoryRef}>
      {filteredItems.length === 0 ? (
        <div className="empty-message" style={{
          gridColumn: "1 / -1",
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-secondary)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <h3 style={{ marginBottom: "0.5rem" }}>No items found</h3>
          <p>Try adjusting your filters or add some items to your inventory.</p>
        </div>
      ) : (
        currentItems.map((item, index) => (
          <div 
            key={index} 
            className={`item ${item._kind === "primes" ? "prime-item" : ""}`}
            ref={el => {
              if (el) {
                itemRefs.current[index] = el;
                // Store the element for later processing
                pendingUpdatesRef.current[index] = el;
              } else {
                delete itemRefs.current[index];
                delete pendingUpdatesRef.current[index];
              }
            }}
          >
            {item._kind === "primes" ? (
              <>
                <h4 className={getColorClass(item.color)}>
                  {item.item}{item.x2 ? " (x2)" : ""}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p>
                    <span>Stock</span>
                    <span style={{ 
                      color: item.stock > 0 ? "var(--success)" : "var(--text-error)",
                      fontWeight: 600
                    }}>
                      {item.stock}
                    </span>
                  </p>
                  <p>
                    <span>Rarity</span>
                    <span style={{ 
                      color: getRarityColor(item.rarity),
                      fontWeight: 600
                    }}>
                      {getRarityName(item.rarity)}
                    </span>
                  </p>
                  <p>
                    <span>From Relics</span>
                    <span style={{ 
                      overflowY: "auto",
                      maxHeight: "120px",
                      paddingLeft: "10px",
                      color: "var(--text-secondary)"
                    }}>
                      {Array.isArray(item.relicFrom) ? item.relicFrom.join(", ") : item.relicFrom}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <h4>{item.name}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p>
                    <span>Status</span>
                    <span style={{ 
                      color: item.vaulted ? "var(--warning)" : "var(--success)",
                      fontWeight: 600
                    }}>
                      {item.vaulted ? "Vaulted" : "Unvaulted"}
                    </span>
                  </p>
                  <p>
                    <span>Tokens</span>
                    <span style={{ 
                      color: item.tokens > 0 ? "var(--success)" : "var(--text-secondary)",
                      fontWeight: 600
                    }}>
                      {item.tokens}
                    </span>
                  </p>
                  <div className={`tooltip ${tooltipPositions[index] ? 'right-aligned' : ''}`}>
                    {item.rewards.map((reward: any, rewardIndex: number) => (
                      <div key={rewardIndex} className="reward">
                        <span className={getColorClass(reward.color)}>
                          {reward.item}{reward.x2 ? " (x2)" : ""}
                        </span>
                        <div className="reward-info">
                          <span>
                            Stock: <span style={{ 
                              color: reward.stock > 0 ? "var(--success)" : "var(--text-error)",
                            }}>
                              {reward.stock}
                            </span>
                          </span>
                          <span style={{ 
                            color: getRarityColor(reward.rarity),
                          }}>
                            {getRarityName(reward.rarity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};