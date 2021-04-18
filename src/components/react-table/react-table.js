// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useTable, useGlobalFilter, usePagination } from 'react-table'
import {
  AppBar,
  TableContainer,
  TableFooter,
  TablePagination,
} from '@material-ui/core'
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions'
import { GlobalFilter } from './global-filter'
import { EditableCell } from './editable-cell'
import { fakeCallData, fakeCallOptions } from './table-utils'
import LinearProgress from '@material-ui/core/LinearProgress';
import { matchSorter } from 'match-sorter'


function Table({ columns, data, updateMyData, skipPageReset, options }) {

  const globalFilter = useCallback(
    (rows, ids, query) => {
        return matchSorter(rows, query, {keys: ['values.field', 'values.value.name']});
    }
  )

  const {
    getTableProps,
    headerGroups,
    state,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      autoResetPage: !skipPageReset,
      updateMyData,
      options,
      globalFilter:globalFilter
    },
    useGlobalFilter, // useGlobalFilter!
    usePagination,
  )

  // @ts-ignore
  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value))
  }


  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        // @ts-ignore
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {/* <TableContainer style={{ maxHeight: 500 }}> */}
      <TableContainer>
        <MaUTable {...getTableProps()} stickyHeader>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row) => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()} style={{padding: "8px"}}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: 'All', value: data.length },
                ]}
                colSpan={3}
                count={data.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </MaUTable>
      </TableContainer>
    </>
  )
}

export const App = ({urlToChange}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Field',
        accessor: 'field',
      },
      {
        Header: 'Value',
        accessor: 'value',
        Cell: (options) => EditableCell(options, urlToChange)
      },
    ],
    [],
  )

  const [data, setData] = useState([])
  const [options, setOptions] = useState([])
  const [skipPageReset, setSkipPageReset] = React.useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function mockAPI() {
      const rows = await fakeCallData();
      const options = await fakeCallOptions();
      setData(rows)
      setOptions(options)
      setLoading(false)
    }
    mockAPI();
  }, [])

  // reset flag, so index resets on filter
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true)
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      }),
    )
  }

  return (
    <div>
      {loading? <LinearProgress />: (
        <>
          <CssBaseline />
          <Table
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
            options={options}
          />
        </>
      )}
    </div>
  )
}

