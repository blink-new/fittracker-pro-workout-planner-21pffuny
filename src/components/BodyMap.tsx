import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Map, Dumbbell, Clock, Target } from 'lucide-react'

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

interface BodyMapProps {
  userProfile: UserProfile | null
}

const muscleGroups = {
  chest: { name: 'Chest', color: '#EF4444' },
  shoulders: { name: 'Shoulders', color: '#F97316' },
  arms: { name: 'Arms', color: '#8B5CF6' },
  back: { name: 'Back', color: '#3B82F6' },
  core: { name: 'Core', color: '#EAB308' },
  legs: { name: 'Legs', color: '#22C55E' },
  glutes: { name: 'Glutes', color: '#EC4899' }
}

const exerciseDatabase: Exercise[] = [
  // Chest exercises
  { id: 'ex_push_ups', name: 'Push-ups', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Start in plank position, lower chest to ground, push back up', tips: 'Keep core tight and body straight' },
  { id: 'ex_bench_press', name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Lie on bench, lower bar to chest, press up', tips: 'Keep feet planted and back arched' },
  { id: 'ex_dumbbell_flyes', name: 'Dumbbell Flyes', muscleGroup: 'chest', equipment: 'dumbbells', difficulty: 'intermediate', instructions: 'Lie on bench, open arms wide, bring dumbbells together', tips: 'Control the weight, feel the stretch' },

  // Back exercises
  { id: 'ex_pull_ups', name: 'Pull-ups', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate', instructions: 'Hang from bar, pull body up until chin over bar', tips: 'Engage lats, avoid swinging' },
  { id: 'ex_bent_over_rows', name: 'Bent Over Rows', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Bend at hips, pull bar to lower chest', tips: 'Keep back straight, squeeze shoulder blades' },
  { id: 'ex_lat_pulldowns', name: 'Lat Pulldowns', muscleGroup: 'back', equipment: 'machine', difficulty: 'beginner', instructions: 'Pull bar down to upper chest', tips: 'Focus on pulling with lats, not arms' },

  // Legs exercises
  { id: 'ex_squats', name: 'Squats', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Lower hips back and down, return to standing', tips: 'Keep knees behind toes, chest up' },
  { id: 'ex_deadlifts', name: 'Deadlifts', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced', instructions: 'Lift bar from ground to hip level', tips: 'Keep bar close to body, drive through heels' },
  { id: 'ex_lunges', name: 'Lunges', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Step forward, lower back knee, return to start', tips: 'Keep front knee over ankle' },

  // Glutes exercises
  { id: 'ex_hip_thrusts', name: 'Hip Thrusts', muscleGroup: 'glutes', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Lie on back, thrust hips up, squeeze glutes', tips: 'Focus on glute activation' },
  { id: 'ex_bulgarian_split_squats', name: 'Bulgarian Split Squats', muscleGroup: 'glutes', equipment: 'bodyweight', difficulty: 'intermediate', instructions: 'Rear foot elevated, squat down on front leg', tips: 'Keep torso upright' },
  { id: 'ex_glute_bridges', name: 'Glute Bridges', muscleGroup: 'glutes', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Lie on back, lift hips up, squeeze glutes', tips: 'Hold at top for 2 seconds' },

  // Arms exercises
  { id: 'ex_bicep_curls', name: 'Bicep Curls', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner', instructions: 'Curl weights up to shoulders', tips: 'Control the negative' },
  { id: 'ex_tricep_dips', name: 'Tricep Dips', muscleGroup: 'arms', equipment: 'bodyweight', difficulty: 'intermediate', instructions: 'Lower body using arms, push back up', tips: 'Keep elbows close to body' },
  { id: 'ex_overhead_press', name: 'Overhead Press', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'intermediate', instructions: 'Press weights overhead', tips: 'Keep core tight' },

  // Shoulders exercises
  { id: 'ex_lateral_raises', name: 'Lateral Raises', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner', instructions: 'Raise arms out to sides', tips: 'Slight bend in elbows' },
  { id: 'ex_shoulder_press', name: 'Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'intermediate', instructions: 'Press weights up from shoulder level', tips: 'Keep core engaged' },
  { id: 'ex_rear_delt_flyes', name: 'Rear Delt Flyes', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'intermediate', instructions: 'Bend forward, raise arms out to sides', tips: 'Squeeze shoulder blades' },

  // Core exercises
  { id: 'ex_planks', name: 'Planks', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Hold straight body position', tips: 'Keep hips level, breathe normally' },
  { id: 'ex_crunches', name: 'Crunches', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Lift shoulders off ground', tips: 'Focus on abs, not neck' },
  { id: 'ex_russian_twists', name: 'Russian Twists', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'intermediate', instructions: 'Sit up, rotate torso side to side', tips: 'Keep feet off ground for more challenge' }
]

export default function BodyMap({ userProfile }: BodyMapProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null)
  const [showExercises, setShowExercises] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const isFemaleFigure = userProfile?.gender === 'female'

  const handleMuscleGroupClick = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup)
    setShowExercises(true)
  }

  const getExercisesForMuscleGroup = (muscleGroup: string) => {
    return exerciseDatabase.filter(exercise => exercise.muscleGroup === muscleGroup)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case 'bodyweight': return '🏃'
      case 'dumbbells': return '🏋️'
      case 'barbell': return '🏋️‍♀️'
      case 'machine': return '⚙️'
      default: return '💪'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Map className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Interactive 3D Body Map</h2>
        <p className="text-gray-600">
          Click on any muscle group to see targeted exercises and AI-powered recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Body Map Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {isFemaleFigure ? 'Female' : 'Male'} Body Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto max-w-md">
              {/* SVG Body Figure */}
              <svg
                viewBox="0 0 300 500"
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
              >
                {/* Head */}
                <circle
                  cx="150"
                  cy="50"
                  r="30"
                  fill="#FEF3C7"
                  stroke="#D97706"
                  strokeWidth="2"
                />
                
                {/* Torso */}
                <rect
                  x="120"
                  y="80"
                  width="60"
                  height="120"
                  rx="10"
                  fill="#FEF3C7"
                  stroke="#D97706"
                  strokeWidth="2"
                />

                {/* Chest - Clickable */}
                <rect
                  x="125"
                  y="90"
                  width="50"
                  height="40"
                  rx="5"
                  fill={selectedMuscleGroup === 'chest' ? muscleGroups.chest.color : '#FCA5A5'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('chest')}
                />
                <text x="150" y="115" textAnchor="middle" className="text-xs font-medium fill-white">
                  Chest
                </text>

                {/* Core - Clickable */}
                <rect
                  x="130"
                  y="140"
                  width="40"
                  height="50"
                  rx="5"
                  fill={selectedMuscleGroup === 'core' ? muscleGroups.core.color : '#FDE047'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('core')}
                />
                <text x="150" y="170" textAnchor="middle" className="text-xs font-medium fill-gray-800">
                  Core
                </text>

                {/* Shoulders - Clickable */}
                <circle
                  cx="105"
                  cy="100"
                  r="15"
                  fill={selectedMuscleGroup === 'shoulders' ? muscleGroups.shoulders.color : '#FB923C'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('shoulders')}
                />
                <circle
                  cx="195"
                  cy="100"
                  r="15"
                  fill={selectedMuscleGroup === 'shoulders' ? muscleGroups.shoulders.color : '#FB923C'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('shoulders')}
                />

                {/* Arms - Clickable */}
                <rect
                  x="85"
                  y="115"
                  width="15"
                  height="60"
                  rx="7"
                  fill={selectedMuscleGroup === 'arms' ? muscleGroups.arms.color : '#C084FC'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('arms')}
                />
                <rect
                  x="200"
                  y="115"
                  width="15"
                  height="60"
                  rx="7"
                  fill={selectedMuscleGroup === 'arms' ? muscleGroups.arms.color : '#C084FC'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('arms')}
                />

                {/* Back (shown as outline behind torso) */}
                <rect
                  x="122"
                  y="82"
                  width="56"
                  height="80"
                  rx="8"
                  fill="none"
                  stroke={selectedMuscleGroup === 'back' ? muscleGroups.back.color : '#60A5FA'}
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('back')}
                />
                <text x="150" y="125" textAnchor="middle" className="text-xs font-medium fill-blue-600">
                  Back
                </text>

                {/* Legs - Clickable */}
                <rect
                  x="130"
                  y="210"
                  width="18"
                  height="80"
                  rx="9"
                  fill={selectedMuscleGroup === 'legs' ? muscleGroups.legs.color : '#4ADE80'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('legs')}
                />
                <rect
                  x="152"
                  y="210"
                  width="18"
                  height="80"
                  rx="9"
                  fill={selectedMuscleGroup === 'legs' ? muscleGroups.legs.color : '#4ADE80'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('legs')}
                />

                {/* Glutes - Clickable */}
                <ellipse
                  cx="150"
                  cy="205"
                  rx="25"
                  ry="15"
                  fill={selectedMuscleGroup === 'glutes' ? muscleGroups.glutes.color : '#F472B6'}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => handleMuscleGroupClick('glutes')}
                />
                <text x="150" y="210" textAnchor="middle" className="text-xs font-medium fill-white">
                  Glutes
                </text>

                {/* Lower legs */}
                <rect x="132" y="290" width="14" height="60" rx="7" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <rect x="154" y="290" width="14" height="60" rx="7" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />

                {/* Feet */}
                <ellipse cx="139" cy="365" rx="12" ry="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <ellipse cx="161" cy="365" rx="12" ry="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
              </svg>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(muscleGroups).map(([key, group]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="text-gray-700">{group.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Muscle Group Info */}
        <Card>
          <CardHeader>
            <CardTitle>Muscle Group Info</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMuscleGroup ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].color }}
                  />
                  <h3 className="text-lg font-semibold">
                    {muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600">
                  {getExercisesForMuscleGroup(selectedMuscleGroup).length} exercises available
                </p>

                <Button 
                  onClick={() => setShowExercises(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Dumbbell className="h-4 w-4 mr-2" />
                  View Exercises
                </Button>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• Start with 3 sets of 8-12 reps</p>
                    <p>• Rest 60-90 seconds between sets</p>
                    <p>• Focus on proper form over weight</p>
                    {userProfile?.gender === 'female' && (
                      <p>• Adjust intensity based on cycle phase</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on a muscle group to see exercises and recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exercise List Dialog */}
      <Dialog open={showExercises} onOpenChange={setShowExercises}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div
                className="w-6 h-6 rounded mr-3"
                style={{ backgroundColor: selectedMuscleGroup ? muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].color : '#gray' }}
              />
              {selectedMuscleGroup && muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].name} Exercises
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedMuscleGroup && getExercisesForMuscleGroup(selectedMuscleGroup).map((exercise) => (
              <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <span className="text-lg">{getEquipmentIcon(exercise.equipment)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {exercise.equipment}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {exercise.instructions}
                  </p>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add to Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <span className="text-2xl mr-3">{getEquipmentIcon(selectedExercise.equipment)}</span>
                  {selectedExercise.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                    {selectedExercise.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {selectedExercise.equipment}
                  </Badge>
                  <Badge variant="outline">
                    {selectedExercise.muscleGroup}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Instructions
                  </h4>
                  <p className="text-gray-700">{selectedExercise.instructions}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Tips
                  </h4>
                  <p className="text-gray-700">{selectedExercise.tips}</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">AI Recommendations for You</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• Recommended sets: 3-4</p>
                    <p>• Recommended reps: 8-12</p>
                    <p>• Rest between sets: 60-90 seconds</p>
                    {userProfile?.activityLevel === 'beginner' && (
                      <p>• Start with bodyweight or light weights</p>
                    )}
                    {userProfile?.fitnessGoal === 'muscle_gain' && (
                      <p>• Focus on progressive overload</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                    Add to Current Workout
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save for Later
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}