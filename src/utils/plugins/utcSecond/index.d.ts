import { PluginFunc, ConfigType, Dayjs } from 'dayjs'

type TimeSeconds = {
  start: number;
  end: number
}

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    getTimeSeconds(): number

    utcSecond(endTime: Dayjs): (TimeSeconds | null)[]

    convFromSeconds(secondsArr: (TimeSeconds | null)[]): {start: Dayjs, end: Dayjs}
  }

  // export func for DayjsFuctory
}
