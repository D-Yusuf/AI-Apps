import React from 'react'

function PDF({file}: {file: File}) {
  return (
    <div>{file.name}</div>
  )
}

export default PDF