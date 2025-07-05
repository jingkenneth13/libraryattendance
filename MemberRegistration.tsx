
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  registrationDate: string;
}

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    membershipType: ''
  });
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);

  const generateMemberId = () => {
    return 'LIB' + Date.now().toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.membershipType) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMember: Member = {
      id: generateMemberId(),
      name: formData.name,
      email: formData.email,
      membershipType: formData.membershipType,
      registrationDate: new Date().toISOString()
    };

    // Save to localStorage
    const existingMembers = JSON.parse(localStorage.getItem('library_members') || '[]');
    existingMembers.push(newMember);
    localStorage.setItem('library_members', JSON.stringify(existingMembers));

    setRegisteredMember(newMember);
    setFormData({ name: '', email: '', membershipType: '' });
    toast.success('Member registered successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateBarcode = (memberId: string) => {
    // In a real application, you would generate an actual barcode image
    // For this demo, we'll create a simple barcode representation
    return `|||| | || ||| | |||| | ||| |||| | || |||`;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter member's full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="membershipType">Membership Type</Label>
              <Select value={formData.membershipType} onValueChange={(value) => handleInputChange('membershipType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select membership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                  <SelectItem value="premium">Premium Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Member
            </Button>
          </form>
        </CardContent>
      </Card>

      {registeredMember && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Registration Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                Member has been successfully registered with ID: <strong>{registeredMember.id}</strong>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Member Details:</h3>
              <p><strong>Name:</strong> {registeredMember.name}</p>
              <p><strong>Email:</strong> {registeredMember.email}</p>
              <p><strong>Type:</strong> {registeredMember.membershipType}</p>
              <p><strong>Member ID:</strong> {registeredMember.id}</p>
              <p><strong>Registration Date:</strong> {new Date(registeredMember.registrationDate).toLocaleDateString()}</p>
            </div>

            <div className="bg-white border-2 border-dashed border-gray-300 p-6 text-center rounded-lg">
              <h4 className="font-semibold mb-2">Member Barcode</h4>
              <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
                {generateBarcode(registeredMember.id)}
              </div>
              <p className="text-xs text-gray-500">{registeredMember.id}</p>
              <p className="text-xs text-gray-400 mt-2">
                In a real system, this would be a scannable barcode
              </p>
            </div>

            <Button 
              onClick={() => setRegisteredMember(null)} 
              variant="outline" 
              className="w-full"
            >
              Register Another Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberRegistration;