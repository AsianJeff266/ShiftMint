
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, Settings, CreditCard, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface IntegrationsSettingsProps {
  data: any;
  onChange: (data: any) => void;
}

export const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({ data, onChange }) => {
  const [posProvider, setPosProvider] = useState(data.posProvider || '');
  const [payrollExport, setPayrollExport] = useState(data.payrollExport || false);
  const [bankApiKey, setBankApiKey] = useState(data.bankApiKey || '');
  const [stripeKey, setStripeKey] = useState(data.stripeKey || '');
  const [showBankKey, setShowBankKey] = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);

  const updateData = (updates: any) => {
    const newData = { ...data, ...updates };
    onChange(newData);
  };

  const posProviders = [
    { value: 'square', label: 'Square' },
    { value: 'clover', label: 'Clover' },
    { value: 'toast', label: 'Toast' },
    { value: 'resy', label: 'Resy' },
    { value: 'opentable', label: 'OpenTable' },
    { value: 'lightspeed', label: 'Lightspeed' },
    { value: 'shopify', label: 'Shopify POS' },
    { value: 'other', label: 'Other' },
  ];

  const testConnection = async (type: string) => {
    // Simulate API test
    console.log(`Testing ${type} connection...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* POS Provider */}
          <div className="space-y-2">
            <Label htmlFor="pos-provider">POS Provider</Label>
            <Select value={posProvider} onValueChange={(value) => {
              setPosProvider(value);
              updateData({ posProvider: value });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select your POS system" />
              </SelectTrigger>
              <SelectContent>
                {posProviders.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {posProvider && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">Connected</Badge>
                <Button variant="ghost" size="sm" onClick={() => testConnection('POS')}>
                  Test Connection
                </Button>
              </div>
            )}
          </div>

          {/* Payroll Export Integration */}
          <div className="flex items-center space-x-2">
            <Switch
              id="payroll-export"
              checked={payrollExport}
              onCheckedChange={(checked) => {
                setPayrollExport(checked);
                updateData({ payrollExport: checked });
              }}
            />
            <Label htmlFor="payroll-export">Enable Payroll Export Integration</Label>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            API Keys & Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              API keys are encrypted and stored securely. Only enter keys from trusted sources.
            </AlertDescription>
          </Alert>

          {/* Bank API Key */}
          <div className="space-y-2">
            <Label htmlFor="bank-api-key">Bank API Key (Optional)</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="bank-api-key"
                  type={showBankKey ? "text" : "password"}
                  value={bankApiKey}
                  onChange={(e) => {
                    setBankApiKey(e.target.value);
                    updateData({ bankApiKey: e.target.value });
                  }}
                  placeholder="Enter your bank API key..."
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowBankKey(!showBankKey)}
                >
                  {showBankKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {bankApiKey && (
                <Button variant="outline" size="sm" onClick={() => testConnection('Bank')}>
                  Test
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              For direct deposit and automated banking features
            </p>
          </div>

          {/* Stripe Key */}
          <div className="space-y-2">
            <Label htmlFor="stripe-key">Stripe Secret Key (Optional)</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="stripe-key"
                  type={showStripeKey ? "text" : "password"}
                  value={stripeKey}
                  onChange={(e) => {
                    setStripeKey(e.target.value);
                    updateData({ stripeKey: e.target.value });
                  }}
                  placeholder="sk_live_... or sk_test_..."
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowStripeKey(!showStripeKey)}
                >
                  {showStripeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {stripeKey && (
                <Button variant="outline" size="sm" onClick={() => testConnection('Stripe')}>
                  Test
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              For processing credit card tips and payments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">POS System</span>
                <Badge variant={posProvider ? "default" : "secondary"}>
                  {posProvider ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {posProvider ? `Connected to ${posProviders.find(p => p.value === posProvider)?.label}` : 'No POS system configured'}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Payroll Export</span>
                <Badge variant={payrollExport ? "default" : "secondary"}>
                  {payrollExport ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {payrollExport ? 'Automatic payroll data export enabled' : 'Manual payroll processing only'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
