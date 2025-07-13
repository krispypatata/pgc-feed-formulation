import { RiCloseLine } from 'react-icons/ri'
import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { readUsedSize } from 'chart.js/helpers'

function ImportModal({ isOpen, onClose, onSubmit }) {
  const fileInputRef = useRef(null)
  const [fileDataInJSON, setFileDataInJSON] = useState([])
  const [fileValidationError, setFileValidationError] = useState('')

  const transformExcelData = (jsonData) => {
    // Assuming first row is headers and subsequent rows are data
    const headers = jsonData[0]

    // Transform data starting from the second row (index 1)
    return jsonData.slice(1).map((row) => {
      // Create an array of nutrient objects, skipping the first 2 columns (Name, Price)
      const nutrients = headers
        .slice(2)
        .map((nutrientName, index) => {
          const value = Number(row[index + 2])

          // Check if nutrient value is a valid number
          if (isNaN(value)) {
            return null
          }

          return {
            nutrient: nutrientName.trim(), // Remove any extra whitespace
            value: value,
          }
        })
        .filter((nutrient) => nutrient !== null) // Remove null nutrients

      // If any nutrient is invalid, return null
      if (nutrients.length !== headers.length - 2) {
        return null
      }

      return {
        name: row[0],
        price: row[1],
        nutrients: nutrients,
      }
    })
  }

  const handleChange = (e) => {
    // clear error messages
    setFileValidationError('')
    setFileDataInJSON([])

    const file = e.target.files[0] // Correct way to get the file
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Read the file
        const workbook = XLSX.read(e.target.result, { type: 'binary' })

        // Get the first sheet name
        const sheetName = workbook.SheetNames[0]

        // Convert the sheet to JSON
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Use this if you want to preserve the header row
          defval: '', // Default value for empty cells
          blankrows: false, // Skip blank rows
        })

        // validation
        if (jsonData.length === 0) {
          setFileValidationError('Empty file uploaded.')
          return
        } else if (
          jsonData[0][0].toLowerCase().trim() !== 'name' ||
          jsonData[0][1].toLowerCase().trim() !== 'price'
        ) {
          setFileValidationError("First column must be 'Name' and 'Price'")
          return
        } else if (jsonData[0].length < 3) {
          setFileValidationError(
            "File must contain 'Name', 'Price', and at least one nutrient column."
          )
          return
        }

        const formattedData = transformExcelData(jsonData)

        // validation
        if (formattedData[0] === null) {
          setFileValidationError('Nutrient values must be a numeric value.')
          setFileDataInJSON([])
          return
        } else if (
          formattedData.some((data) => data.name === '') ||
          formattedData.some((data) => data.price === '')
        ) {
          setFileValidationError('Missing name or price.')
          return
        }

        setFileValidationError('')
        setFileDataInJSON(formattedData)
      }
      // Actually read the file as a binary string
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <dialog id="import_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box relative mt-[64px] w-11/12 max-w-md rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = null
            }
            setFileValidationError('')
            onClose()
          }}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        {/* Main Content */}
        <h3 className="text-deepbrown mb-2 text-lg font-bold">Import</h3>
        <p className="text-sm text-gray-500">
          Drop your excel file here or click to browse.
        </p>
        <p className="mb-4 text-sm text-gray-500">
          <a
            href="https://docs.google.com/spreadsheets/d/1HlvtEnW_UaPQPQ9lNgTyobvrrr6o1Q9g/edit?usp=sharing&ouid=103933737847328450424&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {' '}
            View template{' '}
          </a>
          for required format.
        </p>

        <div className="flex py-4">
          <fieldset className="fieldset">
            <input
              type="file"
              accept=".xlsx"
              className={`file-input ${fileValidationError ? 'file-input-error' : 'file-input-warning'}`}
              ref={fileInputRef}
              onChange={handleChange}
            />
            {fileValidationError && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {fileValidationError}
              </p>
            )}
          </fieldset>
        </div>

        {/* Modal actions */}
        <div className="modal-action">
          <button
            className="btn rounded-xl px-8"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = null
              }
              setFileValidationError('')
              setFileDataInJSON([])
              onClose()
            }}
          >
            Cancel
          </button>
          <div
            className={`${fileDataInJSON.length === 0 || fileValidationError !== '' ? 'tooltip' : ''}`}
            data-tip="Attach a valid file first."
          >
            <button
              disabled={
                fileDataInJSON.length === 0 || fileValidationError !== ''
              }
              className="btn btn-warning rounded-xl px-8 text-white hover:bg-amber-600"
              onClick={() => {
                if (fileDataInJSON.length > 0 || fileValidationError !== '') {
                  onSubmit(fileDataInJSON)
                  onClose()
                }
              }}
            >
              Import
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ImportModal
