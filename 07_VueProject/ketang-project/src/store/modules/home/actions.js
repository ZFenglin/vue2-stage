import * as Types from '@/store/modules/action-types.js'
import { fecthSlides } from '@/api/home.js'

const homeActions = {
    async [Types.SET_SLIDES](context, payload) {
        let slides = await fecthSlides()
        context.commit(Types.SET_SLIDES, slides)
    }
}
export default homeActions