import { RiCloseLine, RiSearchLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'

// import { Info } from '../../icons/Info.jsx'
function ChooseNutrientRatiosModal({
  isOpen,
  onClose,
  nutrients,    // selected nutrients in the formulation
  allNutrients, // full nutrients info
  type,
  editingNutrientRatio,
  onUpdate,
  onResult,
}) {
  const [showChooseNutrientsModal, setShowChooseNutrientsModal] = useState(false)
  const [nutrientRatio, setNutrientRatio] = useState({
    firstIngredient: '',
    firstIngredientId: '',
    firstIngredientRatio: '',
    secondIngredient: '',
    secondIngredientId: '',
    secondIngredientRatio: '',
  })
  const [operator, setOperator] = useState('=')
  const [chooseType, setChooseType] = useState('first') // 'first' or 'second'

  // If editing, pre-fill fields when modal opens
  useEffect(() => {
    if (isOpen && type === 'Edit' && editingNutrientRatio) {
      setNutrientRatio({
        firstIngredient: editingNutrientRatio.firstIngredient,
        firstIngredientId: editingNutrientRatio.firstIngredientId,
        firstIngredientRatio: editingNutrientRatio.firstIngredientRatio,
        secondIngredient: editingNutrientRatio.secondIngredient,
        secondIngredientId: editingNutrientRatio.secondIngredientId,
        secondIngredientRatio: editingNutrientRatio.secondIngredientRatio,
      });
      setOperator(editingNutrientRatio.operator || '=');
    } else if (isOpen && type === 'Add') {
      setNutrientRatio({
        firstIngredient: '',
        firstIngredientId: '',
        firstIngredientRatio: '',
        secondIngredient: '',
        secondIngredientId: '',
        secondIngredientRatio: '',
      });
      setOperator('=');
    }
  }, [isOpen, type, editingNutrientRatio]);

  // Get selected nutrient IDs
  const firstNutrientId = nutrientRatio.firstIngredientId
  const secondNutrientId = nutrientRatio.secondIngredientId

  // Only enable Add if all fields are filled and valid
  const isAddEnabled =
    firstNutrientId &&
    secondNutrientId &&
    firstNutrientId !== secondNutrientId &&
    operator &&
    nutrientRatio.firstIngredientRatio &&
    nutrientRatio.secondIngredientRatio &&
    !isNaN(Number(nutrientRatio.firstIngredientRatio)) &&
    !isNaN(Number(nutrientRatio.secondIngredientRatio))

  // Open the nutrient selection modal for first or second nutrient
  const openChooseNutrientsModal = (type) => {
    setShowChooseNutrientsModal(true)
    setChooseType(type) // 'first' or 'second'
  }

  // Handle selection from the popup
  const handleNutrientSelect = (nutrient) => {
    if (chooseType === 'first') {
      setNutrientRatio((prev) => ({
        ...prev,
        firstIngredient: nutrient.name,
        firstIngredientId: nutrient.nutrient_id ?? nutrient._id,
      }))
    } else {
      setNutrientRatio((prev) => ({
        ...prev,
        secondIngredient: nutrient.name,
        secondIngredientId: nutrient.nutrient_id ?? nutrient._id,
      }))
    }
    setShowChooseNutrientsModal(false)
  }

  // Handle Add or Update button click
  const handleAddOrUpdate = () => {
    if (!isAddEnabled) return;
    const newConstraint = {
      firstIngredient: nutrientRatio.firstIngredient,
      firstIngredientId: nutrientRatio.firstIngredientId,
      firstIngredientRatio: Number(nutrientRatio.firstIngredientRatio),
      secondIngredient: nutrientRatio.secondIngredient,
      secondIngredientId: nutrientRatio.secondIngredientId,
      secondIngredientRatio: Number(nutrientRatio.secondIngredientRatio),
      operator,
    };
    if (type === 'Edit' && onUpdate) {
      onUpdate(newConstraint);
      onClose();
    } else if (onResult) {
      onResult(newConstraint);
      onClose();
    }
    // Reset fields
    setNutrientRatio({
      firstIngredient: '',
      firstIngredientId: '',
      firstIngredientRatio: '',
      secondIngredient: '',
      secondIngredientId: '',
      secondIngredientRatio: '',
    });
    setOperator('=');
  };

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
              e.preventDefault()
              handleAddOrUpdate()
            }}
          >
            <div className="grid grid-cols-[auto_75px_100px] gap-4 mt-2">
              {/* LEFT */}
              <div className="flex flex-col">
                <input
                  className="input-bordered input flex w-full items-center justify-center rounded-xl text-black hover:cursor-pointer"
                  readOnly
                  disabled={type === 'Edit'}
                  style={type === 'Edit' ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                  onClick={type === 'Edit' ? undefined : () => openChooseNutrientsModal('first')}
                  value={nutrientRatio.firstIngredient}
                  placeholder="Select 1st Nutrient"
                />
                <div className="flex w-full flex-col">
                  <div className="divider"></div>
                </div>
                <input
                  className="input-bordered input flex w-full items-center justify-center rounded-xl text-black hover:cursor-pointer"
                  readOnly
                  disabled={type === 'Edit'}
                  style={type === 'Edit' ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                  onClick={type === 'Edit' ? undefined : () => openChooseNutrientsModal('second')}
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
                  id="input-ingredient2"
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
                type="submit"
                className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
                disabled={!isAddEnabled}
              >
                {type === 'Edit' ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
      {/* Nutrient selection popup */}
      <ShowNutrientsSection
        isOpen={showChooseNutrientsModal}
        onClose={() => setShowChooseNutrientsModal(false)}
        nutrients={nutrients}
        allNutrients={allNutrients}
        onSelect={handleNutrientSelect}
        excludeId={chooseType === 'first' ? nutrientRatio.secondIngredientId : nutrientRatio.firstIngredientId}
      />
    </>
  )
}

// Nutrient selection popup
function ShowNutrientsSection({
  isOpen,
  onClose,
  nutrients,    // selected nutrients in the formulation
  allNutrients, // full nutrients info
  onSelect,
  excludeId,
}) {
  const [selectedNutrientId, setSelectedNutrientId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNutrients, setFilteredNutrients] = useState([])

  // Helper: join selected nutrients with full info
  function getFullNutrientInfo(nutrient) {
    const id = nutrient.nutrient_id ?? nutrient._id
    return (
      allNutrients?.find(
        (n) => (n.nutrient_id ?? n._id)?.toString() === id?.toString()
      ) || nutrient
    )
  }

  useEffect(() => {
    let filtered = nutrients
    if (excludeId) {
      filtered = filtered.filter(
        (nutrient) => (nutrient.nutrient_id ?? nutrient._id) !== excludeId
      )
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (nutrient) => {
          const full = getFullNutrientInfo(nutrient)
          return (
            full.name?.toLowerCase().includes(term) ||
            (full.abbreviation && full.abbreviation.toLowerCase().includes(term)) ||
            (full.group && full.group.toLowerCase().includes(term))
          )
        }
      )
    }
    setFilteredNutrients(filtered)
  }, [searchTerm, nutrients, excludeId, allNutrients])

  // When the modal opens, reset selection
  useEffect(() => {
    if (isOpen) setSelectedNutrientId(null)
  }, [isOpen])

  const handleRowClick = (nutrient) => {
    setSelectedNutrientId(nutrient.nutrient_id ?? nutrient._id)
    onSelect(nutrient)
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
        <p className="mb-4 text-sm text-gray-500">Choose a nutrient for the ratio constraint.</p>

        {/* Search input */}
        <div className="relative mb-4">
          <div className="relative">
            <RiSearchLine className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search nutrients..."
              className="input input-bordered w-full rounded-xl pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                filteredNutrients.map((nutrient) => {
                  const id = nutrient.nutrient_id ?? nutrient._id
                  const full = getFullNutrientInfo(nutrient)
                  return (
                    <tr
                      key={id}
                      className={`hover cursor-pointer ${selectedNutrientId === id ? 'bg-blue-100' : ''}`}
                      onClick={() => handleRowClick(nutrient)}
                    >
                      <td>{full.abbreviation || ''}</td>
                      <td>{full.name || ''}</td>
                      <td>{full.unit || ''}</td>
                      <td>{full.group || ''}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center">
                    No nutrients found. Try another search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ChooseNutrientRatiosModal
