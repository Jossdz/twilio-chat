import React, { createContext, useContext, useReducer, useRef } from "react"
import { connect } from "twilio-video"
import axios from "axios"

const TWILIO_TOKEN_URL =
  "https://glitter-frigatebird-2962.twil.io/create-room-token"

const DEFAULT_STATE = {
  identity: "",
  roomName: "",
  token: "",
  room: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "join":
      const { identity, roomName, token } = action
      return { ...state, token, identity, roomName }
    case "set-active-room":
      return { ...state, room: action.room }
    default:
      return DEFAULT_STATE
  }
}

const TwilioVideoContext = createContext()

const TwilioVideoProvider = ({ children }) => {
  return (
    <TwilioVideoContext.Provider value={useReducer(reducer, DEFAULT_STATE)}>
      {children}
    </TwilioVideoContext.Provider>
  )
}

export const wrapRootElement = ({ element }) => (
  <TwilioVideoProvider>{element}</TwilioVideoProvider>
)

const useTwilioVideo = () => {
  const [state, dispatch] = useContext(TwilioVideoContext)
  const videoRef = useRef()

  const getRoomToken = async ({ identity, roomName }) => {
    const result = await axios.post(TWILIO_TOKEN_URL, {
      identity,
      room: roomName,
    })

    dispatch({ type: "join", token: result.data, identity, roomName })
  }

  const handleRemoteParticipant = container => participant => {
    const id = participant.sid

    const el = document.createElement("div")
    el.id = id
    el.className = "remote-participant"

    const name = document.createElement("h4")
    name.innerText = participant.identity
    el.appendChild(name)

    container.appendChild(el)

    const addTrack = track => {
      const participantDiv = document.getElementById(id)
      const media = track.attach()

      participantDiv.appendChild(media)
    }

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        addTrack(publication.track)
      }
    })

    participant.on("trackSubscribed", addTrack)
  }

  const connectToRoom = async () => {
    if (!state.token) {
      return
    }

    const room = await connect(state.token, {
      name: room,
      audio: true,
      video: { width: 640 },
      logLevel: "info",
    }).catch(error => {
      console.error(`Unable to join the room: ${error.message}`)
    })

    const localTrack = [...room.localParticipant.videoTracks.value()][0].track

    if (!videoRef.current.hasChildNodes()) {
      const localEl = localTrack.attach()

      videoRef.current.appendChild(localEl)
    }

    const handleParticipant = participant => {
      handleRemoteParticipant(videoRef.current, participant)
    }

    room.participants.forEach(handleParticipant)
    room.on("participantConnected", handleParticipant)

    dispatch({ type: "set-active-room", room })
  }

  const startVideo = () => connectToRoom()

  return { state, getRoomToken, startVideo, videoRef }
}

export default useTwilioVideo
