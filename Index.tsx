// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarcodeScanner from '@/components/BarcodeScanner';
import MemberRegistration from '@/components/MemberRegistration';
import AttendanceHistory from '@/components/AttendanceHistory';
import MemberManagement from '@/components/MemberManagement';
import { Users, BookOpen, History, UserPlus } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("scan");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Library Attendance System</h1>
          </div>
          <p className="text-gray-600 text-lg">Scan barcodes to track library attendance</p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Scan Attendance
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Register Member
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan">
              <BarcodeScanner />
            </TabsContent>

            <TabsContent value="register">
              <MemberRegistration />
            </TabsContent>

            <TabsContent value="history">
              <AttendanceHistory />
            </TabsContent>

            <TabsContent value="members">
              <MemberManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;