import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { VehicleCard } from "./VehicleCard";
import { Badge } from "./ui/badge";

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'model' | 'fuel_type';

export function Home() {
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  // 1. ADD LOADING STATE
  const [isLoading, setIsLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFuelType, setFilterFuelType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true); // Ensure loading is true when fetch starts
    fetch("https://rentigo-backendnw.onrender.com/api/vehicles")
      .then(res => res.json())
      .then(data => {
        setAllVehicles(data);
        setIsLoading(false); // 2. SET TO FALSE ONCE DATA ARRIVES
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setIsLoading(false); // 3. SET TO FALSE EVEN ON ERROR
      });
  }, []);

  const vehicleTypes = useMemo(() => {
    return Array.from(new Set(allVehicles.map(v => v.type))).filter(Boolean).sort();
  }, [allVehicles]);

  const fuelTypes = useMemo(() => {
    return Array.from(new Set(allVehicles.map(v => v.fuel_type))).filter(Boolean).sort();
  }, [allVehicles]);
  
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(vehicle => {
      const isAvailable = Number(vehicle.availability) === 1 || vehicle.availability === true;
      if (!isAvailable) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.type.toLowerCase().includes(query) ||
          (vehicle.brand && vehicle.brand.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filterType !== "all" && vehicle.type !== filterType) return false;
      if (filterFuelType !== "all" && vehicle.fuel_type !== filterFuelType) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price_per_day - b.price_per_day;
        case 'price_desc': return b.price_per_day - a.price_per_day;
        case 'model': return a.model.localeCompare(b.model);
        default: return 0;
      }
    });
  }, [allVehicles, searchQuery, filterType, filterFuelType, sortBy]);

  const recommendedVehicles = useMemo(() => {
    return allVehicles.filter(v => Number(v.availability) === 1 || v.availability === true);
  }, [allVehicles]);

  const activeFiltersCount = (filterType !== "all" ? 1 : 0) + (filterFuelType !== "all" ? 1 : 0);

  const handleClearFilters = () => {
    setFilterType("all");
    setFilterFuelType("all");
    setSearchQuery("");
    setSortBy("relevance");
  };

  const displayVehicles = searchQuery || activeFiltersCount > 0 ? filteredVehicles : recommendedVehicles;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0D1F22] to-[#135E35] rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Find Your Perfect Ride</h1>
        <p className="text-lg text-white/90 mb-6">Choose from available vehicles for rent</p>

        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by model, brand, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-black" 
            />
          </div>
          <Button onClick={() => setShowFilters(!showFilters)} variant="secondary" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5">{activeFiltersCount}</Badge>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-black">Vehicle Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-black">Fuel Type</label>
              <Select value={filterFuelType} onValueChange={setFilterFuelType}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select Fuel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  {fuelTypes.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-black">Sort By</label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-black">
          {searchQuery || activeFiltersCount > 0 ? "Search Results" : "Recommended for You"}
          {!isLoading && ( // Only show count if loading is finished
            <span className="text-gray-500 text-lg ml-2">
              ({displayVehicles.length} available)
            </span>
          )}
        </h2>

        {/* 4. CONDITIONAL RENDERING BASED ON LOADING STATE */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 animate-pulse">Loading vehicles...</p>
          </div>
        ) : displayVehicles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border text-black">
            <p>No vehicles found matching your criteria</p>
            <Button onClick={handleClearFilters} variant="outline" className="mt-4">Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}