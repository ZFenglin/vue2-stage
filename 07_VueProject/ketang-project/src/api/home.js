import axios from "@/utils/axios";
import { slider } from "./data/home";

// 设置接口 state => action-types => api => actions => mutations
// export const fecthSlides = () => axios.get('/api/slider')
export const fecthSlides = () => slider