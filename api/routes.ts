import axios from 'axios';
import { TripRequest } from '../types/trip';
const urlApi = 'https://api-gestao-frota.onrender.com'
// const urlApi = 'http://localhost:3000'

export const api = axios.create({
    baseURL: urlApi
});

export const createTravel = async (data: TripRequest) => {
    return api.post('/travel', data).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getByRange = async (lat: number, long: number, radius: number) => {
    return api.get(`/travel?latitude=${lat}&longitude=${long}&radius=${radius}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

