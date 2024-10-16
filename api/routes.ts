import axios from 'axios';
import { TripRequest } from '../types/trip';
const urlApi = 'https://api-gestao-frota.onrender.com'

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

export const getLastTravels = async (id: string, type: 'driver' | 'passenger') => {
    return api.get(`/travel/last/${type}/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getTravelById = async (id: string) => {
    return api.get(`/travel/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const acceptTravel = async (id: string, driverId: string) => {
    return api.put(`/travel/${id}`, { driverId }).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const cancelTravel = async (id: string) => {
    return api.delete(`/travel/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const finishTravel = async (id: string) => {
    return api.put(`/travel/${id}/finish`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const initTravel = async (id: string) => {
    return api.put(`/travel/${id}/init`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const createChat = async (driver: string, passenger: string) => {
    return api.post('/chat', { driver, passenger }).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getChat = async (id: string) => {
    return api.get(`/chat/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const sendMessage = async (id: string, message: string, user: string) => {
    return api.post(`/chat/message/${id}`, { content: message, sender: user }).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getMessages = async (id: number) => {
    return api.get(`/chat/message/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getChatByPassenger = async (id: string) => {
    return api.get(`/chat/passenger/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getChatByDriver = async (id: string) => {
    return api.get(`/chat/driver/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getImportantDates = async (id: string) => {
    return api.get(`/dates/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const updateLocation = async (id: number, latitude: number, longitude: number, type: 'driver' | 'passenger') => {
    return api.put(`/travel/location/${id}`, { latitude, longitude, type }).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getLocation = async (id: number, type: 'driver' | 'passenger') => {
    return api.get(`/travel/location/${id}/${type}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}

export const getTripDriver = async (id: number) => {
    return api.get(`/travel/driver/${id}`).then(response => {
        return response.data
    }).catch(error => {
        throw error
    })
}