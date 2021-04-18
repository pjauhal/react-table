import React, { useState, useEffect } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { useAsyncDebounce } from 'react-table'
import { InputBase, makeStyles, fade } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
  },
}))

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const classes = useStyles()
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        //value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        fullWidth
      />
    </div>
    // </span>
  )
}
