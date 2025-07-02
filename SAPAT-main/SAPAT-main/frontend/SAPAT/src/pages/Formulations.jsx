import { RiAddLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import CreateFormulationModal from '../components/modals/formulations/CreateFormulationModal'
import EditFormulationModal from '../components/modals/formulations/EditFormulationModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuth from '../hook/useAuth.js'
import axios from 'axios'
import Search from '../components/Search.jsx'
import Pagination from '../components/Pagination.jsx'
import SortBy from '../components/SortBy.jsx'
import FilterBy from '../components/FilterBy.jsx'

function Formulations() {
  const { user, loading } = useAuth()

  const [formulations, setFormulations] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedFormulation, setSelectedFormulation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')
  const navigateURL = useNavigate()
  // pagination
  const [page, setPage] = useState(1)
  const limit = 8
  const [paginationInfo, setPaginationInfo] = useState({
    totalSize: 0,
    totalPages: 0,
    pageSize: 5,
    page: 1,
  })
  // filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, searchQuery, sortBy, sortOrder, filters, page])

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/formulation/filtered/search/${user._id}?searchQuery=${searchQuery}&filters=${filters}&sortBy=${sortBy}&sortOrder=${sortOrder}&skip=${(page - 1) * limit}&limit=${limit}`
      )
      const fetchedData = res.data
      setFormulations(fetchedData.fetched)
      setPaginationInfo(fetchedData.pagination)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleFilterQuery = (type, value) => {
    type === 'query' && setSearchQuery(value)
    type === 'filter' && setFilters(value)
    if (type === 'sort') {
      const [by, order] = value.split('-')
      if (by === 'na') {
        setSortBy('')
        setSortOrder('')
      } else {
        setSortBy(by)
        setSortOrder(order)
      }
    }
    setPage(1)
  }

  const handleEditClick = (formulation) => {
    setSelectedFormulation(formulation)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (formulation) => {
    setSelectedFormulation(formulation)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const selectedId = selectedFormulation._id
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/formulation/${selectedFormulation._id}`
      )
      const messageData = res.data.message
      if (messageData === 'success') {
        const filteredFormulations = formulations.filter(
          (formulation) => formulation._id !== selectedId
        )
        setFormulations(filteredFormulations)
        if (filteredFormulations.length === 0) {
          setPage(1)
          setSearchQuery('')
          setFilters('')
          setSortBy('')
          setSortOrder('')
          await fetchData()
        }
      }
      // toast instructions
      setShowToast(true)
      setMessage(
        messageData === 'success'
          ? 'Formulation deleted successfully'
          : 'Failed to delete formulation.'
      )
      setToastAction(messageData)
    } catch (err) {
      console.log(err)
      setShowToast(true)
      setMessage('Failed to delete formulation.')
      setToastAction('error')
    }
  }

  const handleCreateResult = (newFormulation, action, message) => {
    setIsCreateModalOpen(false)
    setFormulations([newFormulation, ...formulations])
    // toast instructions
    setShowToast(true)
    setMessage(message)
    setToastAction(action)
  }

  const handleEditResult = (updatedFormulation, action, message) => {
    setIsEditModalOpen(false)
    setFormulations((prevFormulations) => {
      const index = prevFormulations.findIndex(
        (formulation) => formulation._id === updatedFormulation._id
      )
      const updated = [...prevFormulations]
      const formulationAccess = updated[index].access
      updated[index] = { ...updatedFormulation, access: formulationAccess }
      return updated
    })
    // toast instructions
    setShowToast(true)
    setMessage(message)
    setToastAction(action)
  }

  const handleRowClick = (formulation) => {
    navigateURL(`/formulations/${formulation._id}`)
  }

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

  const handlePageChange = (page) => {
    setPage(page)
  }

  const headers = ['Code', 'Name', 'Description', 'Animal Group', 'Permission']
  const filterOptions = [
    { value: 'Swine', label: 'Swine' },
    { value: 'Poultry', label: 'Poultry' },
    { value: 'Water Buffalo', label: 'Water Buffalo' },
  ]
  const sortOptions = [
    { value: 'na-default', label: 'Default' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'animal_group-asc', label: 'Group (A-Z)' },
    { value: 'animal_group-desc', label: 'Group (Z-A)' },
  ]

  if (loading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/" />
  }
  // loading due to api calls
  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-20 space-y-6 bg-gray-50 p-2 md:p-4">
        <h1 className="text-deepbrown mb-3 text-xl font-bold md:text-2xl">
          Formulations
        </h1>

        {/* Action buttons and search */}
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-button flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700 md:gap-2 md:px-3 md:py-1.5 md:text-base"
            >
              <RiAddLine className="h-4 w-4 md:h-5 md:w-5" />
              <span>Add New</span>
            </button>
          </div>
          <div className="flex flex-col flex-wrap gap-2 md:flex-row">
            <div className="flex gap-2">
              <SortBy
                handleFilterQuery={handleFilterQuery}
                options={sortOptions}
              />
              <FilterBy
                handleFilterQuery={handleFilterQuery}
                options={filterOptions}
              />
            </div>
            <div>
              <Search handleFilterQuery={handleFilterQuery} />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-auto p-2 md:px-4">
        <Table
          headers={headers}
          data={formulations}
          page="formulations"
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRowClick={handleRowClick}
        />
      </div>

      {formulations && formulations.length > 0 && (
        <Pagination
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <CreateFormulationModal
        formulations={formulations}
        ownerId={user._id}
        ownerName={user.displayName}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onResult={handleCreateResult}
      />
      <EditFormulationModal
        formulations={formulations}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formulation={selectedFormulation}
        onResult={handleEditResult}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Formulation"
        description={`Are you sure you want to delete ${selectedFormulation?.name}? This action cannot be undone.`}
        type="delete"
      />

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

export default Formulations
