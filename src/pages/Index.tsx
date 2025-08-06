
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AlertCard from '@/components/AlertCard';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataService } from '@/services/dataService';

const Index = () => {
  const activeReports = dataService.getActiveReports();

  // Prepare map markers for all active reports
  const mapMarkers = activeReports.map(report => ({
    position: [report.lastSeenLocation.lat, report.lastSeenLocation.lng] as [number, number],
    popup: `<strong>${report.childName}</strong><br/>${report.lastSeenLocation.address}`,
    icon: 'emergency' as const
  }));

  // Center map on India
  const mapCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bharat Alert
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            India's Missing Child Alert System
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Every second counts when a child goes missing. Join our community to help bring children home safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-primary font-semibold">
                Join the Network
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Report Missing Child
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {activeReports.length}
              </div>
              <div className="text-gray-600">Active Alerts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {dataService.getSightings().filter(s => s.status === 'approved').length}
              </div>
              <div className="text-gray-600">Confirmed Sightings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-safety mb-2">
                {dataService.getSolvedReports().length}
              </div>
              <div className="text-gray-600">Children Found</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Alerts */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Active Missing Child Alerts
            </h2>
            
            {activeReports.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    No active alerts at the moment
                  </div>
                  <div className="text-sm text-gray-400">
                    We'll display missing child alerts here when they are reported
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {activeReports.map(report => (
                  <AlertCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Alert Locations
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Missing Children Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <Map 
                  center={mapCenter}
                  zoom={5}
                  markers={mapMarkers}
                  height="500px"
                />
                {activeReports.length === 0 && (
                  <div className="text-center text-gray-500 mt-4">
                    Alert locations will appear on the map
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How Bharat Alert Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <CardTitle>Report Missing Child</CardTitle>
              </CardHeader>
              <CardContent>
                Parents or guardians can quickly report a missing child with details and last known location.
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <CardTitle>Community Activation</CardTitle>
              </CardHeader>
              <CardContent>
                Alert is verified and broadcast to the community network for immediate action.
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-safety rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <CardTitle>Sightings & Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                Community members report sightings to help law enforcement locate and safely return the child.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
