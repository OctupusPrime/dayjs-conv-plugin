import { PluginFunc, ConfigType, Dayjs } from 'dayjs'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    toJSON(): string
  }
}
