import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/cars";

export const getAllCars = () => axios.get(API_URL);
export const createCar = (data) => axios.post(API_URL, data);
export const updateCar = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteCar = (id) => axios.delete(`${API_URL}/${id}`);
