
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Search, Trash2, Eye, UserX } from 'lucide-react';
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  registrationDate: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    // Load members from localStorage
    const storedMembers = JSON.parse(localStorage.getItem('library_members') || '[]');
    setMembers(storedMembers);
    setFilteredMembers(storedMembers);
  }, []);

  useEffect(() => {
    // Filter members based on search term
    if (searchTerm) {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  const deleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const updatedMembers = members.filter(member => member.id !== memberId);
      setMembers(updatedMembers);
      localStorage.setItem('library_members', JSON.stringify(updatedMembers));
      toast.success('Member deleted successfully');
      setSelectedMember(null);
    }
  };

  const getMembershipTypeColor = (type: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      faculty: 'bg-green-100 text-green-800',
      staff: 'bg-yellow-100 text-yellow-800',
      visitor: 'bg-gray-100 text-gray-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMemberAttendance = (memberId: string) => {
    const allAttendance = JSON.parse(localStorage.getItem('all_attendance') || '[]');
    return allAttendance.filter((record: any) => record.memberId === memberId);
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{members.length}</div>
            <div className="text-sm text-gray-500">Total Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.membershipType === 'student').length}
            </div>
            <div className="text-sm text-gray-500">Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {members.filter(m => m.membershipType === 'faculty').length}
            </div>
            <div className="text-sm text-gray-500">Faculty</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {members.filter(m => m.membershipType === 'premium').length}
            </div>
            <div className="text-sm text-gray-500">Premium</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name, email, or member ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members List ({filteredMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserX className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                No members found.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMember?.id === member.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                      <Badge className={getMembershipTypeColor(member.membershipType)}>
                        {member.membershipType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Member Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMember ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                  <div className="space-y-2">
                    <p><strong>Member ID:</strong> {selectedMember.id}</p>
                    <p><strong>Email:</strong> {selectedMember.email}</p>
                    <p><strong>Type:</strong> 
                      <Badge className={`ml-2 ${getMembershipTypeColor(selectedMember.membershipType)}`}>
                        {selectedMember.membershipType}
                      </Badge>
                    </p>
                    <p><strong>Registration Date:</strong> {new Date(selectedMember.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Member Attendance Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Attendance Summary</h4>
                  {(() => {
                    const attendance = getMemberAttendance(selectedMember.id);
                    const checkIns = attendance.filter(r => r.type === 'check-in').length;
                    const checkOuts = attendance.filter(r => r.type === 'check-out').length;
                    return (
                      <div className="text-sm space-y-1">
                        <p>Total Check-ins: <strong>{checkIns}</strong></p>
                        <p>Total Check-outs: <strong>{checkOuts}</strong></p>
                        <p>Last Visit: <strong>
                          {attendance.length > 0 
                            ? new Date(attendance[attendance.length - 1].timestamp).toLocaleDateString()
                            : 'Never'
                          }
                        </strong></p>
                      </div>
                    );
                  })()}
                </div>

                <Button 
                  onClick={() => deleteMember(selectedMember.id)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Member
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a member to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberManagement;