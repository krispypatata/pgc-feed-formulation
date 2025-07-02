import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'
import Info from '../../icons/Info.jsx'

function ReportGenerationModal({ isOpen, onClose, onGenerate }) {
  const [formData, setFormData] = useState({
    showEmptyValues: false,
    additionalCosts: [],
    ingredientSorting: 'alphabetical',
    remarks: '',
    roundingPrecision: 2,
  })
  const [newCostName, setNewCostName] = useState('')
  const [newCostValue, setNewCostValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      await onGenerate(formData)
      setError('')
      onClose() // Close the modal after successful generation
    } catch (err) {
      console.log(err)
      setError('Failed to generate PDF report.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddCost = () => {
    if (!newCostName.trim() || isNaN(parseFloat(newCostValue))) {
      setError('Please enter a valid name and cost value')
      return
    }

    setFormData((prev) => ({
      ...prev,
      additionalCosts: [
        ...prev.additionalCosts,
        {
          name: newCostName.trim(),
          value: parseFloat(newCostValue),
        },
      ],
    }))
    setNewCostName('')
    setNewCostValue('')
    setError('')
  }

  const handleRemoveCost = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalCosts: prev.additionalCosts.filter((_, i) => i !== index),
    }))
  }

  const handleClose = () => {
    // Reset form when closing without generating
    setFormData({
      showEmptyValues: false,
      additionalCosts: [],
      ingredientSorting: 'alphabetical',
      remarks: '',
      roundingPrecision: 2,
    })
    setNewCostName('')
    setNewCostValue('')
    setError('')
    onClose()
  }

  return (
    <dialog
      id="report_generation_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-2xl rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={handleClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-1 text-lg font-bold">
          Generate PDF Report
        </h3>
        <p className="mb-8 flex text-sm text-gray-500">
          <Info />
          Customize how your formulation data appears in the generated PDF report.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Display Settings */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Display Settings</h4>
            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3">
                <input
                  type="checkbox"
                  name="showEmptyValues"
                  checked={formData.showEmptyValues}
                  onChange={handleChange}
                  className="checkbox"
                  disabled={isGenerating}
                />
                <span className="label-text">Show nutrients and ingredients with no value</span>
              </label>
            </div>
          </div>

          {/* Sorting and Rounding */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Ingredient Sorting</span>
              </label>
              <select
                name="ingredientSorting"
                value={formData.ingredientSorting}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
                disabled={isGenerating}
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="valueHighToLow">Value (High to Low)</option>
                <option value="valueLowToHigh">Value (Low to High)</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Rounding Precision</span>
              </label>
              <select
                name="roundingPrecision"
                value={formData.roundingPrecision}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
                disabled={isGenerating}
              >
                <option value="0">Whole numbers</option>
                <option value="1">1 decimal place</option>
                <option value="2">2 decimal places</option>
                <option value="3">3 decimal places</option>
                <option value="4">4 decimal places</option>
              </select>
            </div>
          </div>

          {/* Additional Costs */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Additional Costs</h4>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="form-control flex-1">
                <input
                  type="text"
                  value={newCostName}
                  onChange={(e) => setNewCostName(e.target.value)}
                  placeholder="Cost name (e.g. Transportation)"
                  className="input input-bordered w-full rounded-xl"
                  disabled={isGenerating}
                />
              </div>
              <div className="form-control md:w-1/3">
                <input
                  type="number"
                  value={newCostValue}
                  onChange={(e) => setNewCostValue(e.target.value)}
                  placeholder="Value"
                  step="0.01"
                  className="input input-bordered w-full rounded-xl"
                  disabled={isGenerating}
                />
              </div>
              <button
                type="button"
                onClick={handleAddCost}
                className="btn bg-green-button hover:bg-green-600 text-white rounded-xl"
                disabled={isGenerating}
              >
                Add
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-2" role="alert">
                {error}
              </p>
            )}

            {/* List of added costs */}
            <div className="bg-gray-50 rounded-xl p-4">
              {formData.additionalCosts.length === 0 ? (
                <p className="text-gray-500 text-sm">No additional costs added</p>
              ) : (
                <ul className="space-y-2">
                  {formData.additionalCosts.map((cost, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{cost.name}</span>
                        <span className="text-gray-600 ml-2">
                          PHP {cost.value.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCost(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isGenerating}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Remarks</span>
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Add any additional notes or remarks to display on the PDF report"
              className="textarea textarea-bordered w-full rounded-xl"
              rows="4"
              disabled={isGenerating}
            ></textarea>
          </div>

          {/* Modal actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn rounded-xl px-8"
              onClick={handleClose}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn bg-green-button ${isGenerating ? 'disabled bg-gray-300' : 'hover:bg-green-600'} rounded-xl px-8 text-white`}
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  )
}

export default ReportGenerationModal