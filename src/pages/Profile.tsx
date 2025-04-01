
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            Manage your account information
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 rounded-full bg-primary mx-auto flex items-center justify-center text-white text-4xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Change Picture
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="font-medium">{user.name}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Email Address</div>
                  <div className="font-medium">{user.email}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Account Type</div>
                  <div className="font-medium capitalize">{user.role}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Edit Profile</Button>
                  <Button variant="outline" className="text-destructive border-destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
