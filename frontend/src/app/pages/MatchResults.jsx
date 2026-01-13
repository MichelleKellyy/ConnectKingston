import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchCard } from '../components/MatchCard';
import { Target, AlertCircle } from 'lucide-react';
import { mockUser } from '../App';

// Mock matched opportunities with AI explanations
const generateMatches = (profile) => {
  if (!profile) return [];

  const matches = [];

  // High match examples
  if (profile.interests.includes('Environment') && profile.skills.includes('Gardening')) {
    matches.push({
      id: '1',
      matchLevel: 'high',
      explanation: `This opportunity is an excellent match! Your interest in Environment and your Gardening skills align perfectly with the Community Garden Coordinator role. With your ${profile.availability} hours/week availability, you can make a significant impact on the Kingston Green Initiative.`,
      opportunity: {
        title: 'Community Garden Coordinator',
        organization: 'Kingston Green Initiative',
        location: 'Downtown Kingston',
        timeCommitment: '3-5 hours/week',
        skills: ['Gardening', 'Event Planning'],
        hasContactEmail: true,
        hasLinkedIn: true,
        aiFlag: 'clear'
      }
    });
  }

  if (profile.interests.includes('Education') && profile.skills.includes('Tutoring')) {
    matches.push({
      id: '2',
      matchLevel: 'high',
      explanation: `Perfect fit! Your Tutoring skills and passion for Education make you an ideal candidate for the Youth Tutor position. The 2-4 hours/week commitment fits well within your ${profile.availability} hours/week availability.`,
      opportunity: {
        title: 'Youth Tutor - Math & Science',
        organization: 'Kingston Learning Center',
        location: 'East End',
        timeCommitment: '2-4 hours/week',
        skills: ['Tutoring', 'Teaching'],
        hasContactEmail: true,
        hasLinkedIn: false,
        aiFlag: 'clear'
      }
    });
  }

  if (profile.interests.includes('Community Service') && profile.skills.includes('Technology')) {
    matches.push({
      id: '4',
      matchLevel: 'high',
      explanation: `Excellent match! Your Technology skills combined with your interest in Community Service align perfectly with this role. The position requires 5-10 hours/week, which aligns well with your ${profile.availability} hours/week availability. This is a great opportunity to use your tech expertise for social good.`,
      opportunity: {
        title: 'Website Developer',
        organization: 'Local Nonprofit Tech Hub',
        location: 'North End',
        timeCommitment: '5-10 hours/week',
        skills: ['Technology', 'Design', 'Marketing'],
        hasContactEmail: true,
        hasLinkedIn: true,
        aiFlag: 'clear'
      }
    });
  }

  // Medium match examples
  if (profile.interests.includes('Community Service')) {
    matches.push({
      id: '5',
      matchLevel: 'medium',
      explanation: `Good match based on your Community Service interest. While the role doesn't require your specific skills, your passion for helping others and your ${profile.availability} hours/week availability make this a viable opportunity. The 2-3 hours/week commitment leaves room for other activities.`,
      opportunity: {
        title: 'Food Bank Volunteer',
        organization: 'Kingston Food Security Network',
        location: 'Downtown Kingston',
        timeCommitment: '2-3 hours/week',
        skills: ['Event Planning', 'Cooking'],
        hasContactEmail: true,
        hasLinkedIn: false,
        aiFlag: 'clear'
      }
    });
  }

  if (profile.interests.includes('Environment') && profile.skills.includes('Teaching')) {
    matches.push({
      id: '6',
      matchLevel: 'medium',
      explanation: `This is a solid match! Your Teaching skills and Environment interest align with the Educational Facilitator role. With your ${profile.availability} hours/week availability, the 3-5 hours/week commitment is manageable. This role combines education with environmental advocacy.`,
      opportunity: {
        title: 'Environmental Education Facilitator',
        organization: 'Cataraqui Conservation',
        location: 'Kingston West',
        timeCommitment: '3-5 hours/week',
        skills: ['Teaching', 'Photography'],
        hasContactEmail: true,
        hasLinkedIn: true,
        aiFlag: 'clear'
      }
    });
  }

  if (profile.interests.includes('Health & Wellness')) {
    matches.push({
      id: '8',
      matchLevel: 'medium',
      explanation: `This opportunity matches your Health & Wellness interest. While it doesn't directly use your listed skills, your background and ${profile.availability} hours/week availability make you a good candidate. The peer support role requires empathy and good communication, which are transferable skills.`,
      opportunity: {
        title: 'Mental Health Peer Support',
        organization: 'Kingston Community Health',
        location: 'East End',
        timeCommitment: '3-4 hours/week',
        skills: ['Tutoring', 'Writing'],
        hasContactEmail: true,
        hasLinkedIn: true,
        aiFlag: 'clear'
      }
    });
  }

  // Ensure we have at least a few matches
  if (matches.length === 0) {
    matches.push({
      id: '5',
      matchLevel: 'medium',
      explanation: `Based on your profile, this is a potential match. The Food Bank Volunteer position welcomes people from all backgrounds and skill levels. Your ${profile.availability} hours/week availability works well with the flexible 2-3 hours/week commitment.`,
      opportunity: {
        title: 'Food Bank Volunteer',
        organization: 'Kingston Food Security Network',
        location: 'Downtown Kingston',
        timeCommitment: '2-3 hours/week',
        skills: ['Event Planning', 'Cooking'],
        hasContactEmail: true,
        hasLinkedIn: false,
        aiFlag: 'clear'
      }
    });
  }

  return matches;
};

export function MatchResults() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);

      try {
        // Get profile from localStorage
        const savedProfile = localStorage.getItem('volunteerProfile');

        if (!savedProfile) {
          setHasProfile(false);
          setIsLoading(false);
          return;
        }

        const profile = JSON.parse(savedProfile);
        setHasProfile(true);

        // Prepare payload for FastAPI
        const payload = {
          user_id: mockUser.id,
          profile: {
            neighborhood: profile.neighborhood,
            skills: profile.skills,
            interests: profile.interests,
            availability: parseInt(profile.availability) || 0
          }
        };

        // Mock API call - replace with actual FastAPI endpoint
        // const response = await fetch('http://localhost:8000/match', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });
        // const data = await response.json();

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const generatedMatches = generateMatches(profile);
        setMatches(generatedMatches);

        console.log('Match request:', payload);
        console.log('Matches generated:', generatedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (!hasProfile && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Profile First
          </h2>
          <p className="text-gray-700 mb-6">
            To see personalized volunteer matches with AI-powered recommendations,
            you need to complete your volunteer profile.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Your Personalized Matches
          </h1>
        </div>
        <p className="text-gray-600">
          These opportunities are matched to your skills, interests, and availability using AI
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            No matches found at this time. Try updating your profile to see more opportunities.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              <strong>Great news!</strong> We found {matches.length} personalized {matches.length === 1 ? 'match' : 'matches'} for you based on your profile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                opportunity={match.opportunity}
                matchLevel={match.matchLevel}
                explanation={match.explanation}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Want to see all available opportunities?
            </p>
            <button
              onClick={() => navigate('/opportunities')}
              className="bg-white text-blue-600 border-2 border-blue-600 py-2 px-6 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              Browse All Opportunities
            </button>
          </div>
        </>
      )}
    </div>
  );
}
