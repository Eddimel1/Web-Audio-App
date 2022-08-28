import {
  globalConfigKeyT,
  uninonSettingsType,
} from 'Pages/Equalizer/types/configTypes'
import { accessAnyConfigProp } from '../../types/utilsForTypes'
import React from 'react'
import classes from './colorPicker.module.css'

type propType = {
  option: globalConfigKeyT
  config: React.MutableRefObject<uninonSettingsType>
}

export const ColorPicker = (props: propType) => {
  return (
    <div className={classes.colorPickerContainer}>
      <div className={classes.optionName}>{props.option}</div>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          accessAnyConfigProp(
            props.config.current,
            props.option,
            e.target.value
          )
        }
        type="color"
      />
    </div>
  )
}
