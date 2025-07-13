import { RiCloseLine, RiDeleteBinLine } from 'react-icons/ri'
import { MdLink } from 'react-icons/md'
import { useState } from 'react'
import axios from 'axios'

function ShareFormulationModal({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  onDelete,
  userId,
  formulation,
  collaborators,
}) {
  const [newCollaborator, setNewCollaborator] = useState({
    newId: '',
    newDisplayName: '',
    newProfilePicture: '',
    newEmail: '',
    newAccess: 'edit',
  })
  const [updatedCollaborators, setUpdatedCollaborators] = useState([])

  const handleNewCollaborator = async (e) => {
    e.preventDefault()
    try {
      //first check if the email already exists in collaborators
      const isExistingCollaborator = collaborators.some(
        (collaborator) => collaborator.email === newCollaborator.newEmail
      )
      if (isExistingCollaborator) {
        onAdd('error', newCollaborator, 'This user is already a collaborator.')
        clearInput()
        return
      }

      // get collaborator details based on newCollaborator.newCollaboratorEmail
      const userData = await fetchNewCollaboratorDataByEmail()
      // only call this if success
      if (userData) {
        const formattedCollaborator = {
          newId: userData._id,
          newDisplayName: userData.displayName,
          newProfilePicture: userData.profilePicture,
          newEmail: userData.email,
          newAccess: newCollaborator.newAccess,
        }
        onAdd('success', formattedCollaborator, '')
      }
    } catch (err) {
      console.log(err)
    }
  }

  // handle change for existing collaborators
  const handleAccessChange = (collaboratorId, newAccess) => {
    setUpdatedCollaborators((prev) => {
      // Check if collaborator is already in updatedCollaborators
      const existingIndex = prev.findIndex(
        (c) => c.collaboratorId === collaboratorId
      )

      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev]
        updated[existingIndex] = { collaboratorId, access: newAccess }
        return updated
      } else {
        // Add new entry
        return [...prev, { collaboratorId, access: newAccess }]
      }
    })
  }

  const handleDone = async () => {
    if (updatedCollaborators.length > 0) {
      try {
        const updatedCollaboratorsPromises = updatedCollaborators.map(
          async (updatedCollaborator) => {
            const res = await axios.put(
              `${import.meta.env.VITE_API_URL}/formulation/collaborator/${formulation._id}`,
              {
                updaterId: userId,
                collaboratorId: updatedCollaborator.collaboratorId,
                access: updatedCollaborator.access,
              }
            )
          }
        )
        await Promise.all(updatedCollaboratorsPromises)

        const allUpdatedCollaborators = collaborators.map((collaborator) => {
          const update = updatedCollaborators.find(
            (u) => u.collaboratorId === collaborator._id
          )
          if (update) {
            return {
              ...collaborator,
              access: update.access,
            }
          }
          return collaborator
        })

        onEdit(allUpdatedCollaborators)
      } catch (err) {
        console.log(err)
      }
    }
    handleClose()
  }

  // handle change for new collaborator
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewCollaborator((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchNewCollaboratorDataByEmail = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user-check/email/${newCollaborator.newEmail}`
      )
      return res.data.user[0]
    } catch (err) {
      if (err.response.status === 404) {
        onAdd('error', newCollaborator, 'User not found. Ask them to register.')
        clearInput()
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // note: does not really add; just want to use the toast functionality
      onAdd('linkCopied', newCollaborator, 'Link copied to clipboard.')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const clearInput = () => {
    setNewCollaborator({
      newId: '',
      newDisplayName: '',
      newProfilePicture: '',
      newEmail: '',
      newAccess: 'edit',
    })
  }
  const handleClose = () => {
    setUpdatedCollaborators([])
    setNewCollaborator({
      newId: '',
      newDisplayName: '',
      newProfilePicture: '',
      newEmail: '',
      newAccess: 'edit',
    })
    onClose()
  }

  return (
    <dialog
      id="formulation_created_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-md rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={handleClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-2 text-lg font-bold">
          {`Share "${formulation?.name}"`}
        </h3>

        {/* Share section */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Share with others</p>
            <form
              className="flex flex-1 gap-2"
              onSubmit={handleNewCollaborator}
            >
              <input
                type="email"
                name="newEmail"
                placeholder="Add email"
                required
                value={newCollaborator.newEmail}
                onChange={handleChange}
                className="input input-bordered flex-3 rounded-xl text-xs md:text-sm"
              />
              <select
                name="newAccess"
                value={newCollaborator.newAccess}
                onChange={handleChange}
                className="select select-bordered flex-1 rounded-xl text-xs md:text-sm"
              >
                <option value="edit">Can edit</option>
                <option value="view">Can view</option>
              </select>
              <button
                type="submit"
                className="btn bg-green-button rounded-xl px-3 text-white hover:bg-green-600"
              >
                Invite
              </button>
            </form>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Who has access</p>
            <div className="max-h-[40vh] space-y-3 overflow-y-auto pr-2">
              {collaborators?.map((collaborator, collaboratorIndex) => (
                <div
                  className="flex items-center justify-between"
                  key={collaboratorIndex}
                >
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="h-8 w-8 rounded-full bg-gray-200">
                        <img src={collaborator.profilePicture} alt="" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {collaborator.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collaborator.email}
                      </p>
                    </div>
                  </div>
                  {collaborator.access === 'owner' ? (
                    <span className="text-sm text-gray-500">Owner</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        className="select select-xs w-18 rounded-xl text-sm"
                        value={
                          updatedCollaborators.find(
                            (c) => c.collaboratorId === collaborator._id
                          )?.access || collaborator.access
                        }
                        onChange={(e) =>
                          handleAccessChange(collaborator._id, e.target.value)
                        }
                      >
                        <option value="edit">edit</option>
                        <option value="view">view</option>
                      </select>
                      <button
                        onClick={() => onDelete(collaborator._id)}
                        className="btn btn-ghost btn-xs hover:bg-deepbrown/10"
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={handleCopyLink}
            className="btn btn-outline rounded-xl px-4"
          >
            Copy link
            <MdLink className="h-5 w-5" />
          </button>
          <button className="btn rounded-xl px-4" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  )
}

export default ShareFormulationModal
