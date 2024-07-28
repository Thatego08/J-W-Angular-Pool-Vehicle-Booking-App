import { DecimalPipe } from "@angular/common";

export interface VehicleChecklist{
    id: number;
    vehicleId: number;
    userName: string;
    openingKms: number;
    exteriorChecks: ExteriorChecks;
    interiorChecks: InteriorChecks;
    underTheHoodChecks: UnderTheHoodChecks;
    functionalTests: FunctionalTests;
    safetyEquipment: SafetyEquipment;
    documentation: Documentation;

}

export interface ExteriorChecks{
    mirrors: boolean;
    oilWaterLeaks: boolean;
    headLights: boolean;
    parkLights: boolean;
    brakeLights: boolean;
    strobeLights: boolean;
    reverseLight: boolean;
    tyreCondition: boolean;
    spareWheelPresent: boolean;
    damageToInteriorBodywork: boolean;
    marketingMagnets: boolean
}

export interface InteriorChecks{
    horn: boolean;
    seatbelt: boolean;
    sunVisor: boolean;
    sunblock: boolean;
    windscreen: boolean;
}

export interface FunctionalTests{
    indicator: boolean;
    reverseHooter: boolean;
    brakes: boolean;
    handbrake: boolean;
}

export interface UnderTheHoodChecks{
    fuelLevel: boolean;
    
}

export interface SafetyEquipment{
   fireExtinguisher: boolean;
   inspectionValid: boolean;
   triangleInPlace3x: boolean;
   jackWheelPresent: boolean; 
}

export interface Documentation{
    licenseDisks: boolean;
    checkedBySecurity: boolean;
    returnVehicle: boolean;
}