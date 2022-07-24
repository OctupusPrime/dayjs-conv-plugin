import dayjs from "dayjs";

//plugins
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

//My plugins
import JSONformat from './plugins/JSONformat'
import weekAvailability from './plugins/weekAvailability'

dayjs.extend(utc)
dayjs.extend(tz)

dayjs.extend(JSONformat)
dayjs.extend(weekAvailability)

export default dayjs