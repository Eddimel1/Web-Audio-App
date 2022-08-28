import React, { useEffect, useState } from 'react'
import classes from './dropDown.module.css'
import { SelectOption } from '../select/selectOption'
import {
  globalCompositeOperation,
  selectOptions,
  globalConfigKeyT,
  uninonSettingsType,
} from 'Pages/Equalizer/types/configTypes'
import { optionType } from '../select/selectOption'
import { dropDownType } from './dropDownConductor'

type propType = {
  toggle: boolean
  selectOptions: selectOptions | undefined
  config: React.MutableRefObject<uninonSettingsType>
  type: dropDownType
  option: globalConfigKeyT
}
export const DropDown = (props: propType) => {
  const [selected, setSelected] = useState<optionType>()
  useEffect(() => {
    if (selected) {
      if (props.type === 'composite') {
        props.config.current.globalCompositeOperation =
          selected as globalCompositeOperation
      } else {
        props.config.current[props.option] = selected
      }
    }
  }, [selected])

  return (
    <>
      {props.selectOptions &&
        props.selectOptions.map((option, i) => {
          return (
            <>
              {props.toggle && (
                <>
                  <SelectOption
                    selected={selected}
                    setSelected={setSelected}
                    option={option as optionType}
                    key={Date.now() + i}
                  ></SelectOption>
                </>
              )}
            </>
          )
        })}
    </>
  )
}
