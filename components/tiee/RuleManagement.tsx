
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, AlertTriangle, Clock, TrendingUp, Target } from 'lucide-react';
import { AnomalyDetectionEngine } from '@/lib/anomaly-detection/engine';
import { ValidationRule, AnomalyDetectionOptions } from '@/lib/anomaly-detection/types';
import { useToast } from '@/hooks/use-toast';

interface RuleStatus {
  id: string;
  name: string;
  enabled: boolean;
  triggers: number;
  accuracy: number;
  lastTriggered?: Date;
}

export const RuleManagement: React.FC = () => {
  const { toast } = useToast();
  const [engine] = useState(() => new AnomalyDetectionEngine());
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [ruleStatuses, setRuleStatuses] = useState<RuleStatus[]>([]);
  const [options, setOptions] = useState<AnomalyDetectionOptions>({
    venueClosingTime: '02:00',
    tipSalesRatioMin: 0.01,
    tipSalesRatioMax: 0.40
  });

  useEffect(() => {
    const availableRules = engine.getRules();
    setRules(availableRules);
    
    // Initialize rule statuses with mock data
    setRuleStatuses(availableRules.map(rule => ({
      id: rule.id,
      name: rule.name,
      enabled: true,
      triggers: Math.floor(Math.random() * 50) + 5,
      accuracy: Math.floor(Math.random() * 20) + 80,
      lastTriggered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    })));
  }, [engine]);

  const handleRuleToggle = (ruleId: string) => {
    const ruleStatus = ruleStatuses.find(r => r.id === ruleId);
    const newEnabled = !ruleStatus?.enabled;
    
    engine.setRuleStatus(ruleId, newEnabled);
    
    setRuleStatuses(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: newEnabled } : rule
    ));
    
    toast({
      title: `Rule ${newEnabled ? 'Enabled' : 'Disabled'}`,
      description: `${ruleStatus?.name} has been ${newEnabled ? 'activated' : 'deactivated'}`,
    });
  };

  const handleOptionsUpdate = (newOptions: Partial<AnomalyDetectionOptions>) => {
    const updatedOptions = { ...options, ...newOptions };
    setOptions(updatedOptions);
    engine.updateOptions(updatedOptions);
    
    toast({
      title: 'Settings Updated',
      description: 'Validation parameters have been updated',
    });
  };

  const getSeverityColor = (ruleId: string) => {
    if (ruleId.includes('ERROR') || ruleId.includes('001') || ruleId.includes('011')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Validation Rules Management
          </h2>
          <p className="text-muted-foreground">Configure and monitor payroll validation rules</p>
        </div>
      </div>

      {/* Rule Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Target className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {ruleStatuses.filter(r => r.enabled).length}
              </p>
              <p className="text-sm text-green-600/80">Active Rules</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {ruleStatuses.reduce((sum, r) => sum + r.triggers, 0)}
              </p>
              <p className="text-sm text-orange-600/80">Total Triggers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(ruleStatuses.reduce((sum, r) => sum + r.accuracy, 0) / ruleStatuses.length)}%
              </p>
              <p className="text-sm text-blue-600/80">Avg Accuracy</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {ruleStatuses.filter(r => r.lastTriggered && 
                  r.lastTriggered > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-purple-600/80">Recent Activity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">Validation Rules</TabsTrigger>
          <TabsTrigger value="settings">Algorithm Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Validation Rules</CardTitle>
              <CardDescription>Enable or disable specific validation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ruleStatuses.map((ruleStatus) => {
                  const rule = rules.find(r => r.id === ruleStatus.id);
                  if (!rule) return null;
                  
                  return (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(rule.id)}>
                            {rule.id}
                          </Badge>
                          <div>
                            <h4 className="font-medium">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {rule.id === 'TIEE-001' && 'Detects impossible punch sequences and timing errors'}
                              {rule.id === 'TIEE-002' && 'Flags shifts shorter than minimum duration'}
                              {rule.id === 'TIEE-003' && 'Identifies excessively long shifts'}
                              {rule.id === 'TIEE-004' && 'Monitors daily hour accumulation'}
                              {rule.id === 'TIEE-005' && 'Tracks meal break duration violations'}
                              {rule.id === 'TIEE-006' && 'Detects micro-gaps between shifts'}
                              {rule.id === 'TIEE-007' && 'Monitors schedule adherence'}
                              {rule.id === 'TIEE-008' && 'Prevents job code overlaps'}
                              {rule.id === 'TIEE-009' && 'Validates overnight shift logic'}
                              {rule.id === 'TIEE-010' && 'Analyzes tip-to-sales ratios'}
                              {rule.id === 'TIEE-011' && 'Identifies missing punch events'}
                              {rule.id === 'TIEE-012' && 'Monitors weekly hour limits'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="font-medium">{ruleStatus.accuracy}% accuracy</p>
                          <p className="text-muted-foreground">{ruleStatus.triggers} triggers</p>
                        </div>
                        
                        <Switch 
                          checked={ruleStatus.enabled}
                          onCheckedChange={() => handleRuleToggle(rule.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Configuration</CardTitle>
              <CardDescription>Configure validation parameters and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Time & Schedule Settings</h4>
                  
                  <div className="space-y-2">
                    <Label>Venue Closing Time</Label>
                    <Input 
                      type="time"
                      value={options.venueClosingTime}
                      onChange={(e) => handleOptionsUpdate({ venueClosingTime: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Used for overnight shift validation</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Tip Validation Settings</h4>
                  
                  <div className="space-y-2">
                    <Label>Minimum Tip-to-Sales Ratio (%)</Label>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={(options.tipSalesRatioMin || 0.01) * 100}
                      onChange={(e) => handleOptionsUpdate({ 
                        tipSalesRatioMin: parseFloat(e.target.value) / 100 
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Maximum Tip-to-Sales Ratio (%)</Label>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={(options.tipSalesRatioMax || 0.40) * 100}
                      onChange={(e) => handleOptionsUpdate({ 
                        tipSalesRatioMax: parseFloat(e.target.value) / 100 
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
