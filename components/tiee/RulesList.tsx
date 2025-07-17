
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Brain, Edit } from 'lucide-react';
import { Rule } from '@/types/rule';

interface RulesListProps {
  rules: Rule[];
  onRuleToggle: (ruleId: string) => void;
  onLearningToggle: (ruleId: string) => void;
}

export const RulesList: React.FC<RulesListProps> = ({ 
  rules, 
  onRuleToggle, 
  onLearningToggle 
}) => {
  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'time': return 'bg-blue-100 text-blue-800';
      case 'pattern': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-green-100 text-green-800';
      case 'anomaly': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Rules</CardTitle>
        <CardDescription>Monitor and manage your intelligent rules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(rule.severity)}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge className={getRuleTypeColor(rule.type)}>
                      {rule.type}
                    </Badge>
                    {rule.isLearning && (
                      <Badge variant="outline" className="text-purple-600">
                        <Brain className="h-3 w-3 mr-1" />
                        Learning
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.condition}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <p className="font-medium">{rule.confidence}% confidence</p>
                  <p className="text-muted-foreground">{rule.triggers} triggers</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={rule.isLearning}
                    onCheckedChange={() => onLearningToggle(rule.id)}
                  />
                  <Switch 
                    checked={rule.isActive}
                    onCheckedChange={() => onRuleToggle(rule.id)}
                  />
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
