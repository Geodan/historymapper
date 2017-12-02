import './less/app.less'

import {getData} from './data'
import {getUrlVars} from './utils/getUrlVars'
import {createMapData} from './maps'

let varobj = getUrlVars()

varobj.url?getData(varobj.url):getData('1tZFtz3UKRoLUzDR26wtcQ4OhQCcK4kL-to-SY-bmW2M')
