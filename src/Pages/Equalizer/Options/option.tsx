import React, { useState } from 'react'
import classes from './option.module.css'
import {
  globalConfigKeyT,
  selectOptions,
  uninonSettingsType,
} from '../types/configTypes'
import { Slider } from '../UI/slider/slider'
import { DropDownConductor } from '../UI/dropDown/dropDownConductor'

// to extend amount of configs generics should be used instead of a union
type propType<T, K> = {
  type: 'select' | 'number' | 'color'
  option: globalConfigKeyT // multiple options
  config: React.MutableRefObject<uninonSettingsType>
  min?: number
  max?: number
  step?: number
  multiplier?: number
  selectOptions?: selectOptions | undefined
}

export const Option = <T, K>(props: propType<T, K>) => {
  // @ts-ignore
  const [value, setValue] = useState<string>(props.config.current[props.option])
  type keysOfConfig = keyof typeof props.config
  const inputCb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbVal = Number(Number(e.target.value).toFixed(2))
    if (props.max && props.min?.toString()) {
      const value = numbVal >= props.max ? props.max : numbVal
      setValue(value.toString())
      // @ts-ignore
      props.config.current[props.option] = value.toString()
    }
  }
  if (props.type === 'number') {
    return (
      <>
        <div className={classes.optionName}>{props.option}</div>
        <input
          min={props.min}
          max={props.max}
          step={props.step}
          value={value}
          onChange={inputCb}
          className={classes.numberInput}
          type="number"
        ></input>
        <Slider
          value={value}
          setValue={setValue}
          option={props.option}
          config={props.config}
          multiplier={props.multiplier}
        ></Slider>
      </>
    )
  }

  return (
    <>
      <div className={classes.optionContainer}>
        <div className={classes.optionName}>{props.option}</div>

        <DropDownConductor
          option={props.option}
          config={props.config}
          selectOptions={props.selectOptions}
        ></DropDownConductor>
      </div>
    </>
  )
}
