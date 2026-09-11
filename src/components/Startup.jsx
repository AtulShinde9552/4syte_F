import { useEffect, useState } from 'react'
import App from '../App.jsx'
import PulseLoader from './PulseLoader.jsx'

function Startup() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
		const hasLoggedInUser = Boolean(localStorage.getItem('user'))
		const timeoutId = window.setTimeout(
			() => setIsLoading(false),
			hasLoggedInUser ? 0 : 3000,
		)

    return () => window.clearTimeout(timeoutId)
	}, [])

  if (isLoading) {
    return (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#F4F7F6',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <PulseLoader size={300} />
      </div>
    )
  }

  return <App />
}

export default Startup