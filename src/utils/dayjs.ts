import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import utcSec from './plugins/utcSecond'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(utcSec);

export default dayjs