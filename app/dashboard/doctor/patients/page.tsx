'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Fetch appointments to get unique patients
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        const uniquePatients = Array.from(
          new Map(
            data.data.map((apt: any) => [apt.patientId._id, apt.patientId])
          ).values()
        ) as Patient[];
        setPatients(uniquePatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
        <p className="text-muted-foreground mt-2">Manage your patient relationships</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patients List</CardTitle>
              <CardDescription>All patients you've consulted with</CardDescription>
            </div>
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredPatients.length === 0 ? (
            <p className="text-muted-foreground">No patients found</p>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map(patient => (
                <div
                  key={patient._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                    {patient.phone && (
                      <p className="text-sm text-muted-foreground">{patient.phone}</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    View History
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
