import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Textarea } from './ui/textarea'
import { useToast } from './hooks/use-toast'
import { User, Heart, Target, Activity } from 'lucide-react'

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

interface ProfileSetupProps {
  user: User
  userProfile: UserProfile | null
  onProfileUpdate: (profile: UserProfile) => void
}

export default function ProfileSetup({ user, userProfile, onProfileUpdate }: ProfileSetupProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    height: userProfile?.height?.toString() || '',
    weight: userProfile?.weight?.toString() || '',
    gender: userProfile?.gender || '',
    age: userProfile?.age?.toString() || '',
    fitnessGoal: userProfile?.fitnessGoal || '',
    activityLevel: userProfile?.activityLevel || '',
    workoutFrequency: userProfile?.workoutFrequency?.toString() || '',
    menstrualCycleLength: userProfile?.menstrualCycleLength?.toString() || '',
    lastPeriodDate: userProfile?.lastPeriodDate || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const updatedProfile: UserProfile = {
        id: userProfile?.id || `profile_${Date.now()}`,
        userId: user.id,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        gender: formData.gender as 'male' | 'female' | undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        fitnessGoal: formData.fitnessGoal || undefined,
        activityLevel: formData.activityLevel || undefined,
        workoutFrequency: formData.workoutFrequency ? parseInt(formData.workoutFrequency) : undefined,
        menstrualCycleLength: formData.menstrualCycleLength ? parseInt(formData.menstrualCycleLength) : undefined,
        lastPeriodDate: formData.lastPeriodDate || undefined
      }

      // In a real app, this would save to the database
      onProfileUpdate(updatedProfile)
      
      toast({
        title: "Profile Updated",
        description: "Your fitness profile has been successfully updated!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Fitness Profile</h2>
        <p className="text-gray-600">
          Help us personalize your workout experience with AI-powered recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="65.5"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>

              <div>
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Fitness Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fitnessGoal">Primary Goal</Label>
                <Select value={formData.fitnessGoal} onValueChange={(value) => handleInputChange('fitnessGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="strength">Strength Building</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activityLevel">Current Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (New to exercise)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
                    <SelectItem value="advanced">Advanced (Very experienced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workoutFrequency">Workout Frequency (per week)</Label>
                <Select value={formData.workoutFrequency} onValueChange={(value) => handleInputChange('workoutFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do you want to workout?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 times per week</SelectItem>
                    <SelectItem value="3">3 times per week</SelectItem>
                    <SelectItem value="4">4 times per week</SelectItem>
                    <SelectItem value="5">5 times per week</SelectItem>
                    <SelectItem value="6">6 times per week</SelectItem>
                    <SelectItem value="7">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Female-Specific Section */}
        {formData.gender === 'female' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-pink-600">
                <Heart className="h-5 w-5 mr-2" />
                Menstrual Cycle Information
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                This helps us optimize your workouts based on your cycle phases for better results
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
                  <Input
                    id="cycleLength"
                    type="number"
                    placeholder="28"
                    value={formData.menstrualCycleLength}
                    onChange={(e) => handleInputChange('menstrualCycleLength', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Typically 21-35 days</p>
                </div>
                <div>
                  <Label htmlFor="lastPeriod">Last Period Start Date</Label>
                  <Input
                    id="lastPeriod"
                    type="date"
                    value={formData.lastPeriodDate}
                    onChange={(e) => handleInputChange('lastPeriodDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-medium text-pink-800 mb-2">How this helps:</h4>
                <ul className="text-sm text-pink-700 space-y-1">
                  <li>• <strong>Menstrual Phase:</strong> Light exercises, yoga, walking</li>
                  <li>• <strong>Follicular Phase:</strong> Great time for strength training</li>
                  <li>• <strong>Ovulation:</strong> Peak energy - perfect for intense workouts</li>
                  <li>• <strong>Luteal Phase:</strong> Moderate intensity, focus on endurance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              AI Recommendations Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Based on your profile, our AI will recommend:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {formData.fitnessGoal === 'muscle_gain' && (
                  <li>• Strength training with progressive overload</li>
                )}
                {formData.fitnessGoal === 'weight_loss' && (
                  <li>• High-intensity interval training (HIIT)</li>
                )}
                {formData.activityLevel === 'beginner' && (
                  <li>• Bodyweight exercises to build foundation</li>
                )}
                {formData.activityLevel === 'advanced' && (
                  <li>• Complex compound movements and advanced techniques</li>
                )}
                {formData.gender === 'female' && (
                  <li>• Cycle-optimized workout intensity and timing</li>
                )}
                <li>• Personalized rep ranges and rest periods</li>
                <li>• Progressive difficulty adjustments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            Complete Profile Setup
          </Button>
        </div>
      </form>
    </div>
  )
}