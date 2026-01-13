import { Card, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Mail, Linkedin, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export function MatchCard({ opportunity, matchLevel, explanation }) {
  const getMatchBadgeVariant = (level) => {
    switch (level) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        {/* Match Level Badge */}
        {matchLevel && (
          <div className="mb-4">
            <Badge variant={getMatchBadgeVariant(matchLevel)}>
              {matchLevel.toUpperCase()} MATCH
            </Badge>
          </div>
        )}
        
        {/* Title and Organization */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {opportunity.title}
        </h3>
        <p className="text-gray-600 mb-4">{opportunity.organization}</p>
        
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {opportunity.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {opportunity.timeCommitment}
          </div>
        </div>
        
        {/* Skills */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.skills.map((skill, index) => (
              <Badge key={index} variant="primary">{skill}</Badge>
            ))}
          </div>
        </div>
        
        {/* AI Explanation */}
        {explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">AI Match Explanation:</span>
              <br />
              {explanation}
            </p>
          </div>
        )}
        
        {/* Trust Indicators */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {opportunity.hasContactEmail && (
              <div className="flex items-center text-green-600" title="Contact email verified">
                <Mail className="h-4 w-4 mr-1" />
                <span className="text-xs">Email</span>
              </div>
            )}
            {opportunity.hasLinkedIn && (
              <div className="flex items-center text-blue-600" title="LinkedIn profile provided">
                <Linkedin className="h-4 w-4 mr-1" />
                <span className="text-xs">LinkedIn</span>
              </div>
            )}
          </div>
          
          <div className="ml-auto">
            {opportunity.aiFlag === 'clear' ? (
              <Badge variant="success">
                <CheckCircle className="h-3 w-3 mr-1 inline" />
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" className="cursor-help" title={opportunity.aiReason}>
                <AlertTriangle className="h-3 w-3 mr-1 inline" />
                Needs Review
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Learn More
        </button>
      </CardFooter>
    </Card>
  );
}
