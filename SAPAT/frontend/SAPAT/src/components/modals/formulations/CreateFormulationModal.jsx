import { RiCloseLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Info from '../../icons/Info.jsx'
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import { HiSelector, HiCheck } from 'react-icons/hi'

function CreateFormulationModal({
  formulations,
  ownerId,
  ownerName,
  isOpen,
  onClose,
  onResult,
  userType 
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
  const [templateQuery, setTemplateQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState({ id: 0, name: 'None' })
  const [fetchedTemplates, setFetchedTemplates] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [fetchError, setFetchError] = useState('')

  // Dummy template options by animal group
  /*
  const animalGroupTemplates = {
    'Swine': [
      { id: 0, name: 'None' },
      { id: 1, name: 'Swine Sample Template 1' },
      { id: 2, name: 'Swine Sample Template 2' },
      { id: 3, name: 'Swine Sample Template 3' },
      { id: 4, name: 'Swine Sample Template 4' },
      { id: 5, name: 'Swine Sample Template 5' },
      { id: 6, name: 'Swine Sample Template 6' },
    ],
    'Poultry': [
      { id: 0, name: 'None' },
      { id: 7, name: 'Poultry Sample Template 1' },
      { id: 8, name: 'Poultry Sample Template 2' },
      { id: 9, name: 'Poultry Sample Template 3' },
      { id: 10, name: 'Poultry Sample Template 4' },
      { id: 11, name: 'Poultry Sample Template 5' },
      { id: 12, name: 'Poultry Sample Template 6' },
    ],
    'Water Buffalo': [
      { id: 0, name: 'None' },
      { id: 13, name: 'Water Buffalo Sample Template 1' },
      { id: 14, name: 'Water Buffalo Sample Template 2' },
      { id: 15, name: 'Water Buffalo Sample Template 3' },
      { id: 16, name: 'Water Buffalo Sample Template 4' },
      { id: 17, name: 'Water Buffalo Sample Template 5' },
      { id: 18, name: 'Water Buffalo Sample Template 6' },
    ],
  }
  */

  // Fetch templates from backend when modal opens or animal group changes
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingTemplates(true);
    setFetchError('');
    axios.get(`${import.meta.env.VITE_API_URL}/formulation/templates`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.formulations)) {
          setFetchedTemplates(res.data.formulations);
        } else {
          setFetchedTemplates([]);
        }
      })
      .catch(() => {
        setFetchError('Failed to fetch templates');
        setFetchedTemplates([]);
      })
      .finally(() => setIsLoadingTemplates(false));
  }, [isOpen]);

  // Reset template selection when animal group changes
  useEffect(() => {
    setSelectedTemplate({ id: 0, name: 'None' })
    setTemplateQuery('')
  }, [formData.animal_group])

  // Filter fetched templates by selected animal group
  const templateOptions = [
    { id: 0, name: 'None' },
    ...(
      formData.animal_group
        ? fetchedTemplates
            .filter(t => t.animal_group === formData.animal_group)
            .map(t => ({ id: t._id, name: t.name, ...t }))
        : []
    )
  ];
  const isTemplateDisabled = !formData.animal_group || isLoadingTemplates || !!fetchError;
  const filteredTemplates =
    templateQuery === ''
      ? templateOptions
      : templateOptions.filter((t) =>
          t.name.toLowerCase().includes(templateQuery.toLowerCase())
        )

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
    const body = { ...formData, ownerId, ownerName, userType };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/formulation`,
        body
      )
      let newFormulation = res.data.formulations
      newFormulation.access = 'owner'
      // If a template is selected, clone its dependencies
      if (selectedTemplate && selectedTemplate.id && selectedTemplate.id !== 0) {
        try {
          setIsDisabled(true)
          const cloneRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/formulation/${newFormulation._id}/clone-template`,
            {
              templateId: selectedTemplate.id,
              userId: ownerId
            }
          )
          if (cloneRes.data && cloneRes.data.formulations) {
            newFormulation = cloneRes.data.formulations
          }
        } catch (cloneErr) {
          console.error(cloneErr)
          onResult(null, 'error', 'Failed to clone template dependencies.')
          setIsDisabled(false)
          return
        }
      }
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
      <div className="modal-box relative mt-[64px] w-11/12 max-w-2xl min-h-[500px] min-w-[350px] overflow-hidden rounded-3xl bg-white md:mt-0">
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
        <p className="mb-8 flex text-sm text-gray-500 whitespace-nowrap">
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

            {/* Animal Group Select */}
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
                <option value="Fish">Fish</option>
                <option value="Swine">Swine</option>
                <option value="Poultry">Poultry</option>
                <option value="Water Buffalo">Water Buffalo</option>
              </select>
            </div>
            {/* Template Combobox - only show if userType is not 'admin' */}
            {userType !== 'admin' && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Use Template</span>
                </label>
                <Combobox value={selectedTemplate} onChange={setSelectedTemplate} disabled={isTemplateDisabled} by="id">
                  <div className="relative">
                    <ComboboxInput
                      className="input input-bordered w-full rounded-xl pr-10"
                      displayValue={(t) => t?.name || ''}
                      onChange={(e) => setTemplateQuery(e.target.value)}
                      placeholder={isTemplateDisabled ? (fetchError ? fetchError : 'Select animal group first') : 'Select template'}
                      disabled={isTemplateDisabled}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <HiSelector className="h-5 w-5 text-gray-400" />
                    </ComboboxButton>
                    {!isTemplateDisabled && filteredTemplates.length > 0 && (
                      <ComboboxOptions className="absolute z-10 max-h-56 w-full max-w-[350px] overflow-auto bg-white py-1 text-base ring-[0.5px] -mt-[0.1px] focus:outline-none">
                        {filteredTemplates.map((template) => (
                          <ComboboxOption
                            key={template.id}
                            value={template}
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? 'bg-base-200 text-primary' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <span className={`flex items-center`}>
                                {selected && (
                                  <HiCheck className="mr-2 h-5 w-5 text-primary" />
                                )}
                                {template.name}
                              </span>
                            )}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
              </div>
            )}

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