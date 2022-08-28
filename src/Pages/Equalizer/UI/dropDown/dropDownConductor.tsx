import {
  arrayOfCompositeOperation,
  selectOptions,
  lineCapOptions,
  lineJoinOptions,
  uninonSettingsType,
  globalConfigKeyT,
} from '../../types/configTypes'
import React, { useState } from 'react'
import classes from './dropDownConductor.module.css'
import { DropDown } from './dropDown'

type propType = {
  selectOptions: selectOptions | undefined
  config: React.MutableRefObject<uninonSettingsType>
  option: globalConfigKeyT
}
export type dropDownType = 'composite' | 'linecap' | 'lineJoin' | undefined
export const DropDownConductor = (props: propType) => {
  const [toggle, setToggle] = useState<boolean>(false)
  const dropDownTypeChecker = (): dropDownType => {
    if (props.selectOptions === arrayOfCompositeOperation) {
      return 'composite'
    } else if (props.selectOptions === lineCapOptions) {
      return 'linecap'
    } else if (props.selectOptions === lineJoinOptions) {
      return 'lineJoin'
    }
  }
  if (dropDownTypeChecker() === 'composite') {
    return (
      <>
        <div
          onClick={() => {
            setToggle((prev) => !prev)
          }}
          className={classes.toggleIcon}
        >
          {' '}
          {toggle ? 'hide' : 'show'}
        </div>
        <div
          className={`${
            dropDownTypeChecker() === 'composite' && toggle
              ? classes.dropDownGrid
              : classes.dropDown
          }`}
        >
          <DropDown
            option={props.option}
            type={dropDownTypeChecker()}
            config={props.config}
            toggle={toggle}
            selectOptions={props.selectOptions}
          ></DropDown>
        </div>
      </>
    )
  }
  return (
    <>
      <div className={classes.dropDown}>
        <DropDown
          option={props.option}
          type={dropDownTypeChecker()}
          config={props.config}
          toggle={true}
          selectOptions={props.selectOptions}
        ></DropDown>
      </div>
    </>
  )
}
