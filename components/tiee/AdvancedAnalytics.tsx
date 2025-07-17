
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ValidationReports } from './ValidationReports';

export const AdvancedAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            Validation Analytics & Reports
          </h2>
          <p className="text-muted-foreground">Comprehensive analysis of rule-based validation performance</p>
        </div>
      </div>

      <ValidationReports />
    </div>
  );
};
