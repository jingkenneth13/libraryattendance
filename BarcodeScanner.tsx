
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react';
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  registrationDate: string;
}

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
}

const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedMember, setLastScannedMember] = useState<Member | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Load today's attendance from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`attendance_${today}`);
    if (stored) {
      setTodayAttendance(JSON.parse(stored));
    }
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    scannerRef.current = new Html5QrcodeScanner("barcode-scanner", config, false);
    
    scannerRef.current.render(
      (decodedText) => {
        handleScanSuccess(decodedText);
      },
      (error) => {
        console.log('Scan error:', error);
      }
    );
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = (barcode: string) => {
    console.log('Scanned barcode:', barcode);
    
    // Get members from localStorage
    const members = JSON.parse(localStorage.getItem('library_members') || '[]');
    const member = members.find((m: Member) => m.id === barcode);
    
    if (member) {
      setLastScannedMember(member);
      recordAttendance(member);
      toast.success(`Welcome, ${member.name}!`);
    } else {
      toast.error('Member not found. Please register first.');
    }
    
    stopScanning();
  };

  const recordAttendance = (member: Member) => {
    const today = new Date().toDateString();
    const now = new Date();
    
    // Check if member already checked in today
    const existingRecord = todayAttendance.find(
      record => record.memberId === member.id && record.type === 'check-in'
    );
    
    const newRecord: AttendanceRecord = {
      id: `${member.id}_${now.getTime()}`,
      memberId: member.id,
      memberName: member.name,
      timestamp: now.toISOString(),
      type: existingRecord ? 'check-out' : 'check-in'
    };
    
    const updatedAttendance = [...todayAttendance, newRecord];
    setTodayAttendance(updatedAttendance);
    
    // Save to localStorage
    localStorage.setItem(`attendance_${today}`, JSON.stringify(updatedAttendance));
    
    // Also save to general attendance history
    const allAttendance = JSON.parse(localStorage.getItem('all_attendance') || '[]');
    allAttendance.push(newRecord);
    localStorage.setItem('all_attendance', JSON.stringify(allAttendance));
  };

  const getTodayStats = () => {
    const checkIns = todayAttendance.filter(record => record.type === 'check-in').length;
    const checkOuts = todayAttendance.filter(record => record.type === 'check-out').length;
    return { checkIns, checkOuts, current: checkIns - checkOuts };
  };

  const stats = getTodayStats();

  return (
    <div className="space-y-6">
      {/* Scanner Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Click the button below to start scanning member barcodes</p>
              <Button onClick={startScanning} size="lg" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div id="barcode-scanner" className="w-full"></div>
              <Button onClick={stopScanning} variant="outline" className="w-full">
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scanning
              </Button>
            </div>
          )}
          
          {lastScannedMember && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>{lastScannedMember.name}</strong> - {lastScannedMember.membershipType} member
                <br />
                <small className="text-gray-500">Last scanned: {new Date().toLocaleTimeString()}</small>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.checkIns}</div>
              <div className="text-sm text-gray-500">Check-ins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.checkOuts}</div>
              <div className="text-sm text-gray-500">Check-outs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.current}</div>
              <div className="text-sm text-gray-500">Currently In</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {todayAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayAttendance.slice(-10).reverse().map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{record.memberName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge variant={record.type === 'check-in' ? 'default' : 'secondary'}>
                    {record.type === 'check-in' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {record.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarcodeScanner;