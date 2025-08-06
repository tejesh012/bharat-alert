import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InteractiveMap from '@/components/InteractiveMap';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Loader2 } from 'lucide-react';

const MissingChildForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = dataService.getCurrentUser();

  const [formData, setFormData] = useState({
    childName: '',
    age: '',
    description: '',
    lastSeenLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: ''
    },
    lastSeenDate: '',
    contactInfo: ''
  });

  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please login to report a missing child.</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          lastSeenLocation: {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }
        }));
        setMapCenter([latitude, longitude]);
        setIsLoadingLocation(false);
        toast({
          title: "Location Updated",
          description: "Your current location has been set.",
        });
      },
      (error) => {
        setIsLoadingLocation(false);
        toast({
          title: "Location Error",
          description: "Unable to get your current location. Please set it manually on the map.",
          variant: "destructive"
        });
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.childName || !formData.age || !formData.description || !formData.contactInfo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const reportId = dataService.submitReport({
        childName: formData.childName,
        age: parseInt(formData.age),
        description: formData.description,
        lastSeenLocation: formData.lastSeenLocation,
        lastSeenDate: formData.lastSeenDate || new Date().toISOString(),
        contactInfo: formData.contactInfo,
        reportedBy: currentUser.id
      });

      toast({
        title: "Report Submitted",
        description: "Your missing child report has been submitted for admin review.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      lastSeenLocation: {
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
    }));
    setMapCenter([lat, lng]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Report Missing Child
          </h1>
          <p className="text-gray-600">
            Please provide detailed information about the missing child.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Missing Child Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name *</Label>
                  <Input
                    id="childName"
                    value={formData.childName}
                    onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                    placeholder="Enter child's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Age in years"
                    min="0"
                    max="18"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Physical description, clothing, distinctive features..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastSeenDate">Last Seen Date & Time</Label>
                <Input
                  id="lastSeenDate"
                  type="datetime-local"
                  value={formData.lastSeenDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastSeenDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information *</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                  placeholder="Phone number or email for contact"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Last Seen Location *</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={formData.lastSeenLocation.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lastSeenLocation: { ...prev.lastSeenLocation, address: e.target.value }
                      }))}
                      placeholder="Enter address or click on map"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                      className="shrink-0"
                    >
                      {isLoadingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {isLoadingLocation ? 'Getting...' : 'Use My Location'}
                    </Button>
                  </div>
                  <div className="h-64">
                    <InteractiveMap
                      center={mapCenter}
                      zoom={13}
                      markers={[{
                        position: [formData.lastSeenLocation.lat, formData.lastSeenLocation.lng],
                        popup: 'Last seen location'
                      }]}
                      height="256px"
                      onMapClick={handleMapClick}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Click on the map to set the last seen location or use "Use My Location" button
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-primary">
                  Submit Report
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissingChildForm;
