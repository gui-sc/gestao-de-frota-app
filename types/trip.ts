export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Trip {
    id: string;
    passengerName: string;
    passengerPhoto: string;
    distanceToPickup: string;
    totalDistance: string;
    fare: string;
    pickupCoordinates: Coordinates;
    dropoffCoordinates: Coordinates;
}
export interface TripRequest {
    latitudeorigin: number;
    longitudeorigin: number;
    latitudedestination: number;
    longitudedestination: number;
    passenger: number;
    driver?: number;
    value: number;
}
