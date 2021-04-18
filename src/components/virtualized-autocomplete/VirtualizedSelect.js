import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { VariableSizeList } from 'react-window'

const LISTBOX_PADDING = 8 // px

function renderRow(props) {
  const { data, index, style } = props
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  })
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache(data) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref,
) {
  const { children, ...other } = props
  const itemData = React.Children.toArray(children)
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = () => {
    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => getChildSize()}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})

ListboxComponent.propTypes = {
  // @ts-ignore
  children: PropTypes.node,
}

const useStyles = makeStyles({
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
})

// @ts-ignore
export const VirtualizedSelect = ({
  value,
  options,
  label,
  width,
  ...rest
}) => {
  const classes = useStyles()

  return (
    <Autocomplete
      disableListWrap
      classes={classes}
      style={{ width: width }}
      // @ts-ignore
      ListboxComponent={ListboxComponent}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={''}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
      value={value}
      {...rest}
    />
  )
}
