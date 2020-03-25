/** @jsx jsx */
import { Fragment, useState, useEffect, useRef } from 'react'
import { css, jsx, Global } from '@emotion/core'
import emotionReset from 'emotion-reset'

const App = () => {

  //
  // ─── CSS ────────────────────────────────────────────────────────────────────────
  //

  const tb = '768px'
  const globalStyles = css`
    ${emotionReset}
    body {
      font-family: "Helvetica Neue",
        Arial, 
        "Hiragino Kaku Gothic ProN", 
        "Hiragino Sans", 
        "BIZ UDPGothic", 
        Meiryo, 
        sans-serif;
      text-align: center;
      color: white;
      font-size: 16px;
    }
    button:focus-visible {
      outline: 5px solid black;
    }
  `
  const wrapperCSS = css`
    width: 100%;
    height: 100vh;
    transition: 1s;
  `
  const innerCSS = css`
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  `
  const countCSS = css`
    margin-bottom: 50px;
    font-size: 2.5em;
    width: 1.5em;
    height: 1.5em;
    border: 3px solid white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const timerCSS = css`
    font-size: 7em;
    @media (min-width: ${tb}) {
      font-size: 14em;
    }
    font-weight: bold;
    letter-spacing: 0.08em;
    margin-left: 0.06em;
  `
  const buttonWrapperCSS = css`
    margin-top: 5em;
  `
  const buttonCSS = css`
    background-color: transparent;
    font-size: 1.7em;
    color: white;
    border: 3px solid white;
    letter-spacing: 0.2em;
    width: 10em;
    height: 2em;
    cursor: pointer;
    transition: 0.3s;
    margin: 0 1.6em 1em;
  `

//
// ─── INIT ───────────────────────────────────────────────────────────────────────
//

  const [paused, setPaused] = useState(true)
  const [option, setOption] = useState({
    workMin: 25,
    breakMin: 5,
  })
  const [sec, setSec] = useState(option.workMin * 60)
  const [status, setStatus] = useState('work')
  const [count, setCount] = useState(1)

  const resetRef = useRef()

  //
  // ─── TIMER ──────────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {
        setSec(sec => sec - 1)
        resetRef.current.disabled = true
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [paused])

  if (sec === 0) {
    if (status === 'work') {
      setStatus('break')
      setSec(option.breakMin * 60)
    } else {
      setStatus('work')
      setSec(option.workMin * 60)
      setCount(count + 1)
    }
  }
  
  const intMin = Math.floor(sec / 60)
  const paddingMin = intMin.toString().padStart(2, '0')
  const intSec = Math.floor(sec)
  const paddingSec = (intSec % 60).toString().padStart(2, '0')

  //
  // ─── BUTTON ─────────────────────────────────────────────────────────────────────
  //

  const handlePaused = () => {
    setPaused(!paused)
    resetRef.current.disabled = !resetRef.current.disabled
  }

  const handleReset = () => {
    if (status === 'break') setStatus('work')
    setSec(option.workMin * 60)
    setCount(1)
  }
  
  return (
    <Fragment>
      <Global styles={globalStyles} />
      <div css={css`${wrapperCSS} background-color: ${status === 'work' ? '#658DC6' : '#F3D5AD'}`}>
        <div css={innerCSS}>
          <div css={countCSS}>{count}</div>
          <div css={timerCSS}>{paddingMin}:{paddingSec}</div>
          <div css={buttonWrapperCSS}>
            <button css={buttonCSS} onClick={handlePaused}>{paused ? 'START' : 'PAUSE'}</button>
            <button css={css`${buttonCSS} opacity: ${paused ? '1' : '0.5'}`} ref={resetRef} onClick={handleReset}>RESET</button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default App
