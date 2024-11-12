export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Trip {
    id: number;
    passengerName: string;
    passengerPhoto: string;
    distanceToPickup: string;
    totalDistance: string;
    fare: string;
    pickupCoordinates: Coordinates;
    dropoffCoordinates: Coordinates;
}
export interface TripRequest {
    latitude_origin: number;
    longitude_origin: number;
    latitude_destination: number;
    longitude_destination: number;
    actual_latitude_passenger: number;
    actual_longitude_passenger: number;
    passenger: number;
    driver?: number;
    value: number;
    destination: string;
}
