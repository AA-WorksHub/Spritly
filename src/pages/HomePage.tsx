import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Welcome to Spritly</h1>
      <p>Your go-to app for creating and managing sprites!</p>
      <Link to="/editor">Go to Editor</Link>
    </div>
  )
}

export default HomePage