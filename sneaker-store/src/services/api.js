import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7178"

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export const productService = {
    getAll: () => api.get("/api/products"),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (data) => api.post("/api/products", data),
}

export const authService = {
    login: (data) => api.post("/api/auth/login", data),
    register: (data) => api.post("/api/auth/register", data),
}

export const userService = {
    getById: (id) => api.get(`/api/users/${id}`),
    update: (id, data) => api.put(`/api/users/${id}`, data),
    changePassword: (id, data) => api.post(`/api/users/${id}/change-password`, data),
}

export const orderService = {
    create: (data) => api.post("/api/orders", data),
    getByUser: (userId) => api.get(`/api/orders/user/${userId}`),
}

export default api
