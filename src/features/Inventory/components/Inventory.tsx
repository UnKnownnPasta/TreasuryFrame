
import './inventory.css'

function InventoryPage() {
  // @ts-ignore
  const inventory = [
    { id: 1, name: "Item 1", category: "A" },
    { id: 2, name: "Item 2", category: "B" },
    // ... more items
  ];

  return (
    <div className="inventory-page">
      <div className="controls">
        <h2>Filters</h2>
        <div className="slider-control">
          <label>Category A</label>
          <input type="range" min="0" max="100" />
        </div>
        <div className="slider-control">
          <label>Category B</label>
          <input type="range" min="0" max="100" />
        </div>
      </div>
      <div className="inventory-list">
        <h2>Inventory</h2>
        <ul>
          {/* @ts-ignore */}
          {inventory.map(item => (
            <li key={item.id}>
              <strong>{item.name}</strong> - {item.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InventoryPage;
