import { X } from 'lucide-react';

export function FilterPanel({ filters, onFilterChange, onClearAll }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            <option value="downtown">Downtown Kingston</option>
            <option value="west-end">West End</option>
            <option value="east-end">East End</option>
            <option value="north-end">North End</option>
          </select>
        </div>
        
        {/* Interest Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cause / Interest
          </label>
          <select
            value={filters.interest || ''}
            onChange={(e) => onFilterChange('interest', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Causes</option>
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="health">Health & Wellness</option>
            <option value="community">Community Service</option>
            <option value="arts">Arts & Culture</option>
            <option value="seniors">Seniors</option>
            <option value="youth">Youth Programs</option>
          </select>
        </div>
        
        {/* Skills Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          <select
            value={filters.skills || ''}
            onChange={(e) => onFilterChange('skills', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Skills</option>
            <option value="teaching">Teaching</option>
            <option value="technology">Technology</option>
            <option value="gardening">Gardening</option>
            <option value="cooking">Cooking</option>
            <option value="tutoring">Tutoring</option>
            <option value="event-planning">Event Planning</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        
        {/* Time Commitment Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Commitment
          </label>
          <select
            value={filters.timeCommitment || ''}
            onChange={(e) => onFilterChange('timeCommitment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Time Commitment</option>
            <option value="1-2">1-2 hours/week</option>
            <option value="3-5">3-5 hours/week</option>
            <option value="6-10">6-10 hours/week</option>
            <option value="10+">10+ hours/week</option>
          </select>
        </div>
        
        {/* Active Filters */}
        {Object.values(filters).some(val => val) && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Active filters:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                  >
                    {value}
                    <button
                      onClick={() => onFilterChange(key, '')}
                      className="hover:bg-blue-200 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
