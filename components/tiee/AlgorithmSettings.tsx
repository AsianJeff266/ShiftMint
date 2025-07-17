
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { AnomalyDetectionOptions } from '@/lib/anomaly-detection/types';
import { useToast } from '@/hooks/use-toast';

export const AlgorithmSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AnomalyDetectionOptions & {
    enableRealTimeValidation: boolean;
    autoResolveFlags: boolean;
    notificationThreshold: number;
    validationFrequency: string;
  }>({
    venueClosingTime: '02:00',
    tipSalesRatioMin: 0.01,
    tipSalesRatioMax: 0.40,
    enableRealTimeValidation: true,
    autoResolveFlags: false,
    notificationThreshold: 5,
    validationFrequency: 'hourly'
  });

  const handleSave = () => {
    // In a real implementation, this would save to your backend
    toast({
      title: 'Settings Saved',
      description: 'Algorithm configuration has been updated successfully.',
    });
  };

  const handleReset = () => {
    setSettings({
      venueClosingTime: '02:00',
      tipSalesRatioMin: 0.01,
      tipSalesRatioMax: 0.40,
      enableRealTimeValidation: true,
      autoResolveFlags: false,
      notificationThreshold: 5,
      validationFrequency: 'hourly'
    });
    
    toast({
      title: 'Settings Reset',
      description: 'All settings have been restored to default values.',
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600" />
            Algorithm Configuration
          </h2>
          <p className="text-muted-foreground">Configure validation engine parameters and behavior</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="behavior">Engine Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time & Schedule Validation</CardTitle>
              <CardDescription>Configure parameters for time-based validation rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Venue Closing Time</Label>
                  <Input 
                    type="time"
                    value={settings.venueClosingTime}
                    onChange={(e) => updateSetting('venueClosingTime', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for overnight shift validation (TIEE-009)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Validation Frequency</Label>
                  <Select 
                    value={settings.validationFrequency} 
                    onValueChange={(value) => updateSetting('validationFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tip Validation Parameters</CardTitle>
              <CardDescription>Configure tip-to-sales ratio validation (TIEE-010)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Tip-to-Sales Ratio (%)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(settings.tipSalesRatioMin || 0.01) * 100}
                    onChange={(e) => updateSetting('tipSalesRatioMin', parseFloat(e.target.value) / 100)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Flags ratios below this threshold as suspicious
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Maximum Tip-to-Sales Ratio (%)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(settings.tipSalesRatioMax || 0.40) * 100}
                    onChange={(e) => updateSetting('tipSalesRatioMax', parseFloat(e.target.value) / 100)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Flags ratios above this threshold as unusual
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Duration Thresholds</CardTitle>
              <CardDescription>Configure minimum and maximum duration limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Shift Duration (minutes)</Label>
                  <Input type="number" defaultValue="60" min="1" />
                  <p className="text-xs text-muted-foreground">TIEE-002: Too Short</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Maximum Shift Duration (hours)</Label>
                  <Input type="number" defaultValue="14" min="1" max="24" />
                  <p className="text-xs text-muted-foreground">TIEE-003: Too Long</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Maximum Break Duration (minutes)</Label>
                  <Input type="number" defaultValue="120" min="1" />
                  <p className="text-xs text-muted-foreground">TIEE-005: Meal Break</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Tolerance</CardTitle>
              <CardDescription>Configure acceptable schedule deviation limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Late Clock-in Tolerance (minutes)</Label>
                  <Input type="number" defaultValue="10" min="0" />
                  <p className="text-xs text-muted-foreground">TIEE-007: Schedule Drift</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Early Clock-in Tolerance (minutes)</Label>
                  <Input type="number" defaultValue="30" min="0" />
                  <p className="text-xs text-muted-foreground">TIEE-007: Schedule Drift</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engine Behavior</CardTitle>
              <CardDescription>Configure how the validation engine operates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Real-time Validation</Label>
                  <p className="text-sm text-muted-foreground">
                    Run validation checks as punch events are received
                  </p>
                </div>
                <Switch 
                  checked={settings.enableRealTimeValidation}
                  onCheckedChange={(checked) => updateSetting('enableRealTimeValidation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-resolve Low Confidence Flags</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically resolve flags with accuracy below 70%
                  </p>
                </div>
                <Switch 
                  checked={settings.autoResolveFlags}
                  onCheckedChange={(checked) => updateSetting('autoResolveFlags', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Notification Threshold</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="50"
                  value={settings.notificationThreshold}
                  onChange={(e) => updateSetting('notificationThreshold', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Send notifications when this many flags are generated per hour
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Severity Configuration</CardTitle>
              <CardDescription>Configure what triggers ERROR vs WARNING severity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700">ERROR Conditions</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Impossible punch sequences (TIEE-001)</li>
                    <li>• Missing required punches (TIEE-011)</li>
                    <li>• Job code overlaps (TIEE-008)</li>
                    <li>• Shifts exceeding 18 hours (TIEE-009)</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">WARNING Conditions</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Duration anomalies (TIEE-002, TIEE-003)</li>
                    <li>• Schedule deviations (TIEE-007)</li>
                    <li>• Tip ratio anomalies (TIEE-010)</li>
                    <li>• Excessive weekly hours (TIEE-012)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
