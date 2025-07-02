import useAuth from '../hook/useAuth'

function Header() {
  const { user } = useAuth()

  return (
    //  header containing date (month, day, year) and time on the  leftmost side and a default profile icon on the rightmost side
    <header className="bg-white p-2 shadow-sm">
      <div className="text-darkbrown flex items-center justify-between">
        <div className="items-left border-darkbrown ml-6 flex flex-col">
          <p className="text-darkbrown text-lg font-bold">SAPAT</p>
          <p className="text-sm">
            {' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="mr-6 flex items-center">
          <p className="hidden md:mr-6 md:block md:text-lg md:font-bold">
            {user?.displayName || 'Guest'}
          </p>
          <img
            className="h-10 w-10 rounded-2xl"
            alt="Profile"
            src={user?.profilePicture || 'https://ui-avatars.com/api/?name='}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
