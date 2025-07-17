
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Brain, TrendingUp, Zap } from 'lucide-react';
import { Rule } from '@/types/rule';

interface RuleMetricsCardsProps {
  rules: Rule[];
}

export const RuleMetricsCards: React.FC<RuleMetricsCardsProps> = ({ rules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-green-600">
              {rules.filter(r => r.isActive).length}
            </p>
            <p className="text-sm text-green-600/80">Active Rules</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {rules.filter(r => r.isLearning).length}
            </p>
            <p className="text-sm text-purple-600/80">Learning Rules</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(rules.reduce((sum, r) => sum + r.accuracy, 0) / rules.length)}%
            </p>
            <p className="text-sm text-blue-600/80">Avg Accuracy</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Zap className="h-8 w-8 text-orange-600" />
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {rules.reduce((sum, r) => sum + r.adaptations, 0)}
            </p>
            <p className="text-sm text-orange-600/80">Total Adaptations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
