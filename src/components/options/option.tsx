import { Oscillator } from 'components/Classes/Oscillator'
import React, { useEffect, useState } from 'react'
import classes from './option.module.css'
import { waveType } from '.././Classes/Oscillator'
import { optionsType } from './options'

type inputType = 'default' | 'box' | 'envelope' | 'filter'
interface propType extends React.HTMLAttributes<HTMLInputElement> {
  min: string
  max: string
  step: string
  defaultValue: string
  option?: string
  osc: React.MutableRefObject<Oscillator | undefined>
  type?: inputType
  valueName?: 'Q' | 'frequency'
  boxValues?: string[]
  setOptions?: React.Dispatch<React.SetStateAction<optionsType>>
  envelopeType?: envelopeTypeName
  envelopeRef?: React.MutableRefObject<optionsType>
  cb?: (
    osc: React.MutableRefObject<Oscillator | undefined>,
    valueType: 'Q' | 'frequency',
    value: string
  ) => void
}
type envelopeTypeName = 'attack' | 'decay' | 'sustain' | 'fade'
export const Option: React.FC<propType> = (props: propType) => {
  const {
    min,
    max,
    step,
    defaultValue,
    option,
    osc,
    type,
    boxValues,
    envelopeRef,
    envelopeType,
    valueName,
    cb,
  } = props
  const [boxValue, setValue] = useState<string>(defaultValue)
  const [inlineValue, setInlineValue] = useState<string>(defaultValue)
  const [wave, setCurrentWave] = useState<waveType>('sine')

  const waveChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (osc && osc.current && e.target.value) {
      const value = Number(e.target.value)
      setValue(e.target.value)
      if (value >= 0 && value < 25) {
        setCurrentWave('sine')
      } else if (value >= 26 && value < 50) {
        setCurrentWave('square')
      } else if (value >= 51 && value < 75) {
        setCurrentWave('triangle')
      } else if (value >= 76 && value < 100) {
        setCurrentWave('sawtooth')
      }
    }
  }
  const inlineChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInlineValue(e.target.value)
  }

  const envelopeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: envelopeTypeName | undefined
  ) => {
    if (envelopeRef && envelopeRef.current) {
      switch (type) {
        case 'attack':
          envelopeRef.current.attack = Number(e.target.value)
          break
        case 'decay':
          envelopeRef.current.decay = Number(e.target.value)
          break
        case 'sustain':
          envelopeRef.current.sustain = Number(e.target.value)
          break
        case 'fade':
          envelopeRef.current.fade = Number(e.target.value)
          break

        default:
          break
      }
    }
  }
  type === 'box' &&
    useEffect(() => {
      if (osc.current) {
        osc.current.osc.type = wave
      }
    }, [wave, setCurrentWave, boxValue])
  type === 'default' &&
    useEffect(() => {
      if (osc.current) {
        osc.current.osc.detune.setValueAtTime(Number(inlineValue), 0)
      }
    }, [inlineValue, setInlineValue])

  if (type === 'box') {
    return (
      <>
        <div className={classes.boxOptionContainer}>
          <div className={classes.boxOptionName}>{option}</div>
          <div style={{ width: '100%', margin: '0.2rem 1rem' }}>
            <input
              className={classes.boxInput}
              min={min}
              max={max}
              step={step}
              value={boxValue}
              type="range"
              onChange={waveChanger}
            ></input>
            <div className={classes.boxValuesContainer}>
              {boxValues &&
                boxValues.map((boxValue, i) => {
                  return (
                    <div key={Date.now() + i} className={classes.boxValue}>
                      {boxValue}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </>
    )
  } else if (type === 'envelope') {
    return (
      <>
        <div className={classes.defaultInputContainer}>
          <div className={classes.optionName}>{option}</div>
          <input
            className={classes.defaultInput}
            min={min}
            max={max}
            step={step}
            type="range"
            onChange={(e) => envelopeHandler(e, envelopeType)}
          ></input>
        </div>
      </>
    )
  } else if (type === 'default') {
    return (
      <>
        <div className={classes.defaultInputContainer}>
          <div className={classes.optionName}>{option}</div>
          <input
            className={classes.defaultInput}
            min={min}
            max={max}
            step={step}
            value={inlineValue}
            type="range"
            onChange={inlineChanger}
          ></input>
        </div>
      </>
    )
  }
  return (
    <>
      <div className={classes.defaultInputContainer}>
        <div className={classes.optionName}>{option}</div>
        <div className={classes.filterParamName}>{valueName}</div>
        <input
          className={classes.defaultInput}
          min={min}
          max={max}
          step={step}
          type="range"
          onChange={(e) =>
            cb && valueName && cb(osc, valueName, e.target.value)
          }
        ></input>
      </div>
    </>
  )
}
