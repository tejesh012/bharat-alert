import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const currentUser = dataService.getCurrentUser();
  const { toast } = useToast();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Admin access required.</p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pendingReports = dataService.getPendingReports();
  const activeReports = dataService.getActiveReports();
  const solvedReports = dataService.getSolvedReports();
  const allSightings = dataService.getSightings();
  const pendingSightings = allSightings.filter(s => s.status === 'pending');
  const allUsers = dataService.getAllUsers();
  const bannedUsers = dataService.getBannedUsers();

  const handleApproveReport = (reportId: string) => {
    if (dataService.approveReport(reportId)) {
      toast({
        title: "Report Approved",
        description: "The missing child report has been approved and is now active.",
      });
      window.location.reload();
    }
  };

  const handleRejectReport = (reportId: string) => {
    if (dataService.rejectReport(reportId)) {
      toast({
        title: "Report Rejected",
        description: "The missing child report has been rejected.",
      });
      window.location.reload();
    }
  };

  const handleMarkSolved = (reportId: string) => {
    if (dataService.markReportSolved(reportId)) {
      toast({
        title: "Report Marked as Solved",
        description: "The missing child has been found! Report moved to solved cases.",
      });
      window.location.reload();
    }
  };

  const handleApproveSighting = (sightingId: string) => {
    if (dataService.approveSighting(sightingId)) {
      toast({
        title: "Sighting Approved",
        description: "The sighting has been approved and the user's count updated.",
      });
      window.location.reload();
    }
  };

  const handleRejectSighting = (sightingId: string) => {
    if (dataService.rejectSighting(sightingId)) {
      toast({
        title: "Sighting Rejected",
        description: "The sighting has been rejected and removed.",
      });
      window.location.reload();
    }
  };

  const handleBanUser = (userId: string) => {
    if (dataService.banUser(userId)) {
      toast({
        title: "User Banned",
        description: "The user has been banned from the system.",
      });
      window.location.reload();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage missing child reports, sightings, and users.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingReports.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emergency">
                {activeReports.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Sightings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingSightings.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allUsers.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Admin Actions */}
        <div className="mb-6">
          <Link to="/report/new">
            <Button className="bg-emergency">
              Create New Missing Child Report
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending-reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending-reports">Pending Reports</TabsTrigger>
            <TabsTrigger value="active-reports">Active Reports</TabsTrigger>
            <TabsTrigger value="pending-sightings">Pending Sightings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-reports">
            <div>
              <h2 className="text-2xl font-bold mb-6">Pending Missing Child Reports</h2>
              {pendingReports.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-gray-500">No pending reports</div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingReports.map(report => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{report.childName} (Age: {report.age})</CardTitle>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p><strong>Description:</strong> {report.description}</p>
                        <p><strong>Last Seen:</strong> {report.lastSeenLocation.address}</p>
                        <p><strong>Contact:</strong> {report.contactInfo}</p>
                        <p><strong>Reported:</strong> {formatDate(report.createdAt)}</p>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleApproveReport(report.id)}
                            className="bg-safety"
                          >
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleRejectReport(report.id)}
                            variant="destructive"
                          >
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active-reports">
            <div>
              <h2 className="text-2xl font-bold mb-6">Active Missing Child Reports</h2>
              {activeReports.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-gray-500">No active reports</div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeReports.map(report => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{report.childName} (Age: {report.age})</CardTitle>
                          <Badge className="bg-emergency">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p><strong>Description:</strong> {report.description}</p>
                        <p><strong>Last Seen:</strong> {report.lastSeenLocation.address}</p>
                        <p><strong>Contact:</strong> {report.contactInfo}</p>
                        <p><strong>Approved:</strong> {report.approvedAt ? formatDate(report.approvedAt) : 'N/A'}</p>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleMarkSolved(report.id)}
                            className="bg-safety"
                          >
                            Mark as Solved
                          </Button>
                          <Link to={`/report/${report.id}`}>
                            <Button variant="outline">View Details</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending-sightings">
            <div>
              <h2 className="text-2xl font-bold mb-6">Pending Sightings</h2>
              {pendingSightings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-gray-500">No pending sightings</div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingSightings.map(sighting => {
                    const report = dataService.getReportById(sighting.reportId);
                    const user = allUsers.find(u => u.id === sighting.reportedBy);
                    return (
                      <Card key={sighting.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>Sighting for {report?.childName || 'Unknown'}</CardTitle>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p><strong>Reported by:</strong> {user?.name || 'Unknown'}</p>
                          <p><strong>Location:</strong> {sighting.location.address}</p>
                          <p><strong>Description:</strong> {sighting.description}</p>
                          <p><strong>Time:</strong> {formatDate(sighting.timestamp)}</p>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleApproveSighting(sighting.id)}
                              className="bg-safety"
                            >
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleRejectSighting(sighting.id)}
                              variant="destructive"
                            >
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div>
              <h2 className="text-2xl font-bold mb-6">User Management</h2>
              <div className="space-y-4">
                {allUsers.map(user => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{user.name}</CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                            {user.role}
                          </Badge>
                          {bannedUsers.includes(user.id) && (
                            <Badge variant="destructive">Banned</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Phone:</strong> {user.phone}</p>
                      <p><strong>Sightings:</strong> {user.sightingsCount}/2</p>
                      <p><strong>Joined:</strong> {formatDate(user.createdAt)}</p>
                      {user.role !== 'admin' && !bannedUsers.includes(user.id) && (
                        <Button 
                          onClick={() => handleBanUser(user.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Ban User
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
