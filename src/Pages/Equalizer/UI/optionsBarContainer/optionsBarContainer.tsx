import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import classes from './optionsBarContainer.module.css'

type optionsBarContainerProps = {
  styles?: CSSProperties
  children: React.ReactNode
  pereodicAnimation?: boolean
}
export const OptionsBarContainer = ({
  children,
  styles,
  pereodicAnimation,
}: optionsBarContainerProps) => {
  const [animEnded, setAnimEnded] = useState<boolean>(false)
  const [showTransition, setShowTransition] = useState<boolean>(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const randomColor = useRef<string>()
  const intervalId = useRef<NodeJS.Timer>()
  let colorChanged = false
  function randomNumberInveral(min: number, max: number) {
    return Math.random() * (max - min) + min
  }
  useEffect(() => {
    setShowTransition(false)
  }, [animEnded, setAnimEnded])
  if (pereodicAnimation) {
    useEffect(() => {
      intervalId.current = setInterval(() => {
        if (wrapperRef.current) {
          wrapperRef.current.style.opacity = `${randomNumberInveral(0.7, 1)}`
          if (!colorChanged) {
            wrapperRef.current.style.border = '3px solid grey'
            colorChanged = true
          } else {
            wrapperRef.current.style.border = '3px solid black'
            colorChanged = false
          }
        }
      }, 5000)
      if (intervalId.current)
        return () => clearInterval(Number(intervalId.current))
    }, [])
  }
  return (
    <>
      <div
        ref={wrapperRef}
        className={classes.sideBarWrapper}
        style={{ ...styles }}
      >
        <div
          onAnimationEnd={() => {
            setAnimEnded(true)
          }}
          className={classes.transitionWrapper}
        >
          <div
            style={{ animationDelay: '0s' }}
            className={showTransition ? `${classes.transition}` : ''}
          ></div>
          <div className={showTransition ? `${classes.transition}` : ''}></div>
          <div className={showTransition ? `${classes.transition}` : ''}></div>
        </div>

        <div className={`${classes.sideBarContainer}`}>{children}</div>
      </div>
    </>
  )
}
