import { useEffect } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

function Toast({ show, action, message, onHide }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [show, onHide])
  return (
    <>
      {show && (
        <div className="toast toast-end toast-bottom rounded-lg p-4" id="toast">
          <div
            className={`alert flex flex-nowrap text-sm text-white ${action === 'success' ? 'alert-success' : 'alert-error'}`}
          >
            {action === 'success' ? (
              <FaCheck className="text-sm text-white" />
            ) : (
              <FaTimes className="text-sm text-white" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default Toast
