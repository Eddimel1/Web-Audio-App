import classes from './globalOptions.module.css'
import React from 'react'
import {
  globalConfigKeyT,
  optionsUnion,
  selectOptions,
  uninonSettingsType,
} from '../types/configTypes'
import { Option } from './option'
import { ColorPicker } from '../UI/colorPicker/colorPicker'

type propType<T, K> = {
  config: React.MutableRefObject<uninonSettingsType>
  options: optionsUnion
  divider?: number
}

export const GlobalOptions = <T extends {}, K extends { type: string }>(
  props: propType<T, K>
) => {
  return (
    <>
      {props.options.map((option, i: number) => {
        if (option.type === 'number') {
          return (
            <Option
              min={option.min}
              max={option.max}
              step={option.step}
              multiplier={option.multiplier}
              key={Date.now() + i}
              config={props.config}
              type={option.type}
              option={option.option as globalConfigKeyT}
            ></Option>
          )
        } else if (option.type === 'select' && option.selectOptions) {
          return (
            <Option
              key={Date.now() + i}
              config={props.config}
              type={option.type}
              option={option.option}
              selectOptions={option.selectOptions as selectOptions}
            ></Option>
          )
        } else if (option.type === 'color') {
          return (
            <ColorPicker
              key={Date.now() + i}
              option={option.option as globalConfigKeyT}
              config={props.config}
            ></ColorPicker>
          )
        }
      })}
    </>
  )
}
