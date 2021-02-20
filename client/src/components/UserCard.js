import React, { useState, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Link } from 'react-router-dom'

export const UserCard = ({ messages, responses }) => {
  const [answer, setAnswer] = useState('')
  const [id, setId] = useState('')
  const { request } = useHttp()
  let isR = ''
  let isS = ''

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  if (!messages.length) {
    return <p className="center">No messages yet</p>
  }

  const dateToString = (date) => {
    let time = date.slice(11, 16)
    let day = date.slice(8, 10)
    let month = date.slice(5, 7)
    let year = date.slice(0, 4)
    return `${time}, ${day}-${month}-${year}`
  }

  const pressHandler = async (event) => {
    if (event.key === 'Enter') {
      try {
        const data = await request(
          '/api/message/user/send',
          'POST',
          {
            messageId: id,
            text: answer,
          },
          {}
        )
      } catch (e) {}
    }
  }

  const responseItems = (index) => {
    if (typeof responses[index] == 'object' && responses[index].length != 0) {
      let ids = []
      let rs = []
      let ds = []
      let isSent = []

      for (let i = 0; i < responses[index].length; i++) {
        let id = responses[index][i]._id
        let text = responses[index][i].text
        let d = dateToString(responses[index][i].createdAt)
        let send = responses[index][i].isSent
        ids.push(id)
        rs.push(text)
        ds.push(d)
        isSent.push(send)
      }

      const responseList = rs.map((r) => {
        if (isSent[rs.indexOf(r)]) {
          isS = (
            <i className="material-icons" style={{ color: '#26a69a' }}>
              done
            </i>
          )
        } else {
          isS = (
            <i className="material-icons" style={{ color: '#ef5350' }}>
              close
            </i>
          )
        }
        return (
          <li key={ids[rs.indexOf(r)]}>
            <div className="row">
              <em className="col s6">{r}</em>
              <div className="col s3 offset-s3">
                <em>{ds[rs.indexOf(r)]} </em>
                {isS}
              </div>
            </div>
          </li>
        )
      })

      return responseList
    }
  }

  const messageItems = messages.map((m) => {
    if (m.isRead) {
      isR = (
        <i className="material-icons" style={{ color: '#26a69a' }}>
          check_circle
        </i>
      )
    } else {
      isR = (
        <i className="material-icons" style={{ color: '#ef5350' }}>
          cancel
        </i>
      )
    }
    return (
      <ul key={m.messageId}>
        <li>
          <form>
            <div className="row">
              <div className="col s8">
                <div>
                  <strong style={{ fontSize: 18 }}>
                    {isR}&emsp;
                    {m.text}
                  </strong>
                  <span style={{ fontSize: 14 }}>
                    &emsp;(id# {m.messageId})
                  </span>
                </div>
              </div>
              <div className="col s3 offset-s1">
                <h6>{dateToString(m.createdAt)}</h6>
              </div>
            </div>
            <ul>{responseItems(messages.indexOf(m))}</ul>
            <div className="input-field col s6">
              <input
                className="validate"
                style={{
                  borderBottom: '1px solid #64b5f6',
                  boxShadow: '0 1px 0 0 #2196f3',
                }}
                placeholder="Enter response ..."
                name={m.messageId}
                type="text"
                onChange={(e) => (
                  setAnswer(e.target.value), setId(e.target.name)
                )}
                onKeyPress={pressHandler}
              />
            </div>
          </form>
        </li>
      </ul>
    )
  })

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      {messageItems}
    </div>
  )
}
