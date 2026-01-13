import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { X, Save } from 'lucide-react';
import { mockUser } from '../App';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const NEIGHBORHOODS = [
  'Downtown Kingston',
  'West End',
  'East End',
  'North End',
  'Kingston West',
  'Other'
];

const SKILLS_OPTIONS = [
  'Teaching',
  'Technology',
  'Gardening',
  'Cooking',
  'Tutoring',
  'Event Planning',
  'Marketing',
  'Design',
  'Writing',
  'Photography',
  'Music',
  'Sports Coaching'
];

const INTERESTS_OPTIONS = [
  'Education',
  'Environment',
  'Health & Wellness',
  'Community Service',
  'Arts & Culture',
  'Seniors',
  'Youth Programs',
  'Animal Welfare',
  'Food Security',
  'Mental Health'
];

export function ProfileSetup() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('volunteerProfile');
    return saved ? JSON.parse(saved) : {
      neighborhood: '',
      skills: [],
      interests: [],
      availability: ''
    };
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  
  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
      setSkillInput('');
    }
  };
  
  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const addInterest = (interest) => {
    if (interest && !profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: [...profile.interests, interest] });
      setInterestInput('');
    }
  };
  
  const removeInterest = (interestToRemove) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare payload for FastAPI
    const payload = {
      user_id: mockUser.id,
      neighborhood: profile.neighborhood,
      skills: profile.skills,
      interests: profile.interests,
      availability: parseInt(profile.availability) || 0
    };
    
    try {
      // Mock API call - replace with actual FastAPI endpoint
      // await fetch('http://localhost:8000/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
      // Save to local storage for demo
      localStorage.setItem('volunteerProfile', JSON.stringify(profile));
      
      console.log('Profile saved:', payload);
      toast.success('Profile saved successfully!');
      
      // Navigate to opportunities after a short delay
      setTimeout(() => {
        navigate('/opportunities');
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Profile Setup</h1>
          <p className="text-gray-600 mt-2">
            Tell us about yourself to help us match you with the best volunteer opportunities
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Neighborhood */}
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhood / Location
              </label>
              <select
                id="neighborhood"
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your neighborhood</option>
                {NEIGHBORHOODS.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a skill to add</option>
                  {SKILLS_OPTIONS.filter(s => !profile.skills.includes(s)).map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {profile.skills.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No skills added yet</p>
              )}
            </div>
            
            {/* Interests */}
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                Interests / Causes
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  id="interests"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an interest to add</option>
                  {INTERESTS_OPTIONS.filter(i => !profile.interests.includes(i)).map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addInterest(interestInput)}
                  disabled={!interestInput}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant="info">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 hover:bg-cyan-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {profile.interests.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No interests added yet</p>
              )}
            </div>
            
            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                Availability (hours per week)
              </label>
              <input
                type="number"
                id="availability"
                min="1"
                max="40"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                How many hours per week can you commit to volunteering?
              </p>
            </div>
            
            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="h-5 w-5" />
                Save Profile
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
