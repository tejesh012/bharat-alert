
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissingChildReport, dataService } from '@/services/dataService';

interface AlertCardProps {
  report: MissingChildReport;
  showActions?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({ report, showActions = true }) => {
  const currentUser = dataService.getCurrentUser();
  const canReportSighting = currentUser && dataService.canUserReportSighting(currentUser.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSinceReport = (dateString: string) => {
    const now = new Date();
    const reportDate = new Date(dateString);
    const hoursDiff = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60));
    
    if (hoursDiff < 1) return 'Less than an hour ago';
    if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
    const daysDiff = Math.floor(hoursDiff / 24);
    return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-emergency">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {report.childName}
          </CardTitle>
          <Badge variant="destructive" className="animate-alert-pulse">
            MISSING
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Age: {report.age} years • Last seen: {getTimeSinceReport(report.lastSeenDate)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Description</h4>
          <p className="text-sm text-gray-600">{report.description}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Last Seen Location</h4>
          <p className="text-sm text-gray-600">{report.lastSeenLocation.address}</p>
          <p className="text-xs text-gray-500">
            {formatDate(report.lastSeenDate)}
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Contact Information</h4>
          <p className="text-sm text-gray-600">{report.contactInfo}</p>
        </div>
        
        {showActions && (
          <div className="flex space-x-2 pt-3 border-t">
            <Link to={`/report/${report.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            
            {currentUser ? (
              <Link to={`/sighting/${report.id}`} className="flex-1">
                <Button 
                  className="w-full"
                  disabled={!canReportSighting}
                >
                  {canReportSighting ? 'Report Sighting' : 'Max Sightings Reached'}
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="flex-1">
                <Button className="w-full">
                  Report Sighting
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertCard;
