'use client'

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense'
import { useParams } from 'react-router-dom'

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Ingredients from './pages/Ingredients'
import Nutrients from './pages/Nutrients'
import Formulations from './pages/Formulations'
import ViewFormulationEntry from './pages/ViewFormulation/ViewFormulationEntry.jsx'
import Error from './pages/Error'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Loading from './components/Loading'
import useAuth from './hook/useAuth.js'
import { LiveObject } from '@liveblocks/client'

function AppLayout() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/'

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {!isAuthPage && <Header />}
      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && <Sidebar />}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function FormulationRoom() {
  const { id } = useParams()
  return (
    <RoomProvider
      id={`formulation-${id}`}
      initialPresence={{ focusedId: null }}
      initialStorage={{
        formulation: new LiveObject({
          code: '',
          name: '',
          description: '',
          animal_group: '',
        }),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <ViewFormulationEntry id={id} />}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/ingredients',
        element: <Ingredients />,
      },
      {
        path: '/nutrients',
        element: <Nutrients />,
      },
      {
        path: '/formulations',
        element: <Formulations />,
      },
      {
        path: '/formulations/:id',
        element: <FormulationRoom />,
      },
      {
        path: '/error',
        element: <Error />,
      },
    ],
  },
])

function App() {
  const { liveblocksAuth } = useAuth()

  return (
    <LiveblocksProvider authEndpoint={liveblocksAuth}>
      <RouterProvider router={router} />
    </LiveblocksProvider>
  )
}

export default App
