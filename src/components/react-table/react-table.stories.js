import React from 'react'
import { action } from '@storybook/addon-actions'
import { App } from './react-table'
import { Paper } from '@material-ui/core'
export default {
  title: 'Example/table',
  component: App,
  argTypes: {
    onChange: action('Input Value on Blur'),
  },
}

const Template = (args) => (
  <Paper style={{ padding: '16px' }}>
    <App {...args} />
  </Paper>
)

export const Primary = Template.bind({})

function random(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const rows = Array.from(new Array(200)).map(() => {
  const name = random(10 + Math.ceil(Math.random() * 20))
  const val = random(10 + Math.ceil(Math.random() * 20))
  return {
    id: val,
    name,
    value: {
      name,
      val,
    },
  }
})

Primary.args = {
  primary: true,
  options: rows,
  urlToChange: "test/params"
}
