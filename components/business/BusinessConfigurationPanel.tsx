import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { useSampleData } from '@/hooks/useSampleData';
import { Building2, Settings, MapPin, DollarSign, Users, Database } from 'lucide-react';

export const BusinessConfigurationPanel: React.FC = () => {
  const { data: configs, isLoading, error } = useBusinessConfig();
  const { generateSampleData, isGenerating } = useSampleData();
  
  const activeConfig = configs?.[0];
  
  const handleCreateSampleData = () => {
    generateSampleData();
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Configuration</CardTitle>
          <CardDescription>Loading configuration...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Configuration</CardTitle>
          <CardDescription>Error loading configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Business Configuration Found</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating sample business data with employees and payroll settings.
            </p>
            <Button 
              onClick={handleCreateSampleData}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? 'Creating Sample Data...' : 'Create Sample Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!activeConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Configuration</CardTitle>
          <CardDescription>Set up your business configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Configuration Found</h3>
            <p className="text-muted-foreground mb-6">
              Create a business configuration to get started with payroll management.
            </p>
            <Button 
              onClick={handleCreateSampleData}
              disabled={isGenerating}
            >
              {isGenerating ? 'Creating...' : 'Create Sample Business'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const taxSettings = activeConfig.tax_settings as any;
  const payrollSettings = activeConfig.payroll_settings as any;
  const address = activeConfig.address as any;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {activeConfig.business_name}
          </CardTitle>
          <CardDescription>
            Business configuration and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {address?.city}, {address?.state}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Federal Tax</p>
                <p className="text-sm text-muted-foreground">
                  {((taxSettings?.federal_rate || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Pay Period</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {payrollSettings?.pay_period || 'Weekly'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Overtime</p>
                <p className="text-sm text-muted-foreground">
                  {payrollSettings?.overtime_threshold || 40}h threshold
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>Current tax rates and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Federal Tax Rate</span>
                <Badge variant="secondary">
                  {((taxSettings?.federal_rate || 0) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">State Tax Rate</span>
                <Badge variant="secondary">
                  {((taxSettings?.state_rate || 0) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">FICA Rate</span>
                <Badge variant="secondary">
                  {((taxSettings?.fica_rate || 0) * 100).toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Unemployment Rate</span>
                <Badge variant="secondary">
                  {((taxSettings?.unemployment_rate || 0) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payroll Settings</CardTitle>
            <CardDescription>Wage and hour configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pay Frequency</span>
                <Badge variant="outline" className="capitalize">
                  {payrollSettings?.pay_period || 'Weekly'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overtime Threshold</span>
                <Badge variant="outline">
                  {payrollSettings?.overtime_threshold || 40} hours
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tip Credit Rate</span>
                <Badge variant="outline">
                  ${(payrollSettings?.tip_credit_rate || 0).toFixed(2)}/hr
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
