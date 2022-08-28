import React, { useEffect, useState } from 'react'
import classes from './switcher.module.css'
import { filterType } from 'components/Classes/Oscillator'

export type filterOptionsArrayType = (
  | 'lowpass'
  | 'highpass'
  | 'bandpass'
  | 'lowshelf'
  | 'highshelf'
  | 'peaking'
  | 'notch'
  | 'allpass'
)[]
type propType = {
  id: string
  value: filterType
  adder: React.Dispatch<React.SetStateAction<filterOptionsArrayType>>
  activeOptions: filterOptionsArrayType
  isChecked: boolean
}
export const Switcher = React.memo((props: propType) => {
  const { id, value, adder, activeOptions, isChecked } = props
  const addorDeleteMyself = (
    array: filterOptionsArrayType,
    value: filterType,
    adder: React.Dispatch<React.SetStateAction<filterOptionsArrayType>>
  ) => {
    if (array.includes(value)) {
      adder((prev) => prev.filter((arrayValue) => arrayValue !== value))
    } else if (!array.length) {
      adder(() => [value])
    } else if (array.length >= 1 && !array.includes(value)) {
      adder((prev) => [...prev, value])
    }
  }

  return (
    <>
      <div style={{ marginTop: '1%', maxWidth: '6rem' }}>
        <span className={classes.switch}>
          <span className={classes.switchBorder1}>
            <span className={classes.switchBorder2}>
              <input
                checked={isChecked}
                onChange={() => addorDeleteMyself(activeOptions, value, adder)}
                value={value}
                id={`switch${id}`}
                type="checkbox"
              />
              <label htmlFor={`switch${id}`}></label>
              <span className={classes.switchTop}></span>
              <span className={classes.switchShadow}></span>
              <span className={classes.switchHandle}></span>
              <span className={classes.switchHandleLeft}></span>
              <span className={classes.switchHandleRight}></span>
              <span className={classes.switchHandleTop}></span>
              <span className={classes.switchHandleBottom}></span>
              <span className={classes.switchHandleBase}></span>
              <span
                className={`${classes.switchLed} ${classes.switchLedGreen}`}
              >
                <span className={classes.switchLedBorder}>
                  <span className={classes.switchLedLight}>
                    <span className={classes.switchLedGlow}></span>
                  </span>
                </span>
              </span>
              <span className={`${classes.switchLed} ${classes.switchLedRed}`}>
                <span className={classes.switchLedBorder}>
                  <span className={classes.switchLedLight}>
                    <span className={classes.switchLedGlow}></span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </div>
    </>
  )
})
