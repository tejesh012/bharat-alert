
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dataService } from '@/services/dataService';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = dataService.getCurrentUser();
  
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const report = dataService.getReportById(id);
  const sightings = dataService.getSightingsByReport(id);
  const approvedSightings = sightings.filter(s => s.status === 'approved');
  const canReportSighting = currentUser && dataService.canUserReportSighting(currentUser.id);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Prepare map markers
  const mapMarkers = [
    {
      position: [report.lastSeenLocation.lat, report.lastSeenLocation.lng] as [number, number],
      popup: `<strong>Last Seen Location</strong><br/>${report.lastSeenLocation.address}`,
      icon: 'emergency' as const
    },
    ...approvedSightings.map(sighting => ({
      position: [sighting.location.lat, sighting.location.lng] as [number, number],
      popup: `<strong>Sighting</strong><br/>${sighting.location.address}<br/>${formatDate(sighting.timestamp)}`,
      icon: 'sighting' as const
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Details */}
          <div className="space-y-6">
            <Card className="border-l-4 border-l-emergency">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{report.childName}</CardTitle>
                  <Badge variant="destructive" className="animate-alert-pulse">
                    MISSING
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Age</h4>
                    <p className="text-gray-600">{report.age} years old</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Status</h4>
                    <p className="text-gray-600 capitalize">{report.status}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{report.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Last Seen Location</h4>
                  <p className="text-gray-600">{report.lastSeenLocation.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(report.lastSeenDate)}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <p className="text-gray-600">{report.contactInfo}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Report Details</h4>
                  <p className="text-sm text-gray-500">
                    Reported: {formatDate(report.createdAt)}
                  </p>
                  {report.approvedAt && (
                    <p className="text-sm text-gray-500">
                      Approved: {formatDate(report.approvedAt)}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                {report.status === 'active' && (
                  <div className="pt-4 border-t">
                    {currentUser ? (
                      <Link to={`/sighting/${report.id}`}>
                        <Button 
                          className="w-full"
                          disabled={!canReportSighting}
                        >
                          {canReportSighting ? 'Report Sighting' : 'Max Sightings Reached'}
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <Button className="w-full">
                          Login to Report Sighting
                        </Button>
                      </Link>
                    )}
                    {!canReportSighting && currentUser && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        You have reached the maximum of 2 sightings per user.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sightings */}
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Sightings ({approvedSightings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedSightings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No confirmed sightings yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {approvedSightings.map(sighting => (
                      <div key={sighting.id} className="border-l-4 border-l-yellow-500 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Sighting Report</h5>
                          <Badge className="bg-safety">Confirmed</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Location:</strong> {sighting.location.address}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Time:</strong> {formatDate(sighting.timestamp)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Description:</strong> {sighting.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <Map 
                  center={[report.lastSeenLocation.lat, report.lastSeenLocation.lng]}
                  zoom={13}
                  markers={mapMarkers}
                  height="600px"
                />
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-emergency rounded-full"></div>
                    <span>Last seen location</span>
                  </div>
                  {approvedSightings.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Confirmed sightings</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline">
              Back to All Alerts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
