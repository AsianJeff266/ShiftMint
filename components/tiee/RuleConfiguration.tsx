
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rule } from '@/types/rule';

interface RuleConfigurationProps {
  rules: Rule[];
  selectedRule: string;
  onSelectedRuleChange: (ruleId: string) => void;
}

export const RuleConfiguration: React.FC<RuleConfigurationProps> = ({
  rules,
  selectedRule,
  onSelectedRuleChange
}) => {
  const selectedRuleData = rules.find(r => r.id === selectedRule);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rule Configuration</CardTitle>
        <CardDescription>Detailed settings and learning parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <Select value={selectedRule} onValueChange={onSelectedRuleChange}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rules.map((rule) => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="settings" className="space-y-4">
            {selectedRuleData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Rule Parameters</h4>
                  {Object.entries(selectedRuleData.parameters).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <Input 
                        type={typeof value === 'number' ? 'number' : 'text'}
                        defaultValue={value.toString()} 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Rule Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-lg font-bold">{selectedRuleData.accuracy}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-lg font-bold">{selectedRuleData.confidence}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Triggers</p>
                      <p className="text-lg font-bold">{selectedRuleData.triggers}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Adaptations</p>
                      <p className="text-lg font-bold">{selectedRuleData.adaptations}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Learning Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Auto-adaptation</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Learning Rate</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Conservative)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Aggressive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Adaptation Threshold</Label>
                    <Input type="number" defaultValue="85" min="50" max="100" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Recent Adaptations</h4>
                <div className="space-y-2">
                  {[
                    { date: '2 days ago', change: 'Threshold adjusted from 15 to 12 minutes' },
                    { date: '5 days ago', change: 'Grace period increased to 5 minutes' },
                    { date: '1 week ago', change: 'Repeat offense multiplier optimized' }
                  ].map((adaptation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">{adaptation.change}</p>
                      <p className="text-xs text-muted-foreground">{adaptation.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Trigger History</h4>
              {[
                { time: '2 hours ago', employee: 'Sarah Johnson', action: 'Warning triggered', resolved: true },
                { time: '4 hours ago', employee: 'Mike Chen', action: 'Error flagged', resolved: true },
                { time: '6 hours ago', employee: 'Alex Rodriguez', action: 'Pattern detected', resolved: false },
                { time: '1 day ago', employee: 'Emily Davis', action: 'Anomaly found', resolved: true }
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{event.action}</p>
                    <p className="text-sm text-muted-foreground">{event.employee} • {event.time}</p>
                  </div>
                  <Badge variant={event.resolved ? 'default' : 'destructive'}>
                    {event.resolved ? 'Resolved' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
