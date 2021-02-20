import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ListPage } from './pages/ListPage'
import { UserPage } from './pages/UserPage'

export const useRoutes = () => {
  return (
    <Switch>
      <Route path="/list" exact>
        <ListPage />
      </Route>
      <Route path="/user/:id">
        <UserPage />
      </Route>
      <Redirect to="/list" />
    </Switch>
  )
}
