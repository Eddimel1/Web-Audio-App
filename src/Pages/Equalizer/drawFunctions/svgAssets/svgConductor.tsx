import React, { useEffect, useRef, useState, useTransition } from 'react'

import { Dragon } from './dragon'
type propT = {
  setSvgRefs: React.Dispatch<React.SetStateAction<SVGPathElement[]>>
  setRefsArePlaced: React.Dispatch<React.SetStateAction<boolean>>
  dataArray: React.MutableRefObject<Uint8Array | undefined>
}
type refObjectT = {
  ref0: React.RefObject<SVGPathElement>
  ref1: React.RefObject<SVGPathElement>
  ref2: React.RefObject<SVGPathElement>
  ref3: React.RefObject<SVGPathElement>
  ref4: React.RefObject<SVGPathElement>
  ref5: React.RefObject<SVGPathElement>
}
export const SvgConductor = (props: propT) => {
  const [refsArePlaced, setRefsArePlaced] = useState<boolean>(false)
  const [refAreCreated, setRefsAreCreated] = useState<boolean>(false)
  const [refs, setRefs] = useState<SVGPathElement[]>([] as SVGPathElement[])
  const refObject = useRef<refObjectT>({} as refObjectT)
  const timeOuts = useRef<{ timeout1: null | number; timeout2: null | number }>(
    { timeout1: null, timeout2: null }
  )
  const [isPending, startTransition] = useTransition()

  const createRefsForComp = (count: number) => {
    let refObj = {} as refObjectT
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        refObj = { ...refObj, [`ref${i}`]: React.createRef<SVGSVGElement>() }
      }
      refObj = { ...refObj, [`ref${i}`]: React.createRef<SVGPathElement>() }
    }
    refObject.current = refObj
  }
  function checkAndReturn<
    T extends {},
    P1 extends keyof T,
    P2 extends keyof T[P1]
  >(obj: T, prop2: P2, prop1?: P1): Promise<T[P1][P2][]> {
    const objKeys = Object.keys(obj) as P1[]
    const objVals = Object.values(obj) as T[P1][]
    let arrCopy: T[P1][P2][] = []

    const returnArrOfExistingProps = () => {
      return new Promise<T[P1][P2][]>((res, rej) => {
        const timeout1 = window.setTimeout(() => {
          let arr: T[P1][P2][] = []
          for (let i = 0; i < objVals.length; i++) {
            if (objVals && objVals[i][prop2]) {
              const val = objVals[i][prop2]
              if (val) arr = [...arr, val]
            }
          }
          res(arr)
        }, 0)
        timeOuts.current.timeout1 = timeout1
      })
    }

    returnArrOfExistingProps().then((res) => (arrCopy = res))

    return new Promise<T[P1][P2][]>((res, rej) => {
      const timeout2 = window.setTimeout(() => {
        res(arrCopy)
      }, 0)
      timeOuts.current.timeout2 = timeout2
    })
  }
  useEffect(() => {
    createRefsForComp(6)
    setRefsAreCreated(true)
    refObject.current &&
      checkAndReturn(refObject.current, 'current').then((refs) => {
        setRefs(refs as SVGPathElement[])
        props.setSvgRefs(refs as SVGPathElement[])
      })
    return () => {
      timeOuts.current.timeout1 && clearTimeout(timeOuts.current.timeout1)
      timeOuts.current.timeout2 && clearTimeout(timeOuts.current.timeout2)
    }
  }, [])

  useEffect(() => {
    props.setRefsArePlaced((prev) => !prev)
  }, [setRefsArePlaced, refsArePlaced, refs])
  return (
    <>
      {refObject && refAreCreated && (
        <Dragon setRefsArePlaced={setRefsArePlaced} ref={refObject}></Dragon>
      )}
    </>
  )
}
