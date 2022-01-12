import axios from "@/utils/axios";
import { userinfos } from "./data/user";

// export const toLogin = (data) => axios.get('/api/user/login', data);
export const toLogin = (data) => {
    let arr = userinfos.filter((item) => item.username === data.username)
    return arr[0]
}

// export const validate = (data) => axios.get('/api/user/login', data);
export const validate = (token) => {
    let arr = userinfos.filter((item) => item.token === token)
    return arr[0]
}