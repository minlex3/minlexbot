import React, { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import { UserList } from '../components/UserList'

export const ListPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const fetchUsers = async () => {
    const url = '/api/message/list'
    const method = 'GET'
    const body = null
    const headers = {}

    let response = await fetch(url, { method, body, headers })

    if (response.status == 200) {
      if (users.length) {
        await delay(5000)
      }

      let data = await response.json()

      if (JSON.stringify(data) == JSON.stringify(users)) {
        await delay(10000)
        await fetchUsers()
      } else {
        setLoading(false)
        setUsers(data)
      }
    } else {
      await delay(5000)
      await fetchUsers()
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (loading) {
    return <Loader />
  }

  return <>{!loading && <UserList users={users} />}</>
}
