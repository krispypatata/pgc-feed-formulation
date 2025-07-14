import { RiCloseLine, RiSearchLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import { RiPencilLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri'
import { set } from 'lodash'

// import { Info } from '../../icons/Info.jsx'
function ChooseNutrientRatiosModal({
  isOpen,
  onClose,
  nutrients,
  onResult,
  formulationRatioConstraintSamples,
  setFormulationRatioConstraintSamples,
  type,
}) {
  const [checkedNutrients, setCheckedNutrients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNutrients, setFilteredNutrients] = useState(nutrients)
  const [showChooseNutrientsModal, setShowChooseNutrientsModal] =
    useState(false)
  const [nutrientRatio, setNutrientRatio] = useState({
    firstIngredient: '',
    firstIngredientRatio: '',
    secondIngredient: '',
    secondIngredientRatio: '',
  })
  const [nutrientNo, setNutrientNo] = useState(null)
  const [operator, setOperator] = useState('=')

  const renderNutrientRatiosTableRows = () => {
    if (formulationRatioConstraintSamples) {
      return formulationRatioConstraintSamples.nutrientRatioConstraints.map(
        (nutrient, index) => (
          <tr key={index} className="hover:bg-base-300">
            <td>{nutrient.firstIngredient}</td>
            <td>
              {nutrient.firstIngredientRatio}:{nutrient.secondIngredientRatio}
            </td>
            <td>{nutrient.secondIngredient}</td>
            <td>
              <button
                // disabled={isDisabled}
                className={`btn btn-ghost btn-xs text-red-500 hover:bg-red-200`}
                // onClick={() => handleRemoveNutrient(nutrient)}
              >
                <RiDeleteBinLine />
              </button>
            </td>
          </tr>
        )
      )
    }
  }
  const openChooseNutrientsModal = (type) => {
    setShowChooseNutrientsModal(true)
    setNutrientNo(type === 'first' ? 1 : 2)
  }

  return (
    <>
      <dialog
        id="choose_nutrients_modal"
        className={`modal ${isOpen ? 'modal-open' : ''}`}
      >
        <div className="modal-box relative mt-[20px] rounded-3xl bg-white md:mt-0 md:mt-[64px]">
          {/* Close button */}
          <button
            className="btn btn-sm btn-circle absolute top-4 right-4"
            onClick={onClose}
          >
            <RiCloseLine className="h-5 w-5" />
          </button>

          <h3 className="text-deepbrown flex justify-center text-lg font-bold">
            {type} Nutrient Ratio
          </h3>

          {/* Nutrients table */}
          <form
            onSubmit={(e) => {
              console.log('submit')
            }}
          >
            <div className="grid grid-cols-[auto_75px_100px] gap-4 mt-2">
              {/* LEFT */}
              <div className="flex flex-col">
                <input
                  className="input-bordered input flex w-full items-center justify-center rounded-xl text-black hover:cursor-pointer"
                  readOnly
                  onClick={() => openChooseNutrientsModal('first')}
                  value={nutrientRatio.firstIngredient}
                  placeholder="Select 1st Nutrient"
                />
                <div className="flex w-full flex-col">
                  <div className="divider"></div>
                </div>
                <input
                  className="input-bordered input flex w-full items-center justify-center rounded-xl text-black hover:cursor-pointer"
                  readOnly
                  onClick={() => openChooseNutrientsModal('second')}
                  value={nutrientRatio.secondIngredient}
                  placeholder="Select 2nd Nutrient"
                />
              </div>

              {/* MIDDLE */}
              <div className="flex items-center justify-center">
                <select
                  className="select select-bordered w-full"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  <option>{"<="}</option>
                  <option>{"="}</option>
                  <option>{">="}</option>
                </select>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col">
                <input
                  id="input-ingredient1"
                  type="text"
                  value={nutrientRatio.firstIngredientRatio}
                  onChange={(e) =>
                    setNutrientRatio({
                      ...nutrientRatio,
                      firstIngredientRatio: e.target.value,
                    })
                  }
                  className="input input-bordered w-full rounded-xl text-center"
                />
                <div className="flex w-full flex-col">
                  <div className="divider"></div>
                </div>
                <input
                  id="input-ingredient1"
                  type="text"
                  value={nutrientRatio.secondIngredientRatio}
                  onChange={(e) =>
                    setNutrientRatio({
                      ...nutrientRatio,
                      secondIngredientRatio: e.target.value,
                    })
                  }
                  className="input input-bordered w-full rounded-xl text-center"
                />
              </div>
            </div>
            {/* END */}

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
                type="button"
                className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
                // disabled={checkedNutrients.length === 0}
                onClick={onClose}
              >
                {type}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
      <ShowNutrientsSection
        isOpen={showChooseNutrientsModal}
        onClose={() => setShowChooseNutrientsModal(false)}
        nutrients={nutrients}
        onResult={onResult}
        setNutrientRatio={setNutrientRatio}
        type={nutrientNo}
        nutrientRatio={nutrientRatio}
      />
    </>
  )
}

function ShowNutrientsSection({
  isOpen,
  onClose,
  nutrients,
  onResult,
  setNutrientRatio,
  type,
  nutrientRatio,
}) {
  const [selectedNutrient, setSelectedNutrient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNutrients, setFilteredNutrients] = useState(nutrients)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNutrients(nutrients)
    } else {
      const term = searchTerm.toLowerCase().trim()
      const filtered = nutrients.filter(
        (nutrient) =>
          nutrient.name.toLowerCase().includes(term) ||
          (nutrient.abbreviation &&
            nutrient.abbreviation.toLowerCase().includes(term)) ||
          (nutrient.group && nutrient.group.toLowerCase().includes(term))
      )
      setFilteredNutrients(filtered)
    }
  }, [searchTerm, nutrients])

  const updateIngredientRatio = () => {
    if (type == 1) {
      setNutrientRatio((prev) => ({
        ...prev,
        firstIngredient: selectedNutrient ? selectedNutrient.name : '',
      }))
      console.log()
    } else if (type == 2) {
      setNutrientRatio((prev) => ({
        ...prev,
        secondIngredient: selectedNutrient ? selectedNutrient.name : '',
      }))
    }
    console.log(nutrientRatio)
    onClose()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedNutrient) {
      updateIngredientRatio()
      setSelectedNutrient(null)
    }
  }

  const handleRowClick = (nutrient) => {
    const id = nutrient.nutrient_id ?? nutrient._id

    setSelectedNutrient({ nutrient_id: id, name: nutrient.name })
  }

  const handleRadioChange = (nutrient, e) => {
    e.stopPropagation()
    const id = nutrient.nutrient_id ?? nutrient._id
    if (selectedNutrient && selectedNutrient.nutrient_id === id) {
      setSelectedNutrient(null)
    } else {
      setSelectedNutrient({ nutrient_id: id, name: nutrient.name })
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <dialog
      id="choose_nutrients_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-4 text-lg font-bold">
          Select Nutrient
        </h3>
        <p className="mb-4 text-sm text-gray-500">Description</p>

        {/* Search input */}
        <div className="relative mb-4">
          <div className="relative">
            <RiSearchLine className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search nutrients..."
              className="input input-bordered w-full rounded-xl pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Nutrients table */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-64 overflow-y-auto rounded-2xl border border-gray-200">
            <table className="table-pin-rows table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-semibold">Abbreviation</th>
                  <th className="font-semibold">Name</th>
                  <th className="font-semibold">Unit</th>
                  <th className="font-semibold">Group</th>
                </tr>
              </thead>
              <tbody>
                {filteredNutrients.length > 0 ? (
                  filteredNutrients.map((nutrient, index) => {
                    const id = nutrient.nutrient_id ?? nutrient._id
                    const isSelected =
                      selectedNutrient && selectedNutrient.nutrient_id === id
                    return (
                      <tr
                        key={index}
                        className={`hover cursor-pointer ${
                          isSelected ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleRowClick(nutrient)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <input
                            type="radio"
                            name="nutrient-radio"
                            checked={!!isSelected}
                            onClick={() => {
                              if (isSelected) setSelectedNutrient(null)
                              else
                                setSelectedNutrient({
                                  nutrient_id: id,
                                  name: nutrient.name,
                                })
                            }}
                          />
                        </td>
                        <td>{nutrient.abbreviation}</td>
                        <td>{nutrient.name}</td>
                        <td>{nutrient.unit}</td>
                        <td>{nutrient.group}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      No nutrients found. Try another search term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Selected count */}
          <div className="mt-4 text-sm text-gray-600">
            {selectedNutrient && (
              <span>{selectedNutrient.name} nutrient selected</span>
            )}
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
              className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
              disabled={!selectedNutrient}
            >
              Add
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

export default ChooseNutrientRatiosModal
