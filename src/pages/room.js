import React, { useEffect } from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import VideoDisplay from "../components/VideoDisplay"

const BounceToHome = () => {
  useEffect(() => {
    navigate("/", { replace: true })
  })
  return null
}

const room = () => {
  return (
    <>
      <Layout>
        <Router>
          <VideoDisplay path="/room/:roomID" />
          <BounceToHome default />
        </Router>
      </Layout>
    </>
  )
}

export default room
