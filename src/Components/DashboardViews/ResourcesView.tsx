import React, { useState } from "react";
import { API_BASE_URL } from "../../config";
import { useToast } from "../Toaster";

// Types
type InventoryCategory = "Medical" | "Pharma" | "Surgical" | "General";
type StockStatus = "Optimal" | "Good" | "Low" | "Critical" | "Ordered";

interface InventoryItem {
  id: number;
  name: string;
  category: InventoryCategory;
  level: number; // 0-100
  status: StockStatus;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  consumptionPer100Patients: number; // % depletion per 100 patients
  recommendedRestock?: number; // Calculated quantity to order
}

interface CatalogItem {
  id: number;
  name: string;
  category: InventoryCategory;
  price: number;
  image: string; // Placeholder icon name
  description: string;
}

export const ResourcesView: React.FC = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<InventoryCategory | "All">("All");
  const [isProcurementOpen, setIsProcurementOpen] = useState(false);
  const [cart, setCart] = useState<{ [key: number]: number }>({}); // ItemID -> Quantity

  // Mock Inventory Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Oxygen Cylinders", category: "Medical", level: 98, status: "Optimal", unitPrice: 150, supplier: "AirLiquide", lastRestocked: "2023-10-20", consumptionPer100Patients: 5 },
    { id: 2, name: "PPE Kits", category: "General", level: 25, status: "Critical", unitPrice: 25, supplier: "SafetyFirst", lastRestocked: "2023-10-15", consumptionPer100Patients: 15 },
    { id: 3, name: "IV Fluids (NS)", category: "Pharma", level: 82, status: "Good", unitPrice: 12, supplier: "PharmaCorp", lastRestocked: "2023-10-22", consumptionPer100Patients: 8 },
    { id: 4, name: "Surgical Masks", category: "Surgical", level: 45, status: "Low", unitPrice: 0.5, supplier: "SafetyFirst", lastRestocked: "2023-10-18", consumptionPer100Patients: 20 },
    { id: 5, name: "Paracetamol 500mg", category: "Pharma", level: 90, status: "Optimal", unitPrice: 2, supplier: "PharmaCorp", lastRestocked: "2023-10-21", consumptionPer100Patients: 2 },
    { id: 6, name: "Syringes 5ml", category: "Surgical", level: 15, status: "Critical", unitPrice: 0.2, supplier: "MediEquip", lastRestocked: "2023-10-10", consumptionPer100Patients: 12 },
    { id: 7, name: "Bandages", category: "General", level: 60, status: "Good", unitPrice: 5, supplier: "MediEquip", lastRestocked: "2023-10-19", consumptionPer100Patients: 5 },
  ]);

  React.useEffect(() => {
    const updateInventoryBasedOnPrediction = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            aqi: 150,
            temp: 32,
            humidity: 70,
            is_festival: 0
          })
        });
        const data = await response.json();
        const predictedPatients = data.predicted_patients;

        // Simulate resource depletion: more patients = lower levels
        // Also calculate recommended restock if projected level drops below 30%
        setInventory(prev => prev.map(item => {
          // Mock logic: consumption based on patient count
          const projectedDepletion = (predictedPatients / 100) * item.consumptionPer100Patients;
          const projectedLevel = Math.max(0, item.level - projectedDepletion);

          let recommendedQty = undefined;
          // If projected level is critical (<30%), recommend restock
          if (projectedLevel < 30) {
            // Recommend enough to get back to 100% + buffer
            recommendedQty = Math.ceil((100 - projectedLevel) * 10); // Arbitrary multiplier for units
          }

          // Update status based on CURRENT level (visuals), but store recommendation
          // We don't change current status based on prediction, only show the button

          return { ...item, recommendedRestock: recommendedQty };
        }));

      } catch (error) {
        console.error("Failed to update inventory", error);
      }
    };
    updateInventoryBasedOnPrediction();
  }, []);

  // Mock Catalog Data
  const catalog: CatalogItem[] = [
    { id: 101, name: "N95 Masks", category: "Surgical", price: 1.5, image: "ph-mask-happy", description: "High filtration efficiency masks." },
    { id: 102, name: "Gloves (Latex)", category: "Surgical", price: 12, image: "ph-hand", description: "Box of 100 disposable gloves." },
    { id: 103, name: "Sanitizer (5L)", category: "General", price: 45, image: "ph-drop", description: "Alcohol-based hand sanitizer." },
    { id: 104, name: "Ventilator Tubing", category: "Medical", price: 120, image: "ph-activity", description: "Sterile tubing for ventilators." },
    { id: 105, name: "Antibiotics", category: "Pharma", price: 50, image: "ph-pill", description: "Broad-spectrum antibiotics pack." },
  ];

  const handleRestock = (id: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Ordered" } : item
      )
    );
    setTimeout(() => {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Optimal", level: 100, recommendedRestock: undefined } : item
        )
      );
    }, 2000);
  };

  const handleDynamicRestock = async (item: InventoryItem) => {
    if (!item.recommendedRestock) return;

    try {
      const response = await fetch(`${API_BASE_URL}/send_restock_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: item.name,
          quantity: item.recommendedRestock,
          vendor_email: "jjadhavshreyas84@gmail.com"
        })
      });
      const data = await response.json();
      if (data.status === "success") {
        toast(`Restock request sent for ${item.name} (${item.recommendedRestock} units)`, "success");
        // Mark as ordered
        setInventory(prev => prev.map(i => i.id === item.id ? { ...i, status: "Ordered", recommendedRestock: undefined } : i));
      } else {
        toast(data.message || "Failed to send email", "error");
      }
    } catch (e) {
      console.error(e);
      toast("Failed to send restock request. Check backend connection.", "error");
    }
  };

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const filteredInventory =
    activeCategory === "All"
      ? inventory
      : inventory.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-6 relative">
      <header className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Hospital Inventory</h1>
          <p className="text-gray-500">
            Comprehensive tracking of medical supplies and equipment.
          </p>
        </div>
        <button
          onClick={() => setIsProcurementOpen(true)}
          className="px-4 py-2 bg-black text-white border-2 border-black rounded text-sm font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_#111] flex items-center gap-2"
        >
          <i className="ph-bold ph-shopping-cart"></i>
          Request Stock
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Inventory Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["All", "Medical", "Pharma", "Surgical", "General"] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-xs font-bold rounded-full border border-black transition-all whitespace-nowrap ${activeCategory === cat
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                    }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#111] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b-2 border-black">
                <tr>
                  <th className="p-4 font-bold uppercase text-xs">Item Name</th>
                  <th className="p-4 font-bold uppercase text-xs">Category</th>
                  <th className="p-4 font-bold uppercase text-xs w-1/4">Stock Level</th>
                  <th className="p-4 font-bold uppercase text-xs">Status</th>
                  <th className="p-4 font-bold uppercase text-xs text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="p-4 font-bold">
                      {item.name}
                      <div className="text-[10px] text-gray-400 font-normal">
                        {item.supplier} • ${item.unitPrice}/unit
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium border border-gray-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.level < 30 ? "bg-red-500" : item.level < 60 ? "bg-orange-400" : "bg-lime-400"
                            }`}
                          style={{ width: `${item.level}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-right mt-1 font-mono">{item.level}%</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold ${item.status === "Critical" ? "text-red-600" :
                          item.status === "Low" ? "text-orange-600" :
                            item.status === "Ordered" ? "text-blue-600" : "text-green-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.status !== "Ordered" && item.level < 100 && !item.recommendedRestock && (
                        <button
                          onClick={() => handleRestock(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black text-white px-3 py-1 rounded font-bold hover:bg-lime-400 hover:text-black"
                        >
                          Restock
                        </button>
                      )}
                      {item.status !== "Ordered" && item.recommendedRestock && (
                        <button
                          onClick={() => handleDynamicRestock(item)}
                          className="flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 animate-pulse shadow-[2px_2px_0px_0px_#000]"
                        >
                          <i className="ph-bold ph-lightning"></i>
                          Auto-Restock ({item.recommendedRestock})
                        </button>
                      )}
                      {item.status === "Ordered" && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded animate-pulse font-bold">
                          Ordered
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Roster (Side Panel) */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#111]">
            <h2 className="text-lg font-bold font-display mb-4">
              Staff Roster
            </h2>
            <div className="space-y-4">
              {[
                { shift: "Shift A (08:00 - 16:00)", status: "Active", count: "24/24" },
                { shift: "Shift B (16:00 - 00:00)", status: "Scheduled", count: "22/24" },
                { shift: "Shift C (00:00 - 08:00)", status: "Scheduled", count: "18/20" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100"
                >
                  <div>
                    <div className="font-bold text-sm">{s.shift}</div>
                    <div className="text-xs text-gray-500">{s.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono">{s.count}</div>
                    <div className="text-xs text-gray-400 uppercase">Staff</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button className="text-xs font-bold text-blue-600 hover:underline">View Full Schedule</button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black text-white p-4 border-2 border-lime-400 shadow-[4px_4px_0px_0px_#bef264]">
              <div className="text-2xl font-bold font-mono text-lime-400">12</div>
              <div className="text-[10px] uppercase font-bold">Pending Orders</div>
            </div>
            <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#111]">
              <div className="text-2xl font-bold font-mono text-red-500">3</div>
              <div className="text-[10px] uppercase font-bold">Critical Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Procurement Modal */}
      {isProcurementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#111] w-full max-w-4xl h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold font-display">Procurement Catalog</h3>
                <p className="text-xs text-gray-500">Select items to request from central supply.</p>
              </div>
              <button onClick={() => setIsProcurementOpen(false)} className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <i className="ph-bold ph-x"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalog.map(item => (
                  <div key={item.id} className="border border-gray-200 p-4 rounded hover:border-black hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">
                        <i className={`ph-fill ${item.image}`}></i>
                      </div>
                      <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="font-mono font-bold">${item.price}</div>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="px-3 py-1 bg-black text-white text-xs font-bold rounded hover:bg-lime-400 hover:text-black transition-colors"
                      >
                        Add {cart[item.id] ? `(${cart[item.id]})` : ''}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-black bg-gray-50 flex justify-between items-center">
              <div className="text-sm">
                <span className="font-bold">{Object.values(cart).reduce((a, b) => a + b, 0)}</span> items selected
              </div>
              <button
                onClick={() => {
                  alert("Order placed successfully!");
                  setIsProcurementOpen(false);
                  setCart({});
                }}
                className="px-6 py-2 bg-lime-400 text-black border-2 border-black font-bold rounded hover:bg-lime-500 shadow-[4px_4px_0px_0px_#111]"
              >
                Place Order Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
