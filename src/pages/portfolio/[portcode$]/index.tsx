import React from 'react'
import { Redirect } from 'umi'

export default class Home extends React.Component {
  render() {
    return (
      <>
        <Redirect to='/portfolio/overview'/>
      </>
    )
  }
}
