import { useState, useEffect } from 'react';
import { FilterPanel } from '../components/FilterPanel';
import { MatchCard } from '../components/MatchCard';

// Mock opportunities data
const MOCK_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Community Garden Coordinator',
    organization: 'Kingston Green Initiative',
    location: 'Downtown Kingston',
    timeCommitment: '3-5 hours/week',
    skills: ['Gardening', 'Event Planning'],
    interests: ['Environment', 'Community Service'],
    hasContactEmail: true,
    hasLinkedIn: true,
    aiFlag: 'clear',
    aiReason: null,
    description: 'Help maintain our community garden and organize weekly workshops.'
  },
  {
    id: '2',
    title: 'Youth Tutor - Math & Science',
    organization: 'Kingston Learning Center',
    location: 'East End',
    timeCommitment: '2-4 hours/week',
    skills: ['Tutoring', 'Teaching'],
    interests: ['Education', 'Youth Programs'],
    hasContactEmail: true,
    hasLinkedIn: false,
    aiFlag: 'clear',
    aiReason: null,
    description: 'Support high school students with math and science homework.'
  },
  {
    id: '3',
    title: 'Senior Center Activity Leader',
    organization: 'Kingston Seniors Association',
    location: 'West End',
    timeCommitment: '4-6 hours/week',
    skills: ['Event Planning', 'Music', 'Arts'],
    interests: ['Seniors', 'Health & Wellness'],
    hasContactEmail: true,
    hasLinkedIn: true,
    aiFlag: 'needs-review',
    aiReason: 'Organization recently registered, pending additional verification.',
    description: 'Lead recreational activities and social events for seniors.'
  },
  {
    id: '4',
    title: 'Website Developer',
    organization: 'Local Nonprofit Tech Hub',
    location: 'North End',
    timeCommitment: '5-10 hours/week',
    skills: ['Technology', 'Design', 'Marketing'],
    interests: ['Community Service', 'Education'],
    hasContactEmail: true,
    hasLinkedIn: true,
    aiFlag: 'clear',
    aiReason: null,
    description: 'Help build and maintain websites for local nonprofits.'
  },
  {
    id: '5',
    title: 'Food Bank Volunteer',
    organization: 'Kingston Food Security Network',
    location: 'Downtown Kingston',
    timeCommitment: '2-3 hours/week',
    skills: ['Event Planning', 'Cooking'],
    interests: ['Food Security', 'Community Service'],
    hasContactEmail: true,
    hasLinkedIn: false,
    aiFlag: 'clear',
    aiReason: null,
    description: 'Assist with food sorting, packing, and distribution.'
  },
  {
    id: '6',
    title: 'Environmental Education Facilitator',
    organization: 'Cataraqui Conservation',
    location: 'Kingston West',
    timeCommitment: '3-5 hours/week',
    skills: ['Teaching', 'Photography'],
    interests: ['Environment', 'Education', 'Youth Programs'],
    hasContactEmail: true,
    hasLinkedIn: true,
    aiFlag: 'clear',
    aiReason: null,
    description: 'Lead nature walks and educational programs for school groups.'
  },
  {
    id: '7',
    title: 'Art Workshop Instructor',
    organization: 'Kingston Arts Council',
    location: 'Downtown Kingston',
    timeCommitment: '4-6 hours/week',
    skills: ['Design', 'Teaching', 'Photography'],
    interests: ['Arts & Culture', 'Youth Programs'],
    hasContactEmail: false,
    hasLinkedIn: true,
    aiFlag: 'needs-review',
    aiReason: 'Missing primary contact information.',
    description: 'Teach art workshops for youth and adults in the community.'
  },
  {
    id: '8',
    title: 'Mental Health Peer Support',
    organization: 'Kingston Community Health',
    location: 'East End',
    timeCommitment: '3-4 hours/week',
    skills: ['Tutoring', 'Writing'],
    interests: ['Mental Health', 'Health & Wellness'],
    hasContactEmail: true,
    hasLinkedIn: true,
    aiFlag: 'clear',
    aiReason: null,
    description: 'Provide peer support and facilitate wellness groups.'
  }
];

export function OpportunitiesFeed() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    interest: '',
    skills: '',
    timeCommitment: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to GET /opportunities
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual FastAPI endpoint
        // const response = await fetch('http://localhost:8000/opportunities');
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setOpportunities(MOCK_OPPORTUNITIES);
        setFilteredOpportunities(MOCK_OPPORTUNITIES);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOpportunities();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...opportunities];
    
    if (filters.location) {
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.interest) {
      filtered = filtered.filter(opp =>
        opp.interests.some(int => 
          int.toLowerCase().includes(filters.interest.toLowerCase())
        )
      );
    }
    
    if (filters.skills) {
      filtered = filtered.filter(opp =>
        opp.skills.some(skill => 
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }
    
    if (filters.timeCommitment) {
      filtered = filtered.filter(opp => {
        const commitment = opp.timeCommitment.toLowerCase();
        return commitment.includes(filters.timeCommitment);
      });
    }
    
    setFilteredOpportunities(filtered);
  }, [filters, opportunities]);
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  const handleClearAll = () => {
    setFilters({
      location: '',
      interest: '',
      skills: '',
      timeCommitment: ''
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Volunteer Opportunities
        </h1>
        <p className="text-gray-600">
          Discover meaningful ways to make a difference in Kingston
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>
        
        {/* Opportunities Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading opportunities...</p>
              </div>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No opportunities match your filters. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredOpportunities.length} of {opportunities.length} opportunities
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <MatchCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
