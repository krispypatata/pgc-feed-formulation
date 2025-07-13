import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine,
  RiLeafLine,
  RiStackLine,
  RiFlaskLine,
  RiLogoutBoxLine,
} from 'react-icons/ri'
import useAuth from '../hook/useAuth'
import ConfirmationModal from './modals/ConfirmationModal.jsx'
import { useState } from 'react'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [targetPath, setTargetPath] = useState(null)

  const menuItems = [
    { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { path: '/ingredients', icon: RiLeafLine, label: 'Ingredients' },
    { path: '/nutrients', icon: RiStackLine, label: 'Nutrients' },
    { path: '/formulations', icon: RiFlaskLine, label: 'Formulate' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }


  const handleNavigation = (e, path) => {
    e.preventDefault()

    if (location.pathname === path) return

    const isFormulationDetailPage = /^\/formulations\/[^\/]+$/.test(location.pathname)
    if (isFormulationDetailPage) {
      setTargetPath(path)
      setIsConfirmationModalOpen(true)
    } else {
      navigate(path)
    }
  }

  const handleConfirmNavigation = () => {
    if (targetPath) {
      navigate(targetPath)
      setTargetPath(null)
    }
    setIsConfirmationModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false)
    setTargetPath(null)
  }


  return (
    <div className="bg-green-accent flex h-full w-14 flex-col p-3 md:w-44">
      <div className="mb-8 flex justify-center">
        <img
          src="/assets/logo.png"
          alt="SAPAT Logo"
          className="h-8 w-8 md:h-16 md:w-16"
        />
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => handleNavigation(e, item.path)}
            className={`flex items-center rounded-lg p-2 transition-colors ${
              location.pathname === item.path
                ? 'text-deepbrown bg-white'
                : 'text-darkbrown hover:bg-white/50'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="ml-3 hidden md:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pb-10 md:pl-2">
        <button
          onClick={handleLogout}
          className="text-darkbrown hover:bg-red-button flex cursor-pointer items-center rounded-lg p-1 transition-colors hover:text-white md:px-4"
        >
          <RiLogoutBoxLine className="h-6 w-6" />
          <span className="ml-3 hidden md:block">Logout</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmNavigation}
        title="Hold On!"
        description={`Don’t forget to save! Go back or hit Ctrl + S if your formulation isn’t saved yet."`}
        type="save"
      />
    </div>
  )
}

export default Sidebar
