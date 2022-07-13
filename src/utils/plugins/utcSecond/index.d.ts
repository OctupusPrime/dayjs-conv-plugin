import { PluginFunc, ConfigType, Dayjs } from 'dayjs'

type TimeSeconds = ({
  start: number;
  end: number
} | null) | {start: number, end: number}

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    getTimeSeconds(): number

    utcSecond(endTime: Dayjs): TimeSeconds

    convFromSeconds(secondsArr: TimeSeconds): {start: Dayjs, end: Dayjs}
  }

  // export func for DayjsFuctory
}
