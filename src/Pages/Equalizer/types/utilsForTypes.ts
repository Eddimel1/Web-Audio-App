import { drawWithSvgConf } from './../drawFunctions/drawWithSvg'
import { drawWithCirclesConf } from '../drawFunctions/drawCircles'
import { drawWithTreeConf } from '../drawFunctions/drawWithTree'
import { drawWithImageConf } from '../drawFunctions/withDrawImage'

import { globalSettings, uninonSettingsType } from './configTypes'

export function accessProp<T extends {}, K extends keyof T>(
  obj: T,
  prop: K,
  val: unknown
) {
  obj[prop] = val as T[K]
}

export function accessAnyConfigProp<
  T extends uninonSettingsType,
  K extends unknown
>(obj: T, prop: K, val: unknown) {
  if (obj.kind === 'global') {
    const option = prop as keyof globalSettings // union of keys
    const config = obj as globalSettings
    accessProp(config, option, val)
  } else if (obj.kind === 'drawWithCircles') {
    const option = prop as keyof drawWithCirclesConf
    const config = obj as drawWithCirclesConf
    accessProp(config, option, val)
  } else if (obj.kind === 'drawWithImage') {
    const option = prop as keyof drawWithImageConf
    const config = obj as drawWithImageConf
    accessProp(config, option, val)
  } else if (obj.kind === 'drawWithTree') {
    const option = prop as keyof drawWithTreeConf
    const config = obj as drawWithTreeConf
    accessProp(config, option, val)
  } else if (obj.kind === 'drawWithSvg') {
    const option = prop as keyof drawWithSvgConf
    const config = obj as drawWithSvgConf
    accessProp(config, option, val)
  }
}
