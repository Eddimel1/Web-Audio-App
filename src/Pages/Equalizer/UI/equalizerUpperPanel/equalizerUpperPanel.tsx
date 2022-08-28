import { globalModes } from 'Pages/Equalizer/drawFunctions/types'
import { equalizerT } from 'Pages/Equalizer/types/configTypes'
import React, { useState } from 'react'
import { NavBar } from '../../../../components/navBar/navBar'
import classes from './equalizerUpperPanel.module.css'
type propT = {
  fullscreenRef: React.RefObject<HTMLDivElement>
  setEqualizer: React.Dispatch<React.SetStateAction<equalizerT>>
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  setGlobalMode: React.Dispatch<React.SetStateAction<'normal' | 'shaking'>>
  activeEqualizer: equalizerT
}
const modes = ['normal', 'shaking']
const equalizers: { name: string; setter: equalizerT }[] = [
  { name: 'CircleEqualzier', setter: 'drawWithCircles' },
  { name: 'ImageEqualizer', setter: 'drawWithImage' },
  { name: 'TreeEqualizer', setter: 'drawWithTree' },
  { name: 'SvgEqualizer', setter: 'drawWithSvg' },
]
export const EqualizerUpperPanel = ({
  fullscreenRef,
  setEqualizer,
  canvasRef,
  activeEqualizer,
  setGlobalMode,
}: propT) => {
  const [toggleDropDown, setToggleDropDown] = useState<boolean>(false)
  const [isShownMode, setIsShownMode] = useState<boolean>(false)

  return (
    <>
      <div className={classes.togglerWrapper}>
        <div className={classes.togglerContainer}>
          <div className={classes.equalizerDropDown}>
            <div
              className={classes.activeEqualizer}
              onClick={() => setToggleDropDown((prev) => !prev)}
            >
              {activeEqualizer}
              <i
                style={{
                  transform: `rotate(${toggleDropDown ? '-90' : '-270'}deg)`,
                }}
                className={classes.arrow}
              >
                &#60;
              </i>
            </div>
            {toggleDropDown &&
              equalizers.map((eq, i) => {
                return (
                  <button
                    className={classes.dropDownItem}
                    key={Date.now() + i}
                    onClick={() => setEqualizer(eq.setter)}
                  >
                    {' '}
                    {eq.name}
                  </button>
                )
              })}
          </div>
          {activeEqualizer === 'drawWithSvg' ? (
            <button
              className={classes.fullScreenButton}
              onClick={() => fullscreenRef.current?.requestFullscreen()}
            >
              {' '}
              fullScreen
            </button>
          ) : (
            <button
              className={classes.fullScreenButton}
              onClick={() => canvasRef.current?.requestFullscreen()}
            >
              {' '}
              fullScreen
            </button>
          )}

          <div className={classes.modes}>
            <button
              className={classes.modeButton}
              onClick={() => setIsShownMode((prev) => !prev)}
            >
              modes
              <i
                style={{
                  transform: `rotate(${isShownMode ? '-90' : '-270'}deg)`,
                }}
                className={classes.arrow}
              >
                {'<'}
              </i>
            </button>
            {isShownMode && (
              <div className={classes.modeDropDown}>
                {modes.map((mode, i) => {
                  return (
                    <div
                      key={Date.now() + i}
                      className={classes.modeDropDownItem}
                      onClick={() => setGlobalMode(mode as globalModes)}
                    >
                      {mode}{' '}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <NavBar
            transitionFromTheEdge={false}
            navContainerStyles={{
              color: 'black',
              animation: 'none',
              height: '28px',
              left: '70%',
              top: '100%',
            }}
            togglerStyles={{ left: '100%', padding: '0.1rem 0.2rem' }}
          ></NavBar>
        </div>
      </div>
    </>
  )
}
