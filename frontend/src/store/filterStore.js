import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  filters: {
    yearRange: [2015, 2025],
    industries: [],
    regions: [],
    minESGScore: 0,
    minRevenue: 0,
    maxCarbonEmissions: 999999999,
    maxEnergyConsumption: 999999999,
    minGrowthRate: -100
  },
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({
    filters: {
      yearRange: [2015, 2025],
      industries: [],
      regions: [],
      minESGScore: 0,
      minRevenue: 0,
      maxCarbonEmissions: 999999999,
      maxEnergyConsumption: 999999999,
      minGrowthRate: -100
    }
  })
}))
