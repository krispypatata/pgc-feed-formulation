import { useState } from 'react'
import { RiPencilLine, RiDeleteBinLine, RiTableLine } from 'react-icons/ri'
import { FaEye } from 'react-icons/fa'
import Toast from '../components/Toast'

function Table({
  headers,
  data,
  page,
  onEdit,
  onDelete,
  onRowClick,
  actions = true,
}) {
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

  // Function to filter data to be shown
  const getRowData = (row) => {
    if (!row) return []
    if (page === 'formulations') {
      // Get the keys of the row excluding _id
      const orderedFields = [
        'code',
        'name',
        'description',
        'animal_group',
        'access',
      ]
      const rowData = orderedFields.map((field) => row[field] || 'N/A')
      return rowData
    } else if (page === 'ingredients') {
      const orderedFields = ['name', 'price', 'available', 'group', 'description']
      const rowData = orderedFields.map((field) => row[field] || 'N/A')
      rowData[2] = Number(rowData[2]) === 1 ? 'Yes' : 'No' // for 'available' field
      return rowData
    } else if (page === 'nutrients') {
      const orderedFields = [
        'abbreviation',
        'name',
        'unit',
        'description',
        'group',
      ]
      const rowData = orderedFields.map((field) => row[field] || 'N/A')
      return rowData
    }
    // for tables that shows all fields
    return Object.values(row)
  }

  return (
    <div className="max-h-9/10 overflow-auto rounded-lg bg-white shadow-sm">
      <table className="table-pin-rows table w-full">
        <thead className="bg-white shadow-sm">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="text-deepbrown bg-white">
                {header}
              </th>
            ))}
            {actions && (
              <th className="text-deepbrown bg-white text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-base-200">
                {getRowData(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {/* only the name column (index 1) is clickable to go to ViewFormulation */}
                    {onRowClick && cellIndex === 1 ? (
                      <div className="tooltip" data-tip="View">
                        <span
                          onClick={() => onRowClick && onRowClick(row)}
                          className="group text-deepbrown hover:bg-green-button inline-flex cursor-pointer items-center gap-2 rounded px-2 py-1 font-medium hover:text-white/80 hover:underline"
                        >
                          {cell}
                          <FaEye className="h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        </span>
                      </div>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="flex justify-end gap-2">
                    <div
                      className={`${row?.access && row.access !== 'owner' && 'tooltip tooltip-left'}`}
                      data-tip={`${row?.access && row.access !== 'owner' && 'Only the owner can edit this formulation.'}`}
                    >
                      <button
                        disabled={row?.access && row?.access !== 'owner'}
                        className={`btn btn-ghost btn-sm ${
                          row?.access && row.access !== 'owner'
                            ? 'cursor-not-allowed text-gray-500'
                            : 'text-deepbrown hover:bg-deepbrown/10'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('row.access: ', row.access)
                          // non-owners should not be able to edit the basic data
                          if (row?.access && row.access !== 'owner') {
                            // toast instructions
                            setShowToast(true)
                            setMessage(
                              'Only the owner can edit the basic data.'
                            )
                            setToastAction('error')
                          } else {
                            onEdit(row)
                          }
                        }}
                      >
                        <RiPencilLine className="h-4 w-4" />
                      </button>
                    </div>
                    <div
                      className={`${row?.access && row.access !== 'owner' && 'tooltip tooltip-left'}`}
                      data-tip={`${row?.access && row.access !== 'owner' && 'Only the owner can delete this formulation.'}`}
                    >
                      <button
                        disabled={row?.access && row?.access !== 'owner'}
                        className={`btn btn-ghost btn-sm ${
                          row?.access && row.access !== 'owner'
                            ? 'cursor-not-allowed text-gray-500'
                            : 'hover:bg-deepbrown/10 text-red-600'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          // non-owners should not be able to edit the basic data
                          if (row?.access && row.access !== 'owner') {
                            // toast instructions
                            setShowToast(true)
                            setMessage(
                              'Only the owner can delete this formulation.'
                            )
                            setToastAction('error')
                          } else {
                            onDelete(row)
                          }
                        }}
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  actions ? getRowData({}).length + 1 : getRowData({}).length
                }
                className="py-8 text-center text-gray-500"
              >
                <RiTableLine className="mx-auto mb-2 h-12 w-12 opacity-60" />
                <p>
                  No results found. Adjust filters or add new data.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/*  Toasts */}
      <Toast
        className="transition delay-150 ease-in-out"
        show={showToast}
        action={toastAction}
        message={message}
        onHide={hideToast}
      />
    </div>
  )
}

export default Table
