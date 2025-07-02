import { RiCloseLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Info from '../../icons/Info.jsx'

function EditFormulationModal({
  formulations,
  isOpen,
  onClose,
  formulation,
  onResult,
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    animal_group: '',
    description: '',
  })

  const [isDisabled, setIsDisabled] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (formulation) {
      setFormData(formulation)
    }
  }, [formulation])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDisabled(true)

    // client-side validation
    if (
      formulations
        .filter((f) => f.name !== formulation.name)
        .some(
          (formulation) =>
            formulation.code.toLowerCase() === formData.code.toLowerCase()
        )
    ) {
      setCodeError('Code already exists ')
      setNameError('')
      setIsDisabled(false)
      return
    } else if (
      formulations
        .filter((f) => f.name !== formulation.name)
        .some(
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
    try {
      const { _id, ...body } = formData
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/formulation/${_id}`,
        body
      )
      const formulationData = res.data.formulations
      const messageData = res.data.message
      onResult(
        formulationData,
        messageData,
        messageData === 'success'
          ? 'Successfully updated formulation.'
          : 'Failed to update formulation.'
      )
    } catch (err) {
      console.log(err)
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

  return (
    <dialog
      id="edit_formulation_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-2xl rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-1 text-lg font-bold">
          Edit Formulation
        </h3>
        <p className="mb-8 flex text-sm text-gray-500">
          <Info />
          Modify basic details of your feed formulation.
        </p>

        {/* Form fields */}
        <form onSubmit={handleSubmit}>
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn rounded-xl bg-amber-500 ${isDisabled ? 'disabled bg-red-100' : 'hover:bg-amber-600'} px-8 text-white`}
            >
              {`${isDisabled ? 'Updating...' : 'Update'}`}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default EditFormulationModal
