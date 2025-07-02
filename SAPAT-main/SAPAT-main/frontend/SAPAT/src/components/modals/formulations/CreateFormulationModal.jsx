import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'
import axios from 'axios'
import Info from '../../icons/Info.jsx'

function CreateFormulationModal({
  formulations,
  ownerId,
  ownerName,
  isOpen,
  onClose,
  onResult,
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    animal_group: '',
  })
  const [isDisabled, setIsDisabled] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [nameError, setNameError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDisabled(true)

    // client-side validation
    if (
      formulations.some(
        (formulation) =>
          formulation.code.toLowerCase() === formData.code.toLowerCase()
      )
    ) {
      setCodeError('Code already exists ')
      setNameError('')
      setIsDisabled(false)
      return
    } else if (
      formulations.some(
        (formulation) =>
          formulation.name.toLowerCase() === formData.name.toLowerCase()
      )
    ) {
      setNameError('Name already exists')
      setCodeError('')
      setIsDisabled(false)
      return
    } else {
      setNameError('')
    }
    const body = { ...formData, ownerId, ownerName }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/formulation`,
        body
      )
      console.log('res:', res)
      const newFormulation = res.data.formulations
      newFormulation.access = 'owner'
      onResult(newFormulation, 'success', 'Successfully created formulation.')
      // Reset form
      setFormData({
        code: '',
        name: '',
        description: '',
        animal_group: '',
      })
    } catch (err) {
      console.log(err)
      onResult(null, 'error', 'Failed to create formulation.')
    } finally {
      setIsDisabled(false)
      setCodeError('')
      setNameError('')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClose = () => {
    onClose()
    setFormData({
      code: '',
      name: '',
      description: '',
      animal_group: '',
    })
  }

  return (
    <dialog
      id="create_formulation_modal"
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
          Create Formulation
        </h3>
        <p className="mb-8 flex text-sm text-gray-500">
          <Info />
          Set up initial details for your new formulation.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                required
                disabled={isDisabled}
                onChange={handleChange}
                placeholder="Enter code"
                className={`input input-bordered w-full rounded-xl ${codeError ? 'border-red-500' : ''}`}
              />
              {codeError && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {codeError}
                </p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                disabled={isDisabled}
                onChange={handleChange}
                placeholder="Enter name"
                className={`input input-bordered w-full rounded-xl ${nameError ? 'border-red-500' : ''}`}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Animal Group</span>
              </label>
              <select
                name="animal_group"
                value={formData.animal_group}
                disabled={isDisabled}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="" disabled>
                  Select group
                </option>
                <option value="Swine">Swine</option>
                <option value="Poultry">Poultry</option>
                <option value="Water Buffalo">Water Buffalo</option>
              </select>
            </div>

            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                disabled={isDisabled}
                onChange={handleChange}
                placeholder="Enter description"
                className="textarea textarea-bordered w-full rounded-xl"
                rows="3"
                maxLength="60"
              ></textarea>
            </div>
          </div>

          {/* Modal actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn rounded-xl px-8"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn bg-green-button ${isDisabled ? 'disabled bg-red-100' : 'hover:bg-green-600'} rounded-xl px-8 text-white`}
            >
              {`${isDisabled ? 'Creating...' : 'Create'}`}
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

export default CreateFormulationModal
