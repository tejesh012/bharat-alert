
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

const SightingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = dataService.getCurrentUser();
  
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!id) {
    navigate('/');
    return null;
  }

  const report = dataService.getReportById(id);
  const canReportSighting = dataService.canUserReportSighting(currentUser.id);

  if (!report) {
    navigate('/');
    return null;
  }

  if (!canReportSighting) {
    toast({
      title: "Sighting Limit Reached",
      description: "You have already reported the maximum number of sightings (2).",
      variant: "destructive",
    });
    navigate(`/report/${id}`);
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock geocoding - in real app, use Google Maps API
      const mockLat = 28.6139 + (Math.random() - 0.5) * 0.1;
      const mockLng = 77.2090 + (Math.random() - 0.5) * 0.1;

      const sightingData = {
        reportId: id,
        reportedBy: currentUser.id,
        location: {
          lat: mockLat,
          lng: mockLng,
          address: formData.location
        },
        description: formData.description,
        timestamp: formData.timestamp
      };

      const sightingId = dataService.submitSighting(sightingData);
      
      toast({
        title: "Sighting Reported",
        description: "Your sighting has been submitted and is pending admin review.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit sighting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Report Sighting: {report.childName}
              </CardTitle>
              <p className="text-gray-600">
                Provide details about where and when you saw this missing child.
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Child Info Summary */}
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium mb-2">Missing Child Information</h3>
                <p><strong>Name:</strong> {report.childName}</p>
                <p><strong>Age:</strong> {report.age} years</p>
                <p><strong>Description:</strong> {report.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="timestamp">When did you see the child?</Label>
                  <Input
                    id="timestamp"
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => handleChange('timestamp', e.target.value)}
                    required
                    max={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Where did you see the child?</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                    placeholder="e.g., Near Central Mall, MG Road, Bangalore"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please be as specific as possible with the location
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Describe what you saw</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    required
                    placeholder="Describe the child's appearance, clothing, behavior, who they were with, etc."
                    rows={4}
                  />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Only report if you are confident about the sighting</li>
                    <li>• Provide accurate location and time information</li>
                    <li>• Your report will be reviewed by administrators</li>
                    <li>• False reports may result in account suspension</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Sighting'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/report/${id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SightingForm;
