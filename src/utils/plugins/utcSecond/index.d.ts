import { PluginFunc, ConfigType, Dayjs } from 'dayjs'

type TimeSeconds = ({
  start: number;
  end: number
} | null)

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    getTimeSeconds(): number

    utcSecond(endTime: Dayjs, currDate: Dayjs): TimeSeconds[]

    convFromSeconds(secondsArr: TimeSeconds[] | TimeSeconds): {start: Dayjs, end: Dayjs}
  }

  // export func for DayjsFuctory
}
