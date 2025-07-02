import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { RiFileList2Line, RiLeafLine } from 'react-icons/ri'
import StatCard from '../components/StatCard'
import useAuth from '../hook/useAuth'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend)

function Dashboard() {
  const { user, loading } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [formulationCount, setFormulationCount] = useState(0)
  const [ingredientCount, setIngredientCount] = useState(0)
  const [formulationTypeCount, setFormulationTypeCount] = useState([0, 0, 0])
  const [recentFormulations, setRecentFormulations] = useState([])

  const pieData = useMemo(
    () => ({
      labels: ['Swine', 'Poultry', 'Water Buffalo'],
      datasets: [
        {
          data: formulationTypeCount,
          backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
          borderWidth: 0,
        },
      ],
    }),
    [formulationTypeCount]
  )

  const pieOptions = useMemo(
    () => ({
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
      },
      maintainAspectRatio: false,
    }),
    []
  )

  useEffect(() => {
    if (user) {
      fetchFormulationData()
      fetchIngredientData()
    }
  }, [user])

  const fetchFormulationData = async () => {
    try {
      const formulationRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/formulation/filtered/${user._id}?limit=1000`
      )
      const formulations = formulationRes.data.formulations
      setFormulationCount(formulations.length)
      // count formulation types
      const swine = formulations.filter((item) => item.animal_group === 'Swine')
      const poultry = formulations.filter(
        (item) => item.animal_group === 'Poultry'
      )
      const waterBuffalo = formulations.filter(
        (item) => item.animal_group === 'Water Buffalo'
      )
      const typeCount = [swine.length, waterBuffalo.length, poultry.length]
      setFormulationTypeCount(typeCount)
      // recent formulations
      const recent = formulations
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      setRecentFormulations(recent)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchIngredientData = async () => {
    try {
      const ingredientRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/ingredient/filtered/${user._id}?limit=1000`
      )
      const ingredients = ingredientRes.data.ingredients
      setIngredientCount(ingredients.length)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

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
    <div className="space-y-6 p-2 md:p-4">
      <h1 className="text-deepbrown mb-6 text-2xl font-bold">
        Welcome, {user.displayName}!
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={RiFileList2Line}
          value={formulationCount}
          label="Active Formulations"
        />
        <StatCard
          icon={RiLeafLine}
          value={ingredientCount}
          label="Ingredients"
        />
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-deepbrown mb-4 text-lg font-semibold">
            Feed Classifications
          </h2>
          <div className="h-[200px] w-full">
            {formulationTypeCount[0] !== 0 ||
            formulationTypeCount[1] !== 0 ||
            formulationTypeCount[2] !== 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md">
                <p className="p-4 text-center text-lg text-gray-500">
                  No data to display yet.
                  <br />
                  <span className="text-sm italic">
                    Create/Classify a formulation to see results.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-deepbrown mb-4 text-lg font-semibold">
          Recent Formulations
        </h2>
        <div className="w-full">
          {recentFormulations.length > 0 ? (
            <div className="space-y-2">
              {recentFormulations.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3">
                      <span className="hidden h-7 w-14 items-center justify-center rounded bg-gray-100 text-center font-mono text-sm text-gray-600 md:flex">
                        {f.code || '-'}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-deepbrown font-medium">
                          {f.name}
                        </span>
                        <span
                          className={`text-xs ${
                            f.animal_group === 'Swine'
                              ? 'text-[#FF6384]'
                              : f.animal_group === 'Poultry'
                                ? 'text-[#FFCE56]'
                                : 'text-[#36A2EB]'
                          }`}
                        >
                          {f.animal_group || 'No group specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-medium ${
                          f.access === 'owner'
                            ? 'text-gray-600'
                            : f.access === 'edit'
                              ? 'text-blue-600'
                              : 'text-orange-600'
                        }`}
                      >
                        {f.access === 'owner'
                          ? 'Owner'
                          : f.access === 'edit'
                            ? 'Can Edit'
                            : 'View Only'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-gray-500">No recent formulations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
