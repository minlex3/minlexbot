import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { UserCard } from '../components/UserCard'

export const UserPage = () => {
  const [responses, setResponses] = useState([])
  const [messages, setMessages] = useState([])
  const { loading, request } = useHttp()
  const userId = useParams().id

  const getMessages = useCallback(async () => {
    try {
      const fetched = await request(`/api/message/user/${userId}`, 'GET', null)
      setMessages(fetched)
    } catch (e) {}
  }, [request])

  const getResponses = useCallback(async () => {
    try {
      const fetched = await request(
        `/api/message/message/${userId}`,
        'GET',
        null
      )
      setResponses(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    getMessages()
    getResponses()
  }, [getMessages, getResponses])

  if (loading) {
    return <Loader />
  }

  return (
    <>{!loading && <UserCard messages={messages} responses={responses} />}</>
  )
}
