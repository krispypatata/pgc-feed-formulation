import { RiCloseLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Info from '../../icons/Info.jsx'

function EditNutrientModal({
  nutrients,
  user_id,
  isOpen,
  onClose,
  nutrient,
  onResult,
}) {
  const [formData, setFormData] = useState({
    abbreviation: '',
    name: '',
    unit: '',
    group: '',
    description: '',
  })

  const [isDisabled, setIsDisabled] = useState(false)
  const [abbrevError, setAbbrevError] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (nutrient) {
      setFormData(nutrient)
    }
  }, [nutrient])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDisabled(true)

    // client-side validation
    if (
      nutrients
        .filter((n) => n.name !== nutrient.name)
        .some(
          (nutrient) =>
            nutrient.abbreviation.toLowerCase() ===
            formData.abbreviation.toLowerCase()
        )
    ) {
      setAbbrevError('Abbreviation already exists')
      setNameError('')
      setIsDisabled(false)
      return
    } else if (
      nutrients
        .filter((n) => n.name !== nutrient.name)
        .some(
          (nutrient) =>
            nutrient.name.toLowerCase() === formData.name.toLowerCase()
        )
    ) {
      setNameError('Name already exists')
      setAbbrevError('')
      setIsDisabled(false)
      return
    } else {
      setNameError('')
    }
    try {
      const { _id, user, ...body } = formData
      const nutrient_id = nutrient.nutrient_id || nutrient._id
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/nutrient/${nutrient_id}/${user_id}`,
        body
      )
      const nutrientData = res.data.nutrients
      const messageData = res.data.message
      onResult(
        nutrientData,
        messageData,
        messageData === 'success'
          ? 'Successfully updated nutrient'
          : 'Failed to update nutrient'
      )
    } catch (err) {
      console.log(err)
    } finally {
      setIsDisabled(false)
      setAbbrevError('')
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
      id="edit_nutrient_modal"
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

        <h3 className="text-deepbrown mb-1 text-lg font-bold">Edit Nutrient</h3>
        <p className="mb-8 flex text-sm text-gray-500">
          <Info />
          Modify nutrient information as needed.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Abbreviation</span>
              </label>
              <input
                type="text"
                name="abbreviation"
                value={formData.abbreviation}
                required
                disabled={isDisabled}
                onChange={handleChange}
                placeholder="Enter abbreviation"
                className={`input input-bordered w-full rounded-xl ${abbrevError ? 'border-red-500' : ''}`}
              />
              {abbrevError && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {abbrevError}
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
                <span className="label-text">Unit</span>
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                required
                disabled={isDisabled}
                onChange={handleChange}
                placeholder="Enter unit"
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Group</span>
              </label>
              <select
                name="group"
                value={formData.group}
                disabled={isDisabled}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="Energy">Energy</option>
                <option value="Composition">Composition</option>
                <option value="Minerals">Minerals</option>
                <option value="Amino acids">Amino acids</option>
              </select>
            </div>

            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                disabled={isDisabled}
                name="description"
                value={nutrient?.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="textarea textarea-bordered w-full rounded-xl"
                rows="3"
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

export default EditNutrientModal
