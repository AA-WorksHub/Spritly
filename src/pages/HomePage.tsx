import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1>Welcome to Spritly</h1>
      <p>Your app for creating and managing sprites !</p>
      <Link to="/editor" className="bg-gray-500 text-white px-4 py-1 rounded mt-2">Go to Editor</Link>
    </div>
  )
}

export default HomePage