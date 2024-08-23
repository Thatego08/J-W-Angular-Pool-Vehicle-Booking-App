export interface RefuelVehicle {
    tripId: number; // ID of the trip associated with the refuel
    fuelQuantity?: number; // Optional quantity of fuel added
    fuelCost?: number; // Optional cost of the fuel added
    oilLevel?: string; // Optional oil level, assuming it's a string
    tyrePressure?: string; // Optional tyre pressure, assuming it's a string
    tyreCondition?: string; // Optional tyre condition, assuming it's a string
    comments?: string; // Optional comments for the refuel
  }
  