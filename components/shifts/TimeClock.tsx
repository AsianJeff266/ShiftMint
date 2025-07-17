
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, LogIn, LogOut, Coffee, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TimeClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employeeId, setEmployeeId] = useState('');
  const [selectedAction, setSelectedAction] = useState<'clock-in' | 'clock-out' | 'break'>('clock-in');
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeClockAction = () => {
    if (!employeeId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your employee ID',
        variant: 'destructive'
      });
      return;
    }

    const actionMessages = {
      'clock-in': 'Clocked in successfully',
      'clock-out': 'Clocked out successfully',
      'break': 'Break started successfully'
    };

    toast({
      title: 'Success',
      description: actionMessages[selectedAction],
    });

    setEmployeeId('');
  };

  const getActionIcon = () => {
    switch (selectedAction) {
      case 'clock-in': return <LogIn className="w-5 h-5" />;
      case 'clock-out': return <LogOut className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
    }
  };

  const getActionColor = () => {
    switch (selectedAction) {
      case 'clock-in': return 'bg-green-600 hover:bg-green-700';
      case 'clock-out': return 'bg-red-600 hover:bg-red-700';
      case 'break': return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl">Time Clock</CardTitle>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-3xl font-mono font-bold text-blue-600">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-sm text-blue-600/80 mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="text-center text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={selectedAction} onValueChange={(value: any) => setSelectedAction(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clock-in">Clock In</SelectItem>
                <SelectItem value="clock-out">Clock Out</SelectItem>
                <SelectItem value="break">Start Break</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleTimeClockAction}
            className={`w-full h-12 text-lg ${getActionColor()}`}
          >
            {getActionIcon()}
            <span className="ml-2 capitalize">{selectedAction.replace('-', ' ')}</span>
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Main Restaurant - Terminal 001</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Clock Events</CardTitle>
          <CardDescription>Your recent time clock activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '2:30 PM', action: 'Break End', employee: 'Sarah Johnson' },
              { time: '2:00 PM', action: 'Break Start', employee: 'Sarah Johnson' },
              { time: '9:00 AM', action: 'Clock In', employee: 'Sarah Johnson' },
              { time: '5:00 PM', action: 'Clock Out', employee: 'Mike Chen' },
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="font-medium">{event.time}</span>
                  <span className="text-muted-foreground">{event.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{event.employee}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
