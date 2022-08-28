import React, { useEffect, useRef, useState } from 'react'
import classes from './options.module.css'
import { optionsArray } from '../../Data/options'
import { Oscillator } from '../Classes/Oscillator'
import { KeyGroup } from 'components/Classes/KeyGroup'
import { Option } from './option'
import { FilterOptions } from './filterOptions'
import { Equalizer } from '../Equalizer/Equalizer'

export type optionsType = {
  attack: number
  decay: number
  sustain: number
  fade: number
}
export type filterValueTypes = {
  q: number
  freq: number
  gain: number
  detune: number
}
export type filterNames =
  | 'lowpass'
  | 'highpass'
  | 'bandpass'
  | 'lowshelf'
  | 'highshelf'
  | 'peaking'
  | 'notch'
  | 'allpass'
export type filtersType = {
  lowpass: filterValueTypes
  highpass: filterValueTypes
  bandpass: filterValueTypes
  lowshelf: filterValueTypes
  notch: filterValueTypes
  allpass: filterValueTypes
  peaking: filterValueTypes
}

export const Options = (props: {
  ctx: React.MutableRefObject<AudioContext | undefined>
  keyGroup: React.MutableRefObject<KeyGroup | undefined>
  osc: React.MutableRefObject<Oscillator | undefined>
}) => {
  const { ctx, keyGroup, osc } = props
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const oscRef = useRef<Oscillator | undefined>()
  const envelopeRef = useRef<optionsType>({
    attack: 0.3,
    decay: 0.3,
    sustain: 0.3,
    fade: 0.3,
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  const keyDownHandler = (
    e: KeyboardEvent,
    osc: React.MutableRefObject<Oscillator | undefined>
  ) => {
    const freq = keyGroup.current && keyGroup.current.getFreqbyIndex(e.key)
    const enve = envelopeRef.current
    console.log(enve)
    if (osc.current && freq && ctx.current) {
      osc.current.osc.frequency.setValueAtTime(freq, ctx.current.currentTime)
      osc.current.changeFilterValues(100, 5)
      osc.current.playSound(enve.attack, enve.decay, enve.sustain, enve.fade)
      const mesh = keyGroup.current && keyGroup.current.getMeshbyInputKey(e.key)
      mesh && keyGroup.current && keyGroup.current.rotate(mesh, 0.2)
    }
  }
  const keyUpHandler = () => {
    oscRef.current?.stopSound()
  }

  useEffect(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      keyDownHandler(e, osc)
    })
    document.addEventListener('keyup', (e: KeyboardEvent) => keyUpHandler)
    return () => {
      document.removeEventListener('keyup', keyUpHandler)
      document.removeEventListener('keydown', () => keyDownHandler)
    }
  }, [])

  return (
    <>
      <h1
        className={classes.optionsToggler}
        onClick={() => setShowOptions((prev) => !prev)}
      >
        Toggle Options
      </h1>

      <div
        className={`${classes.innerOptionsWrapper} ${
          showOptions ? classes.slideIn : classes.slideOut
        }`}
      >
        <div className={classes.optionsContainer}>
          <div className={classes.mainOptionsWrapper}>
            {optionsArray.map((option, i) => {
              if (option.type === 'box') {
                return (
                  <Option
                    key={Date.now() + i}
                    placeholder={option.name}
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    defaultValue={option.defaultValue}
                    option={option.name}
                    type="box"
                    osc={osc}
                    boxValues={option.boxValues}
                  ></Option>
                )
              } else if (option.type === 'envelope') {
                return (
                  <Option
                    key={Date.now() + i}
                    placeholder={option.name}
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    defaultValue={option.defaultValue}
                    option={option.name}
                    type="envelope"
                    envelopeRef={envelopeRef}
                    envelopeType={option.envelopeType}
                    osc={osc}
                  ></Option>
                )
              }

              return (
                <Option
                  key={Date.now() + i}
                  placeholder={option.name}
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  defaultValue={option.defaultValue}
                  option={option.name}
                  type="default"
                  osc={osc}
                ></Option>
              )
            })}
          </div>

          <div className={classes.filtersWrapper}>
            <FilterOptions ctx={ctx} osc={osc}></FilterOptions>
            <Equalizer osc={osc} audioCtx={ctx}></Equalizer>
          </div>
        </div>
      </div>
    </>
  )
}
