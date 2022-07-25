import dayjs from "dayjs";

//plugins
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

//My plugins
import properFormat from './plugins/properFormat'
import weekAvailability from './plugins/weekAvailability'

dayjs.extend(utc)
dayjs.extend(tz)

dayjs.extend(properFormat, dayjs)
dayjs.extend(weekAvailability)

export default dayjs