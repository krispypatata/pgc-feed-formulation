import { RiCloseLine, RiSearchLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import { RiPencilLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri'
import { set } from 'lodash'
// import { Info } from '../../icons/Info.jsx'
function ChooseNutrientRatiosModal({ isOpen, onClose, nutrients, onResult, formulationRatioConstraintSamples, setFormulationRatioConstraintSamples, type }) {
  const [checkedNutrients, setCheckedNutrients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNutrients, setFilteredNutrients] = useState(nutrients)
  const [showChooseNutrientsModal, setShowChooseNutrientsModal] = useState(false)
  const [nutrientRatio, setNutrientRatio] = useState({
    firstIngredient: '',
    firstIngredientRatio: '',
    secondIngredient: '',
    secondIngredientRatio: ''
  })
  const [nutrientNo, setNutrientNo] = useState(null)
  const renderNutrientRatiosTableRows = () => {
      if (formulationRatioConstraintSamples) {
        return formulationRatioConstraintSamples.nutrientRatioConstraints.map((nutrient, index) => (
          <tr key={index} className="hover:bg-base-300">
            <td>{nutrient.firstIngredient}</td>
            <td>{nutrient.firstIngredientRatio}:{nutrient.secondIngredientRatio}</td>
            <td>{nutrient.secondIngredient}</td>
            <td>
                        <button
                          // disabled={isDisabled}
                          className={` btn btn-ghost btn-xs text-red-500 hover:bg-red-200`}
                          // onClick={() => handleRemoveNutrient(nutrient)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>

          </tr>
        ))
      }
    }
    const openChooseNutrientsModal = (type) => {
      setShowChooseNutrientsModal(true)
      setNutrientNo(type === 'first' ? 1 : 2)
    }

    
  return (
    <dialog
      id="choose_nutrients_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      
      <div className="modal-box relative md:mt-[64px] mt-[20px] w-11/12 max-w-3xl rounded-3xl bg-white md:mt-0 h-4/5">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>


        <h3 className="text-deepbrown  text-lg font-bold">
          Choose Nutrients Ratios
        </h3>
       
        <label className=" p-4 label text-sm font-medium text-black">{type} Nutrient Ratio</label>
        {/* Nutrients table */}
        <form onSubmit={(e) => {console.log('submit')}}>

          <div className='flex flex-row items-center w-full justify-center gap-4 mb-4'>
            <div className={`p-4 grid grid-cols-2 gap-4 md:grid-cols-10`}>

            <div className="md:col-span-3">
              <label className="label text-sm font-medium">Nutrient1</label>
              <input className='w-full rounded-xl input-bordered input hover:cursor-pointer flex items-center justify-center text-black'
                readOnly
                onClick={() => openChooseNutrientsModal('first')}
                value= {nutrientRatio.firstIngredient}
              />

              {/* <input
                id="input-ingredient1"
                type="text"
                className="input input-bordered w-full rounded-xl"
                placeholder="Enter description"
              /> */}
            </div>
            <div className="md:col-span-1 ">
              <label className="label text-sm font-medium justify-center w-full">%</label>
              <input
                id="input-ingredient1"
                type="text"
                value={nutrientRatio.firstIngredientRatio}
                onChange={(e) => setNutrientRatio({ ...nutrientRatio, firstIngredientRatio: e.target.value })}
                className="input input-bordered w-full rounded-xl"
              />
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center text-2xl font-bold">
              :
            </div>
            <div className="md:col-span-1 md:order-1 order-2">
              <label className="w-full text-center label text-sm font-medium justify-center ">%</label>
              <input
                id="input-ingredient1"
                type="text"
                value={nutrientRatio.secondIngredientRatio}
                onChange={(e) => setNutrientRatio({ ...nutrientRatio, secondIngredientRatio: e.target.value })}
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            <div className="md:col-span-3 md:order-2 order-1">
              <label className="label text-sm font-medium">Nutrient2</label>
              <input className='w-full rounded-xl input-bordered input hover:cursor-pointer flex items-center justify-center text-black'
                readOnly
                onClick={() => openChooseNutrientsModal('second')}
                value= {nutrientRatio.secondIngredient}
              />
              
            </div>

            <div className="md:col-span-1 col-span-2 flex flex-col items-center md:justify-center md:order-3 order-3">
              <label className="label text-sm font-medium justify-center w-full pb-2">Add</label>
              
              <div
                  // disabled={isDisabled}
                  onClick={

                    ()=>{setFormulationRatioConstraintSamples(prev => ({
                      ...prev,
                      nutrientRatioConstraints: [
                        ...(prev?.nutrientRatioConstraints || []),
                        nutrientRatio
                      ]
                    }))
                    setNutrientRatio({
    firstIngredient: '',
    firstIngredientRatio: '',
    secondIngredient: '',
    secondIngredientRatio: ''
  })
                  }
                    // Add the current nutrientRatio to nutrientRatioConstraints array
                    // updateIngredientRatiosList()
                  }                  
                  className="default bg-green-button flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <RiAddLine className='h-5 w-5'/>
              </div>
            </div>
            
          </div>

          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              

              <div className="p-4">
                <h3 className="text-sm font-semibold pb-4">Current Nutrient Ratio</h3>
                <div className="max-h-64 overflow-x-auto overflow-y-auto">
                <table className="table-sm table-pin-rows table w-full">
                  <thead>
                    <tr>
                      <th>Ingredient1</th>
                      <th>Ratio</th>
                      <th>Ingredient2</th>
                      
                      
                    </tr>
                  </thead>
                  <tbody>{renderNutrientRatiosTableRows()}</tbody>
                </table>
              </div>
                
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
              type="button"
              className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
              // disabled={checkedNutrients.length === 0}
              onClick = {onClose}
            >
              Finalize
            </button>
          </div>
        </form>

        <ShowNutrientsSection
                isOpen={showChooseNutrientsModal}
                onClose={() => setShowChooseNutrientsModal(false)}
                nutrients={nutrients}
                onResult={onResult}
                setNutrientRatio={setNutrientRatio}
                type={nutrientNo}
                nutrientRatio= {nutrientRatio}
              />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}


function ShowNutrientsSection({ isOpen, onClose, nutrients, onResult, setNutrientRatio, type, nutrientRatio }) {
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
    if (type==1){
      setNutrientRatio(prev => ({
        ...prev,
        firstIngredient: selectedNutrient ? selectedNutrient.name : ''
      }))
      console.log()
    } else if (type==2) {
      setNutrientRatio(prev => ({
        ...prev,
        secondIngredient: selectedNutrient ? selectedNutrient.name : ''
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
      <div className="modal-box relative mt-[64px] w-11/12 max-w-3xl rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-4 text-lg font-bold">
          Choose Nutrients Ratios
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
                  <th></th>
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
                              if (isSelected) setSelectedNutrient(null);
                              else setSelectedNutrient({ nutrient_id: id, name: nutrient.name });
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
              <span>
                {selectedNutrient.name} nutrient selected
              </span>
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
