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
