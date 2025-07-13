import React from "react";

function ShadowPricingTab({ open, onClose, data = []}) {
    if (!open) return null;

    // Filter out unwanted rows
    const filteredData = data.filter(
      row => row.constraint !== "Total Ratio" && row.shadowPrice !== 0
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold flex-1">Shadow Prices</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded transition"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 font-bold text-left">Items</th>
                                <th className="px-4 py-2 font-bold text-left">Shadow Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="text-center py-4 text-gray-500">
                                      <span className="font-bold">No data available.</span>
                                        <br/>
                                        Make sure to run the <span className="font-bold text-green-button">Simplex</span> solver first.
                                        <br/>
                                        <span className="text-xs text-red-600">[Unavailable for Particle Swarm Optimization]</span>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                              <tr>
                                <td colSpan={2} className="text-center py-4 text-gray-500">
                                  <span className="font-bold">No shadow prices to display.</span>
                                </td>
                              </tr>
                            ) : (
                              filteredData.map((row, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-2">{row.constraint}</td>
                                        <td className="px-4 py-2">{row.shadowPrice.toFixed(4)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShadowPricingTab;