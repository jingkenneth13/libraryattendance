
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Download, Filter } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
}

const AttendanceHistory = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Load all attendance records from localStorage
    const allAttendance = JSON.parse(localStorage.getItem('all_attendance') || '[]');
    setAttendanceRecords(allAttendance);
    setFilteredRecords(allAttendance);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = attendanceRecords;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.memberId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return recordDate === filterDate;
      });
    }

    setFilteredRecords(filtered);
  }, [searchTerm, filterType, selectedDate, attendanceRecords]);

  const exportToCSV = () => {
    const csvContent = [
      ['Member ID', 'Member Name', 'Type', 'Date', 'Time'],
      ...filteredRecords.map(record => [
        record.memberId,
        record.memberName,
        record.type,
        new Date(record.timestamp).toLocaleDateString(),
        new Date(record.timestamp).toLocaleTimeString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_history_${new Date().toDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const checkIns = filteredRecords.filter(r => r.type === 'check-in').length;
    const checkOuts = filteredRecords.filter(r => r.type === 'check-out').length;
    const uniqueMembers = new Set(filteredRecords.map(r => r.memberId)).size;
    return { checkIns, checkOuts, uniqueMembers };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.checkIns}</div>
            <div className="text-sm text-gray-500">Total Check-ins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.checkOuts}</div>
            <div className="text-sm text-gray-500">Total Check-outs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.uniqueMembers}</div>
            <div className="text-sm text-gray-500">Unique Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="check-in">Check-ins Only</SelectItem>
                  <SelectItem value="check-out">Check-outs Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Button onClick={exportToCSV} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Records ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No attendance records found.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{record.memberName}</div>
                    <div className="text-sm text-gray-500">ID: {record.memberId}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={record.type === 'check-in' ? 'default' : 'secondary'}>
                      {record.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;