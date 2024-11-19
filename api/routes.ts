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
        console.log('error', error.response.data)
        throw error
    })
}

export const getByRange = async (lat: number, long: number, radius: number) => {
    return api.get(`/travel?latitude=${lat}&longitude=${long}&radius=${radius}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getLastTravels = async (id: number, type: 'driver' | 'passenger') => {
    return api.get(`/travel/last/${type}/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getTravelById = async (id: number) => {
    return api.get(`/travel/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const acceptTravel = async (id: number, driverId: number, location: {longitude: number, latitude: number}) => {
    return api.put(`/travel/${id}/accept`, { driverId, ...location }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const cancelTravel = async (id: number, type: 'passenger'|'driver') => {
    return api.put(`/travel/${id}/cancel/${type}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const finishTravel = async (id: number) => {
    return api.put(`/travel/${id}/finish`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const initTravel = async (id: number) => {
    return api.put(`/travel/${id}/init`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const createChat = async (driver: string, passenger: string) => {
    return api.post('/chat', { driver, passenger }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getChatByTravel = async (id: number) => {
    return api.get(`/chat/travel/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getChat = async (id: number) => {
    return api.get(`/chat/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const sendMessage = async (id: number, message: string, user: number) => {
    return api.post(`/chat/message/${id}`, { content: message, sender: user }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getMessages = async (id: number) => {
    return api.get(`/chat/message/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const readMessages = async (id: number, userId: number) => {
    return api.put(`/chat/message/${id}/${userId}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getUnreadMessagesCount = async (id: number, userId: number) => {
    return api.get(`/chat/message/${id}/${userId}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getChatByPassenger = async (id: number) => {
    return api.get(`/chat/passenger/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getChatByDriver = async (id: number) => {
    return api.get(`/chat/driver/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getImportantDates = async (id: number) => {
    return api.get(`/dates/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const updateLocation = async (id: number, latitude: number, longitude: number, type: 'driver' | 'passenger') => {
    return api.put(`/travel/${id}/location`, { latitude, longitude, type }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getLocation = async (id: number, type: 'driver' | 'passenger') => {
    return api.get(`/travel/${id}/location/${type}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getTripDriver = async (id: number) => {
    return api.get(`/travel/driver/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const getActiveTravel = async (id: number, type: 'driver' | 'passenger') => {
    return api.get(`/travel/active/${type}/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const loginApp = async (login: string, password: string) => {
    return api.post('/user/login/app', { login, password }).then(response => {
        console.log('response', response.data)
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        if (error.response.status === 401) {
            return { error: 'Usuário ou senha inválidos' }
        }
        throw error
    })
}

export const createUser = async (data: FormData) => {
    return api.post('/user', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const updateAvatar = async (id: number, data: FormData) => {
    return api.put(`/user/${id}/avatar`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        throw error
    })
}

export const createDriver = async (data: FormData) => {
    return api.post('/driver', data , {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        console.log('error driver',JSON.stringify(error?.response?.data?.error?.issues))
        throw error
    })
}

export const getDriver = async (id: number) => {
    return api.get(`/driver/${id}`).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        console.log('error get driver',JSON.stringify(error?.response?.data?.error?.issues))
        throw error
    })
}

export const updateDriver = async (id: number, data: FormData) => {
    return api.put(`/driver/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        console.log('error update driver',JSON.stringify(error?.response?.data?.error?.issues))
        throw error
    })
}

export const createVehicle = async (data: FormData) => {
    return api.post('/vehicle', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        console.log('error vehicle',JSON.stringify(error?.response?.data?.error?.issues))
        throw error
    })
}

export const updateVehicle = async (id: number, data: FormData) => {
    return api.put(`/vehicle/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log('error', error.response.data)
        console.log('error update vehicle',JSON.stringify(error?.response?.data?.error?.issues))
        throw error
    })
}