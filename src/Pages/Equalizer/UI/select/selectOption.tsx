import React from 'react'
import classes from './selectOption.module.css'
import {
  globalCompositeOperation,
  lineCapType,
  lineJoinType,
} from '../../types/configTypes'
export type optionType = globalCompositeOperation | lineCapType | lineJoinType

type propType = {
  option: optionType
  setSelected: React.Dispatch<React.SetStateAction<optionType | undefined>>
  selected: string
}

export const SelectOption = (props: propType) => {
  return (
    <div
      style={{
        backgroundColor: `${props.selected === props.option ? 'orange' : ''}`,
      }}
      className={classes.option}
      onClick={() => {
        props.setSelected(props.option)
      }}
    >
      {props.option}
    </div>
  )
}
