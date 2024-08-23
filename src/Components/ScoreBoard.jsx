import React from 'react'
import "./Score.css"
const ScoreBoard = ({ point }) => {
  return (
    <div className="scoreboard">
    <span className="score">{point}</span>
  </div>
  )
}

export default ScoreBoard