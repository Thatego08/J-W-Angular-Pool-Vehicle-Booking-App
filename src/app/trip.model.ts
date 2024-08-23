export interface TripModel {
    MediaFiles: any;
    tripId: number;
    name: string;
    location: string;
  
    comment: string;
    travelStart: Date;
    travelEnd: Date;
    
    mediaDescription?: string;
    userName: string;
    
}


