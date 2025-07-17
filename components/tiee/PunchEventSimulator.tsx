
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Play } from 'lucide-react';

export const PunchEventSimulator: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [jobCode, setJobCode] = useState('SERVER');
  const [source, setSource] = useState<'POS' | 'WEB' | 'MOBILE'>('POS');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const createPunchEvent = async (punchType: 'IN' | 'OUT') => {
    if (!employeeId.trim()) {
      toast({
        title: 'Error',
        description: 'Employee ID is required',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const punchEvent = {
        employee_id: employeeId,
        job_code: jobCode,
        punch_type: punchType,
        ts_utc: new Date().toISOString(),
        source,
        raw_payload: {
          timestamp: new Date().toISOString(),
          terminal_id: 'SIM-001',
          location: 'Main Restaurant'
        },
        location_id: '00000000-0000-0000-0000-000000000001'
      };

      const { error } = await supabase
        .from('punch_events')
        .insert(punchEvent);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `${punchType} punch recorded for employee ${employeeId}`,
      });

    } catch (error) {
      console.error('Failed to create punch event:', error);
      toast({
        title: 'Error',
        description: 'Failed to record punch event',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generateSampleData = async () => {
    setSubmitting(true);
    try {
      const sampleEmployees = ['EMP001', 'EMP002', 'EMP003'];
      const events = [];
      
      for (const empId of sampleEmployees) {
        // Create a shift with some variations
        const startTime = new Date();
        startTime.setHours(startTime.getHours() - Math.floor(Math.random() * 8) - 1);
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + Math.floor(Math.random() * 10) + 4); // 4-14 hour shifts
        
        events.push({
          employee_id: empId,
          job_code: Math.random() > 0.5 ? 'SERVER' : 'COOK',
          punch_type: 'IN',
          ts_utc: startTime.toISOString(),
          source: 'POS',
          raw_payload: { terminal_id: 'SIM-001', location: 'Main Restaurant' },
          location_id: '00000000-0000-0000-0000-000000000001'
        });
        
        events.push({
          employee_id: empId,
          job_code: Math.random() > 0.5 ? 'SERVER' : 'COOK',
          punch_type: 'OUT',
          ts_utc: endTime.toISOString(),
          source: 'POS',
          raw_payload: { terminal_id: 'SIM-001', location: 'Main Restaurant' },
          location_id: '00000000-0000-0000-0000-000000000001'
        });
      }

      const { error } = await supabase
        .from('punch_events')
        .insert(events);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Generated ${events.length} sample punch events`,
      });

    } catch (error) {
      console.error('Failed to generate sample data:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate sample data',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Punch Event Simulator</CardTitle>
        <CardDescription>Create test punch events for TIEE validation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g., EMP001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobCode">Job Code</Label>
            <Select value={jobCode} onValueChange={setJobCode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVER">SERVER</SelectItem>
                <SelectItem value="COOK">COOK</SelectItem>
                <SelectItem value="HOST">HOST</SelectItem>
                <SelectItem value="MANAGER">MANAGER</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select value={source} onValueChange={(value: 'POS' | 'WEB' | 'MOBILE') => setSource(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="WEB">WEB</SelectItem>
              <SelectItem value="MOBILE">MOBILE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => createPunchEvent('IN')}
            disabled={submitting}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Clock IN
          </Button>
          
          <Button
            onClick={() => createPunchEvent('OUT')}
            disabled={submitting}
            variant="outline"
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Clock OUT
          </Button>
        </div>

        <Button
          onClick={generateSampleData}
          disabled={submitting}
          variant="secondary"
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Generate Sample Data
        </Button>
      </CardContent>
    </Card>
  );
};
