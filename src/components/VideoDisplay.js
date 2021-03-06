import React, { useEffect } from "react"
import { navigate } from "gatsby"
import useTwilioVideo from "../hooks/use-twillio-video"

const VideoDisplay = ({ roomID }) => {
  const { state, startVideo, videoRef } = useTwilioVideo()
  useEffect(() => {
    if (!state.token) {
      navigate("/", { state: { roomName: roomID } })
    }

    if (!state.room) {
      startVideo()
    }
  }, [state, roomID, startVideo])
  return (
    <>
      <h1>Room: "{roomID}"</h1>
      <div ref={videoRef} />
    </>
  )
}

export default VideoDisplay
