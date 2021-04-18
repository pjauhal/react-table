import { CircularProgress, TextField } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { VirtualizedSelect } from '../virtualized-autocomplete/VirtualizedSelect'
import { fakeParamsChange } from './table-utils'


// Create an editable cell renderer
export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  options
}, urlToChange) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  const onChange = async (e, val) => {
    setLoading(true);
    setValue(val)
    const value = await fakeParamsChange(urlToChange, val);
    setLoading(false);
    console.log(urlToChange)
    updateMyData(index, id, val)
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <VirtualizedSelect
      value={value}
      onChange={onChange}
      options={options}
      label={'value'}
      width={600}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option) => {
        return option?.id === value?.id
      }}
      key={`${index}${id}`}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}
