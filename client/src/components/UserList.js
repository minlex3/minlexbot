import React from 'react'
import { Link } from 'react-router-dom'

export const UserList = ({ users }) => {
  if (!users.length) {
    return <p className="center">No users yet</p>
  }

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <ul className="collection">
        {users.map((user) => {
          return (
            <li className="collection-item avatar" key={user._id}>
              <Link to={`/user/${user._id}`}>
                {user.newMessages == 0 ? (
                  <i className="material-icons circle blue lighten-1">
                    assignment_ind
                  </i>
                ) : (
                  <i className="material-icons circle teal lighten-1">
                    message
                  </i>
                )}
                <span className="title">
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                </span>
                <p>
                  <em>{user.username}</em> <br />
                  {user.lastMessage.length > 150 ? (
                    <span className="gray-text">
                      Last message: {user.lastMessage.slice(0, 150)} ...
                    </span>
                  ) : (
                    <span className="gray-text">
                      Last message: {user.lastMessage}
                    </span>
                  )}
                </p>
                <div className="secondary-content">
                  {user.newMessages == 0 ? (
                    <span className="badge" style={{ fontSize: 12 }}>
                      No new messages
                    </span>
                  ) : (
                    <span className="new badge">
                      <b>{user.newMessages}</b> new messages
                    </span>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
