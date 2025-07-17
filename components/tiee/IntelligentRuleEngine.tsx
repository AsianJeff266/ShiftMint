
import React from 'react';
import { Settings } from 'lucide-react';
import { RuleManagement } from './RuleManagement';

export const IntelligentRuleEngine: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Rules-Based Validation Engine
          </h2>
          <p className="text-muted-foreground">Configure and manage payroll validation rules</p>
        </div>
      </div>

      <RuleManagement />
    </div>
  );
};
