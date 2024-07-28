import { DecimalPipe } from "@angular/common";


export interface PostChecklist {
    postId: number;
    vehicleId: number;
    userName: string;
    returnVehicle: boolean;
    openingKms: DecimalPipe;
    closingKms: DecimalPipe;
    distanceTravelled?: number;
    exteriorChecks: PostExteriorChecks;
    interiorChecks: PostInteriorChecks;
    underTheHoodChecks: PostUnderTheHoodChecks;
    functionalTests: PostFunctionalTests;
    safetyEquipment: PostSafetyEquipment;
    documentation: PostDocumentation;
  }
  
  export interface PostExteriorChecks {
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
    marketingMagnets: boolean;
  }
  
  export interface PostInteriorChecks {
    horn: boolean;
    seatbelt: boolean;
    sunVisor: boolean;
    sunblock: boolean;
    windscreen: boolean;
  }
  
  export interface PostUnderTheHoodChecks {
    fuelLevel: boolean;
  }
  
  export interface PostFunctionalTests {
    indicator: boolean;
    reverseHooter: boolean;
    brakes: boolean;
    handbrake: boolean;
  }
  
  export interface PostSafetyEquipment {
    fireExtinguisher: boolean;
    inspectionValid: boolean;
    triangleInPlace3x: boolean;
    jackWheelPresent: boolean;
  }
  
  export interface PostDocumentation {
    licenseDisks: boolean;
    checkedBySecurity: boolean;
  }
  