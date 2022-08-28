import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  globalConfigKeyT,
  globalSettings,
  uninonSettingsType,
} from '../../types/configTypes'
import classes from './slider.module.css'

import { drawWithCirclesConf } from 'Pages/Equalizer/drawFunctions/drawCircles'
import { accessAnyConfigProp, accessProp } from '../../types/utilsForTypes'

type propType = {
  config: React.MutableRefObject<uninonSettingsType>
  option: globalConfigKeyT
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  multiplier?: number
}

export const Slider = <T extends {}, K extends keyof T>(props: propType) => {
  const widthPercentage = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const [isDraggble, setDraggble] = useState<boolean>(false)
  const resultRef = useRef<number>(0)
  const setWidthAndConfigValue = (
    e: Event | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (parentRef.current && props.multiplier) {
      const event = e as unknown as React.MouseEvent<HTMLDivElement>
      const all = parentRef.current.getBoundingClientRect()
      const xCord = all.left - all.left

      let result2 =
        (xCord + Math.abs(all.left - 0.5 - event.clientX) / all.width) * 100
      if (event.clientX < all.x) result2 = 0
      if (result2 <= 0.1) result2 = 0
      if (result2 < 100 && result2 >= 95) result2 = 100
      resultRef.current = result2
      props.setValue((resultRef.current * props.multiplier).toString())
      accessAnyConfigProp(
        props.config.current,
        props.option,
        resultRef.current * props.multiplier
      )

      if (widthPercentage.current) {
        widthPercentage.current.style.width = `${resultRef.current}%`
      }
    }
  }

  useEffect(() => {
    if (widthPercentage.current?.style && props.multiplier)
      widthPercentage.current.style.width = `${
        Number(props.value) / props.multiplier
      }%`
  }, [props.value])
  const onMouseMoveCb = useCallback((e: Event) => {
    if (widthPercentage.current)
      widthPercentage.current.style.backgroundColor = '#ff8000'

    setWidthAndConfigValue(e)
  }, [])

  function accessPropInGlobalConfig(resultingNumber: unknown) {
    if (props.config.current.kind === 'global') {
      const option = props.option as keyof globalSettings // union of keys
      accessProp(props.config.current, option, resultingNumber)
    }
  }
  function accessPropInDrawWithCircles(resultingNumber: unknown) {
    if ((props.config.current.kind = 'drawWithCircles')) {
      const option = props.option as keyof drawWithCirclesConf
      accessProp(
        props.config.current as drawWithCirclesConf,
        option,
        resultingNumber
      )
    }
  }
  const onMouseDownCb = () => {
    if (parentRef.current) {
      parentRef.current.style.border = '1px solid orange'
      parentRef.current.style.boxShadow = '0px 2px 10px 5px #FFF345'
      parentRef.current.addEventListener('pointermove', onMouseMoveCb, false)
    }
  }
  const onMouseUpCb = () => {
    if (parentRef.current) {
      parentRef.current.style.border = '1px solid black'
      parentRef.current.style.boxShadow = 'none'
      if (widthPercentage.current)
        widthPercentage.current.style.backgroundColor = `rgb(243, 180, 8)`
      parentRef.current.removeEventListener('pointermove', onMouseMoveCb, false)
    }
  }

  const onClickcb = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setWidthAndConfigValue(e)
  }
  return (
    <>
      <div
        ref={parentRef}
        onPointerLeave={onMouseUpCb}
        onPointerDown={onMouseDownCb}
        onPointerUp={onMouseUpCb}
        className={classes.parentWrapper}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => onClickcb(e)}
      >
        <div className={classes.parentContainer}>
          <div ref={widthPercentage} className={classes.childContainer}></div>
        </div>
      </div>
    </>
  )
}
