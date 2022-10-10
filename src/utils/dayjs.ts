import dayjs from "dayjs";

//plugins
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

//My plugins
import properFormat from './plugins/properFormat'
import weekAvailability from './plugins/weekAvailability'

import weekAvail2 from './plugins/weekAvail2'

dayjs.extend(utc)
dayjs.extend(tz)

dayjs.extend(properFormat, dayjs)
dayjs.extend(weekAvailability)
dayjs.extend(weekAvail2)

export default dayjs