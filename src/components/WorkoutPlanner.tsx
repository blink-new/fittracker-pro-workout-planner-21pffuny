import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useToast } from '../hooks/use-toast'
import { blink } from '../blink/client'
import { 
  Calendar, 
  Dumbbell, 
  Plus, 
  Trash2, 
  Clock, 
  Target, 
  Zap, 
  Save,
  Play,
  CheckCircle
} from 'lucide-react'

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

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructions: string
  tips: string
}

interface WorkoutExercise {
  exercise: Exercise
  sets: number
  reps: number
  weight?: number
  restSeconds: number
  notes?: string
  completed?: boolean
}

interface WorkoutPlannerProps {
  user: User
  userProfile: UserProfile | null
}

const exerciseDatabase: Exercise[] = [
  // Sample exercises (same as in BodyMap)
  { id: 'ex_push_ups', name: 'Push-ups', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Start in plank position, lower chest to ground, push back up', tips: 'Keep core tight and body straight' },
  { id: 'ex_squats', name: 'Squats', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Lower hips back and down, return to standing', tips: 'Keep knees behind toes, chest up' },
  { id: 'ex_planks', name: 'Planks', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Hold straight body position', tips: 'Keep hips level, breathe normally' },
  { id: 'ex_pull_ups', name: 'Pull-ups', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate', instructions: 'Hang from bar, pull body up until chin over bar', tips: 'Engage lats, avoid swinging' },
  { id: 'ex_lunges', name: 'Lunges', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Step forward, lower back knee, return to start', tips: 'Keep front knee over ankle' },
  { id: 'ex_bicep_curls', name: 'Bicep Curls', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner', instructions: 'Curl weights up to shoulders', tips: 'Control the negative' },
]

export default function WorkoutPlanner({ user, userProfile }: WorkoutPlannerProps) {
  const { toast } = useToast()
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutExercise[]>([])
  const [workoutName, setWorkoutName] = useState('')
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<string>('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const addExerciseToWorkout = (exercise: Exercise) => {
    const aiReps = getAIRecommendedReps(exercise)
    const newWorkoutExercise: WorkoutExercise = {
      exercise,
      sets: aiReps.sets,
      reps: aiReps.reps,
      restSeconds: aiReps.restSeconds,
      completed: false
    }
    setCurrentWorkout(prev => [...prev, newWorkoutExercise])
    setShowExerciseSelector(false)
    toast({
      title: "Exercise Added",
      description: `${exercise.name} added to your workout with AI recommendations`,
    })
  }

  const getAIRecommendedReps = (exercise: Exercise) => {
    // AI-powered recommendations based on user profile
    const baseReps = {
      beginner: { sets: 2, reps: 8, restSeconds: 90 },
      intermediate: { sets: 3, reps: 10, restSeconds: 75 },
      advanced: { sets: 4, reps: 12, restSeconds: 60 }
    }

    const difficulty = exercise.difficulty
    let recommendation = baseReps[difficulty]

    // Adjust based on user's fitness goal
    if (userProfile?.fitnessGoal === 'strength') {
      recommendation = { ...recommendation, reps: Math.max(5, recommendation.reps - 3), restSeconds: recommendation.restSeconds + 30 }
    } else if (userProfile?.fitnessGoal === 'endurance') {
      recommendation = { ...recommendation, reps: recommendation.reps + 5, restSeconds: recommendation.restSeconds - 15 }
    }

    // Adjust for female cycle phase
    if (userProfile?.gender === 'female' && userProfile.lastPeriodDate) {
      const cyclePhase = getCyclePhase()
      if (cyclePhase === 'menstrual') {
        recommendation = { ...recommendation, sets: Math.max(1, recommendation.sets - 1), reps: Math.max(5, recommendation.reps - 2) }
      } else if (cyclePhase === 'ovulation') {
        recommendation = { ...recommendation, sets: recommendation.sets + 1, reps: recommendation.reps + 2 }
      }
    }

    return recommendation
  }

  const getCyclePhase = () => {
    if (!userProfile?.lastPeriodDate) return null
    const lastPeriod = new Date(userProfile.lastPeriodDate)
    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLastPeriod <= 5) return 'menstrual'
    if (daysSinceLastPeriod <= 13) return 'follicular'
    if (daysSinceLastPeriod <= 16) return 'ovulation'
    return 'luteal'
  }

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    setCurrentWorkout(prev => prev.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    ))
  }

  const removeExercise = (index: number) => {
    setCurrentWorkout(prev => prev.filter((_, i) => i !== index))
  }

  const startWorkout = () => {
    setIsWorkoutActive(true)
    setWorkoutStartTime(new Date())
    toast({
      title: "Workout Started!",
      description: "Good luck! Remember to focus on proper form.",
    })
  }

  const completeWorkout = async () => {
    if (!workoutStartTime) return

    const duration = Math.floor((new Date().getTime() - workoutStartTime.getTime()) / (1000 * 60))
    const completedExercises = currentWorkout.filter(ex => ex.completed).length
    
    // In a real app, this would save to database
    toast({
      title: "Workout Completed! 🎉",
      description: `Great job! You completed ${completedExercises}/${currentWorkout.length} exercises in ${duration} minutes.`,
    })

    // Reset workout state
    setIsWorkoutActive(false)
    setWorkoutStartTime(null)
    setCurrentWorkout([])
    setWorkoutName('')
    setWorkoutNotes('')
  }

  const generateAIWorkout = async () => {
    setIsGeneratingAI(true)
    try {
      const prompt = `Generate a personalized workout plan for a ${userProfile?.gender || 'person'} with the following profile:
      - Age: ${userProfile?.age || 'unknown'}
      - Fitness Goal: ${userProfile?.fitnessGoal || 'general fitness'}
      - Activity Level: ${userProfile?.activityLevel || 'beginner'}
      - Workout Frequency: ${userProfile?.workoutFrequency || 3} times per week
      ${userProfile?.gender === 'female' ? `- Current cycle phase: ${getCyclePhase() || 'unknown'}` : ''}
      
      Please provide a detailed workout plan with specific exercises, sets, reps, and rest periods. Focus on exercises that match their goal and experience level.`

      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: 500
      })

      setAiRecommendations(text)
      toast({
        title: "AI Workout Generated!",
        description: "Your personalized workout plan is ready.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI workout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Workout Planner</h2>
        <p className="text-gray-600">
          Create personalized workouts with AI recommendations based on your profile and goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Builder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2" />
                Current Workout
                {isWorkoutActive && (
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    <Play className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExerciseSelector(true)}
                  disabled={isWorkoutActive}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Exercise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIWorkout}
                  disabled={isGeneratingAI}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  {isGeneratingAI ? 'Generating...' : 'AI Workout'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isWorkoutActive && (
              <div className="mb-4 space-y-3">
                <div>
                  <Label htmlFor="workoutName">Workout Name</Label>
                  <Input
                    id="workoutName"
                    placeholder="e.g., Upper Body Strength"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="workoutNotes">Notes (optional)</Label>
                  <Textarea
                    id="workoutNotes"
                    placeholder="Any notes about this workout..."
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}

            {currentWorkout.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No exercises added yet</p>
                <p className="text-sm">Add exercises to build your workout or generate an AI workout plan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentWorkout.map((workoutExercise, index) => (
                  <Card key={index} className={`${workoutExercise.completed ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {workoutExercise.exercise.name}
                            </h3>
                            {workoutExercise.completed && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex space-x-2 mb-2">
                            <Badge className={getMuscleGroupColor(workoutExercise.exercise.muscleGroup)}>
                              {workoutExercise.exercise.muscleGroup}
                            </Badge>
                            <Badge className={getDifficultyColor(workoutExercise.exercise.difficulty)}>
                              {workoutExercise.exercise.difficulty}
                            </Badge>
                          </div>
                        </div>
                        {!isWorkoutActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div>
                          <Label className="text-xs text-gray-600">Sets</Label>
                          <Input
                            type="number"
                            value={workoutExercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                            disabled={isWorkoutActive}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Reps</Label>
                          <Input
                            type="number"
                            value={workoutExercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                            disabled={isWorkoutActive}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Weight (kg)</Label>
                          <Input
                            type="number"
                            step="0.5"
                            value={workoutExercise.weight || ''}
                            onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                            placeholder="Optional"
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Rest (sec)</Label>
                          <Input
                            type="number"
                            value={workoutExercise.restSeconds}
                            onChange={(e) => updateExercise(index, 'restSeconds', parseInt(e.target.value))}
                            disabled={isWorkoutActive}
                            className="h-8"
                          />
                        </div>
                      </div>

                      {isWorkoutActive && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Rest: {workoutExercise.restSeconds}s
                          </div>
                          <Button
                            size="sm"
                            variant={workoutExercise.completed ? "outline" : "default"}
                            onClick={() => updateExercise(index, 'completed', !workoutExercise.completed)}
                            className={workoutExercise.completed ? "text-green-600" : ""}
                          >
                            {workoutExercise.completed ? 'Completed' : 'Mark Complete'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {currentWorkout.length > 0 && (
              <div className="mt-6 flex space-x-3">
                {!isWorkoutActive ? (
                  <>
                    <Button
                      onClick={startWorkout}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={completeWorkout}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Workout
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendations & Stats */}
        <div className="space-y-6">
          {/* Workout Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Exercises:</span>
                  <span className="font-medium">{currentWorkout.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sets:</span>
                  <span className="font-medium">
                    {currentWorkout.reduce((acc, ex) => acc + ex.sets, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Duration:</span>
                  <span className="font-medium">
                    {Math.round(currentWorkout.reduce((acc, ex) => 
                      acc + (ex.sets * (ex.restSeconds + 30)), 0) / 60)}min
                  </span>
                </div>
                {isWorkoutActive && workoutStartTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Elapsed:</span>
                    <span className="font-medium text-green-600">
                      {Math.floor((new Date().getTime() - workoutStartTime.getTime()) / (1000 * 60))}min
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          {aiRecommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {aiRecommendations}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cycle Info for Females */}
          {userProfile?.gender === 'female' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-600">Cycle Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700">
                  <p className="mb-2">
                    <strong>Current Phase:</strong> {getCyclePhase() || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Your workout recommendations are automatically adjusted based on your menstrual cycle phase for optimal results.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Exercise Selector Dialog */}
      <Dialog open={showExerciseSelector} onOpenChange={setShowExerciseSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Exercise to Workout</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exerciseDatabase.map((exercise) => (
              <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <Target className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge className={getMuscleGroupColor(exercise.muscleGroup)}>
                      {exercise.muscleGroup}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {exercise.instructions}
                  </p>

                  <Button
                    onClick={() => addExerciseToWorkout(exercise)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="sm"
                  >
                    Add to Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}