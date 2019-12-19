import React, { useState } from "react"
import useTwilioVideo from "../hooks/use-twillio-video"

function Join() {
  const [identity, setIdentity] = useState("")
  const [roomName, setRoomName] = useState("")
  const { state, getRoomToken } = useTwilioVideo()

  const submit = e => {
    e.preventDefault()
    getRoomToken({ identity, roomName })
  }

  return (
    <>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <h1>Start or join a video call</h1>
      <form onSubmit={submit}>
        <label htmlFor="identity">
          Display name:
          <input
            type="text"
            name="identity"
            id="identity"
            value={identity}
            onChange={e => setIdentity(e.target.value)}
          />
        </label>
        <label htmlFor="roomName">
          Display name:
          <input
            type="text"
            name="roomName"
            id="roomName"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
          />
        </label>
        <button type="submit">Join video call</button>
      </form>
    </>
  )
}

export default Join
