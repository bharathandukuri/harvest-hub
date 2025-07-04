import React from "react";

interface ProductFiltersProps {
    filters: {
        searchTerm: string;
        minPrice: number;
        maxPrice: number;
        selectedBadges: string[];
    };
    onFilterChange: (filterName: string, value: any) => void;
    allBadges: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters,
    onFilterChange,
    allBadges,
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Filters</h2>

            <div className="mb-4">
                <label
                    htmlFor="searchTerm"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Search Product
                </label>
                <input
                    type="text"
                    id="searchTerm"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., headphones, chair"
                    value={filters.searchTerm}
                    onChange={(e) =>
                        onFilterChange("searchTerm", e.target.value)
                    }
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        className="w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Min"
                        value={filters.minPrice === 0 ? "" : filters.minPrice}
                        onChange={(e) =>
                            onFilterChange(
                                "minPrice",
                                parseFloat(e.target.value) || 0
                            )
                        }
                    />
                    <span>-</span>
                    <input
                        type="number"
                        className="w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Max"
                        value={
                            filters.maxPrice === Infinity
                                ? ""
                                : filters.maxPrice
                        }
                        onChange={(e) =>
                            onFilterChange(
                                "maxPrice",
                                parseFloat(e.target.value) || Infinity
                            )
                        }
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badges
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {allBadges.map((badge) => (
                        <div key={badge} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`badge-${badge}`}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={filters.selectedBadges.includes(badge)}
                                onChange={(e) => {
                                    const newBadges = e.target.checked
                                        ? [...filters.selectedBadges, badge]
                                        : filters.selectedBadges.filter(
                                              (b) => b !== badge
                                          );
                                    onFilterChange("selectedBadges", newBadges);
                                }}
                            />
                            <label
                                htmlFor={`badge-${badge}`}
                                className="ml-2 text-sm text-gray-700"
                            >
                                {badge}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
