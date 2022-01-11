import * as Types from '@/store/modules/action-types.js'
import { fecthSlides } from '@/api/home.js'

const homeActions = {
    async [Types.SET_SLIDES](context, payload) {
        context.commit(Types.SET_SLIDES, [1])
        let slides = await fecthSlides()
    }
}
export default homeActions