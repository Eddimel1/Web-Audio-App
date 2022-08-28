import React, { useEffect, useRef, useState } from 'react'
import { Option } from './option'
import { filterInputArray } from '../../Data/options'
import classes from './filterOptions.module.css'
import { filterType, Oscillator } from 'components/Classes/Oscillator'
import { Switcher, filterOptionsArrayType } from './../UIComps/switcher'

export const FilterOptions = (props: {
  osc: React.MutableRefObject<Oscillator | undefined>
  ctx: React.MutableRefObject<AudioContext | undefined>
}) => {
  const [arrayOfActiveOptions, addToArrayOfActiveOptions] =
    useState<filterOptionsArrayType>(['allpass'])
  console.log(arrayOfActiveOptions)

  const checkIfChecked = (value: filterType) => {
    if (arrayOfActiveOptions.includes(value)) {
      return true
    }
    return false
  }
  useEffect(() => {
    if (props.osc && props.osc.current) {
      console.log(arrayOfActiveOptions)
      props.osc.current.createAndConnectFilters(arrayOfActiveOptions)
    }
  }, [addToArrayOfActiveOptions, arrayOfActiveOptions])

  return (
    <div className={classes.filterOptionsContainer}>
      {filterInputArray.map((filter, i) => {
        const cb = (
          osc: React.MutableRefObject<Oscillator | undefined>,
          valueType: 'Q' | 'frequency',
          value: string
        ) => {
          if (osc.current) {
            const valNumber = Number(value)

            const index = osc.current.findFilterIndexByName(filter.filterType)
            const activeFilter = osc.current.activeFilters[index]

            if (activeFilter && props.ctx.current) {
              console.log(osc.current.activeFilters)
              activeFilter[valueType].value = valNumber
              console.log(activeFilter[valueType])
              console.log(valNumber)
            }
          }
        }
        return (
          <div key={Date.now() + i} className={classes.filterContainer}>
            <div className={classes.optionsGrid}>
              <div className={classes.nameAndSwitcherContainer}>
                <div className={classes.filterName}>{filter.filterType}</div>
                <Switcher
                  isChecked={checkIfChecked(filter.filterType)}
                  id={i.toString()}
                  value={filter.filterType}
                  adder={addToArrayOfActiveOptions}
                  activeOptions={arrayOfActiveOptions}
                ></Switcher>
              </div>
              <div className={classes.optionInputContainer}>
                <Option
                  type="filter"
                  cb={cb}
                  min={filter.Q.min}
                  max={filter.Q.max}
                  step={filter.Q.step}
                  osc={props.osc}
                  valueName="Q"
                  defaultValue={filter.Q.defaultValue}
                >
                  {' '}
                </Option>
                <Option
                  type="filter"
                  cb={cb}
                  min={filter.frequency.min}
                  max={filter.frequency.max}
                  step={filter.frequency.step}
                  osc={props.osc}
                  valueName="frequency"
                  defaultValue={filter.frequency.defaultValue}
                >
                  {' '}
                </Option>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
