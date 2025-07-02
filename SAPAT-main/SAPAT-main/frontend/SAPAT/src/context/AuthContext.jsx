import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/user`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Not authenticated')
      })
      .then((userData) => {
        setUser(userData)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        credentials: 'include',
        method: 'GET',
      })
      if (res.ok) {
        setUser(null)
        window.location.href = '/' // Force a full page reload
      } else {
        throw new Error('Logout failed')
      }
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const liveblocksAuth = async (room) => {
    try {
      const res = await fetch(`${API_URL}/api/liveblocks-auth`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ room }),
      })
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Lblocks auth failed')
      }
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, liveblocksAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
