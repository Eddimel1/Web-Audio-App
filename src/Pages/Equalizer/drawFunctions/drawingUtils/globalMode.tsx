import { globalModes } from '../types'

export const executeMode = (
  mode: globalModes,
  i: number,
  bit: number,
  volume: number,
  time: number
) => {
  if (bit && i % 2 === 0 && mode === 'shaking') {
    document.body.style.transform = `translateX(${bit * 2}px)`
    document.body.style.transform = `scale(${0.88 + volume / 1300},${
      0.88 + volume / 1300
    })`
    document.body.style.backgroundColor = `hsl(${
      time / 1000 + bit
    } ${bit}% ${bit}%)`
  }
  if (bit && i % 2 !== 0 && mode === 'shaking') {
    document.body.style.transform = `translateX(${-bit * 2}px)`
    document.body.style.transform = `scale(${0.88 + volume / 1300},${
      0.88 + volume / 1300
    })`
  }
}
