import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import Dashboard from './components/Dashboard'
import ProfileSetup from './components/ProfileSetup'
import BodyMap from './components/BodyMap'
import WorkoutPlanner from './components/WorkoutPlanner'
import { Dumbbell, User, Map, Calendar } from 'lucide-react'

interface User {
  id: string
  email: string
  displayName?: string
}

interface UserProfile {
  id: string
  userId: string
  height?: number
  weight?: number
  gender?: 'male' | 'female'
  age?: number
  fitnessGoal?: string
  activityLevel?: string
  workoutFrequency?: number
  menstrualCycleLength?: number
  lastPeriodDate?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'bodymap' | 'planner'>('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Mock user profile for now (will be replaced with database)
  useEffect(() => {
    if (user) {
      // Simulate loading user profile
      setUserProfile({
        id: 'profile_1',
        userId: user.id,
        height: 165,
        weight: 60,
        gender: 'female',
        age: 25,
        fitnessGoal: 'muscle_gain',
        activityLevel: 'intermediate',
        workoutFrequency: 4,
        menstrualCycleLength: 28,
        lastPeriodDate: '2025-01-10'
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-indigo-600 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Loading FitTracker Pro...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Dumbbell className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">FitTracker Pro</h1>
          <p className="text-gray-600 mb-8">AI-Powered Workout Planner with 3D Body Mapping</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'bodymap', label: '3D Body Map', icon: Map },
    { id: 'planner', label: 'Workout Planner', icon: Dumbbell },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FitTracker Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.displayName || user.email}</span>
              <button
                onClick={() => blink.auth.logout()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && <Dashboard user={user} userProfile={userProfile} />}
          {currentView === 'profile' && (
            <ProfileSetup 
              user={user} 
              userProfile={userProfile} 
              onProfileUpdate={setUserProfile} 
            />
          )}
          {currentView === 'bodymap' && <BodyMap userProfile={userProfile} />}
          {currentView === 'planner' && <WorkoutPlanner user={user} userProfile={userProfile} />}
        </main>
      </div>

      <Toaster />
    </div>
  )
}

export default App