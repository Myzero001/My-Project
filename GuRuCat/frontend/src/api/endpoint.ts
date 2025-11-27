import axios from "axios";

export const GET_MOOD = async()=>{
    return await axios.get(`http://127.0.0.1:5001/get-mood`);
}

export const PREDICT = async ()=>{
    return await axios.post(`http://127.0.0.1:5001/predict`)
}

export const GET_TEMP = async ()=>{
    return await axios.get(`http://127.0.0.1:5001/get-temp`)
}

export const GET_PULSE = async ()=>{
    return await axios.get(`http://127.0.0.1:5001/get-pulse`)
}
export const GET_MOTION = async ()=>{
    return await axios.get(`http://127.0.0.1:5001/get-motion`)
}