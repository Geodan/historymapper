import './less/app.less'

import {getData} from './data'
import {getUrlVars} from './utils/getUrlVars'


let varobj = getUrlVars()

varobj.source?getData(varobj.source):getData('1tZFtz3UKRoLUzDR26wtcQ4OhQCcK4kL-to-SY-bmW2M')
