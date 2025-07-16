import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Calendar, Dumbbell, Target, TrendingUp, Clock, Flame } from 'lucide-react'

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

interface Workout {
  id: string
  date: string
  muscleGroups: string[]
  totalExercises: number
  totalSets: number
  durationMinutes: number
}

interface DashboardProps {
  user: User
  userProfile: UserProfile | null
}

export default function Dashboard({ user, userProfile }: DashboardProps) {
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState(0)

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkouts: Workout[] = [
      {
        id: '1',
        date: '2025-01-15',
        muscleGroups: ['chest', 'arms'],
        totalExercises: 6,
        totalSets: 18,
        durationMinutes: 45
      },
      {
        id: '2',
        date: '2025-01-13',
        muscleGroups: ['legs', 'glutes'],
        totalExercises: 5,
        totalSets: 15,
        durationMinutes: 50
      },
      {
        id: '3',
        date: '2025-01-11',
        muscleGroups: ['back', 'shoulders'],
        totalExercises: 7,
        totalSets: 21,
        durationMinutes: 55
      }
    ]
    setRecentWorkouts(mockWorkouts)
    setWeeklyProgress(75) // 3 out of 4 planned workouts
  }, [])

  const getGoalDisplay = (goal?: string) => {
    const goals: Record<string, string> = {
      weight_loss: 'Weight Loss',
      muscle_gain: 'Muscle Gain',
      strength: 'Strength Building',
      endurance: 'Endurance'
    }
    return goals[goal || ''] || 'Not Set'
  }

  const getMuscleGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      chest: 'bg-red-100 text-red-800',
      back: 'bg-blue-100 text-blue-800',
      legs: 'bg-green-100 text-green-800',
      glutes: 'bg-pink-100 text-pink-800',
      arms: 'bg-purple-100 text-purple-800',
      shoulders: 'bg-orange-100 text-orange-800',
      core: 'bg-yellow-100 text-yellow-800'
    }
    return colors[group] || 'bg-gray-100 text-gray-800'
  }

  const getCyclePhase = () => {
    if (!userProfile?.gender || userProfile.gender !== 'female' || !userProfile.lastPeriodDate) {
      return null
    }

    const lastPeriod = new Date(userProfile.lastPeriodDate)
    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const cycleLength = userProfile.menstrualCycleLength || 28

    if (daysSinceLastPeriod <= 5) {
      return { phase: 'Menstrual', color: 'text-red-600', recommendation: 'Light exercises, yoga, walking' }
    } else if (daysSinceLastPeriod <= 13) {
      return { phase: 'Follicular', color: 'text-green-600', recommendation: 'Great time for strength training' }
    } else if (daysSinceLastPeriod <= 16) {
      return { phase: 'Ovulation', color: 'text-blue-600', recommendation: 'Peak energy - intense workouts' }
    } else {
      return { phase: 'Luteal', color: 'text-orange-600', recommendation: 'Moderate intensity, focus on endurance' }
    }
  }

  const cycleInfo = getCyclePhase()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user.displayName || user.email?.split('@')[0]}!
        </h2>
        <p className="text-indigo-100">
          Ready to crush your fitness goals today? Let's make it happen!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Goal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((weeklyProgress / 100) * (userProfile?.workoutFrequency || 4))}/
                  {userProfile?.workoutFrequency || 4}
                </p>
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <Progress value={weeklyProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900">{recentWorkouts.length}</p>
              </div>
              <Dumbbell className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(recentWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0) / recentWorkouts.length || 0)}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {workout.durationMinutes}min
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {workout.muscleGroups.map((group) => (
                        <Badge key={group} variant="secondary" className={getMuscleGroupColor(group)}>
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{workout.totalExercises} exercises</p>
                    <p className="text-sm text-gray-500">{workout.totalSets} sets</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile & Cycle Info */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Goal:</span>
                <span className="font-medium">{getGoalDisplay(userProfile?.fitnessGoal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-medium capitalize">{userProfile?.activityLevel || 'Not Set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Target:</span>
                <span className="font-medium">{userProfile?.workoutFrequency || 0} workouts</span>
              </div>
              {userProfile?.height && userProfile?.weight && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{userProfile.height}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{userProfile.weight}kg</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Cycle Tracking for Females */}
          {cycleInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-600">Cycle Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className={`text-lg font-semibold ${cycleInfo.color} mb-2`}>
                    {cycleInfo.phase} Phase
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {cycleInfo.recommendation}
                  </p>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="text-xs text-pink-700">
                      Workouts are automatically adjusted based on your cycle phase for optimal results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                Start New Workout
              </button>
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors">
                View 3D Body Map
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                Update Profile
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}