export interface Refuel {
    refuelVehicleId: number;
    tripId: number;
    oilLevel: string;
    tyrePressure: string;
    tyreCondition: string;
    comments: string;
    fuelQuantity: number;
    fuelCost: number;
    trip: {
    Name: string; //vehicle name
}
}
