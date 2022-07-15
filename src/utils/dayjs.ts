import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import utcSec from './plugins/utcSecond'
import blockDurations from "./plugins/blockDurations";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(utcSec);
dayjs.extend(blockDurations);

export default dayjs