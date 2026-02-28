'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function DoctorProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    bio: '',
    qualifications: '',
    clinicName: '',
    clinicLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialty: formData.specialty,
          bio: formData.bio,
          qualifications: [formData.qualifications],
          clinic: {
            name: formData.clinicName,
            location: formData.clinicLocation,
          },
        }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Profile updated successfully' });
      } else {
        toast({ title: 'Error', description: 'Failed to update profile' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Doctor Profile</h1>
        <p className="text-muted-foreground mt-2">Update your professional information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Specialty</label>
              <Input
                name="specialty"
                placeholder="e.g., Hepatology"
                value={formData.specialty}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                name="bio"
                placeholder="Your professional background..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Qualifications</label>
              <Input
                name="qualifications"
                placeholder="e.g., MD, Board Certified"
                value={formData.qualifications}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Clinic Name</label>
              <Input
                name="clinicName"
                placeholder="Your clinic name"
                value={formData.clinicName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Clinic Location</label>
              <Input
                name="clinicLocation"
                placeholder="City, Country"
                value={formData.clinicLocation}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
