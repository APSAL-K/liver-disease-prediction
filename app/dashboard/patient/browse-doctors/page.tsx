'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, MapPin, Award } from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  qualifications: string[];
  averageRating: number;
  totalReviews: number;
  yearsExperience: number;
  bio: string;
  clinic: {
    name: string;
    location: string;
  };
}

export default function BrowseDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (specialty) params.append('specialty', specialty);
      if (minRating) params.append('minRating', minRating);

      const response = await fetch(`/api/doctors?${params}`);
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchDoctors();
  };

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to appointment booking page
    window.location.href = `/dashboard/patient/book-appointment?doctorId=${doctorId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Find a Doctor</h1>
        <p className="text-muted-foreground mt-2">Browse and connect with our verified healthcare professionals</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Specialty</label>
              <Input
                placeholder="e.g., Hepatology"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <Input
                type="number"
                placeholder="e.g., 4.0"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFilter} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm">{doctor.averageRating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{doctor.bio}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{doctor.yearsExperience} years experience</span>
                  </div>
                  {doctor.clinic && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{doctor.clinic.name}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  {doctor.totalReviews} reviews
                </div>

                <Button
                  onClick={() => handleBookAppointment(doctor._id)}
                  className="w-full"
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
