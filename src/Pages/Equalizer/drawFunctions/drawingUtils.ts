export const getNormalizedSamples = (arr: Uint8Array) => {
  //@ts-ignore

  const normalSamples = arr.map((e) => e / 128 - 1)
  return normalSamples
}
export const getVolume = (arr: Uint8Array) => {
  const normalSamples = arr
  let sum = 0
  for (let i = 0; i < normalSamples.length; i++) {
    sum += normalSamples[i] * normalSamples[i]
  }
  let volume = Math.sqrt(sum / normalSamples.length)
  return volume
}
export const throttle = (func: Function, timeFrame: number) => {
  var lastTime = 0
  return function () {
    var now = Date.now()
    if (now - lastTime >= timeFrame) {
      func()
      lastTime = now
    }
  }
}
export const normalize = (val: number, max: number, min: number) => {
  return (val - min) / (max - min)
}
