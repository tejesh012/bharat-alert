import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataService } from '@/services/dataService';

const Dashboard: React.FC = () => {
  const currentUser = dataService.getCurrentUser();
  const activeReports = dataService.getActiveReports();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please login to access the dashboard.</p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {currentUser.name}! Here's your activity overview.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Report Missing Child
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Submit a report for a missing child
                </p>
                <Link to="/report/new">
                  <Button className="w-full bg-emergency">
                    Report Missing Child
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sightings Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {currentUser.sightingsCount}/2
              </div>
              <div className="text-sm text-gray-500">
                Reports submitted
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emergency">
                {activeReports.length}
              </div>
              <div className="text-sm text-gray-500">
                Cases ongoing
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Missing Child Reports */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Active Missing Child Reports</h2>
          {activeReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-500">No active reports</div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeReports.map(report => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle>{report.childName} (Age: {report.age})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Description:</strong> {report.description}</p>
                    <p><strong>Last Seen:</strong> {report.lastSeenLocation.address}</p>
                    <Link to={`/report/${report.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
