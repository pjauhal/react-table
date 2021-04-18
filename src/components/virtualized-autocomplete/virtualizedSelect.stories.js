import React from 'react'
import { action } from '@storybook/addon-actions'
import { VirtualizedSelect } from './VirtualizedSelect'

export default {
  title: 'Example/VirtualizedSelect',
  component: VirtualizedSelect,
  argTypes: {
    onChange: action('Input Value on Blur'),
  },
}

function random(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const OPTIONS = Array.from(new Array(10000)).map(() => {
  return {
    name: random(10 + Math.ceil(Math.random() * 20)),
    value: random(10 + Math.ceil(Math.random() * 20)),
  }
})

const Template = (args) => <VirtualizedSelect {...args} />

export const Primary = Template.bind({})

Primary.args = {
  primary: true,
  label: 'Test Field',
  value: { name: 'tesVal', value: 'testVal' },
  onChange: action('range input rendered'),
  field: 'testField',
  options: OPTIONS,
  getOptionLabel: (option) => option.name,
}
