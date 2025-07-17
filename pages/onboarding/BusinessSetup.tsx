import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Logo } from '@/components/ui/logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  ArrowLeft,
  Building, 
  CreditCard,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  Check
} from 'lucide-react';

const BusinessSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    federalEIN: '',
    stateOfIncorporation: '',
    primaryPOSSystem: '',
    tipHandlingMethod: '',
    payScheduleFrequency: '',
    creditCardTipTracking: true,
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessInfo, setBusinessInfo] = useState<any>(null);

  // Load business info from Step 1
  useEffect(() => {
    const savedBusinessInfo = localStorage.getItem('shiftmint_business_info');
    if (savedBusinessInfo) {
      setBusinessInfo(JSON.parse(savedBusinessInfo));
    }
  }, []);

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const posSystems = [
    { value: 'square', label: 'Square' },
    { value: 'toast', label: 'Toast' },
    { value: 'clover', label: 'Clover' },
    { value: 'revel', label: 'Revel' },
    { value: 'lightspeed', label: 'Lightspeed' },
    { value: 'micros', label: 'Micros' },
    { value: 'aloha', label: 'Aloha' },
    { value: 'other', label: 'Other' },
    { value: 'none', label: 'No POS System' }
  ];

  const paySchedules = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly (Every 2 weeks)' },
    { value: 'semi_monthly', label: 'Semi-monthly (1st & 15th)' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const tipMethods = [
    { 
      value: 'pooled', 
      label: 'Pooled Tips', 
      description: 'Tips are collected and distributed equally among eligible staff' 
    },
    { 
      value: 'individual', 
      label: 'Individual Tips', 
      description: 'Each employee keeps their own tips' 
    },
    { 
      value: 'hybrid', 
      label: 'Hybrid System', 
      description: 'Combination of pooled and individual tips' 
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatEIN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XX-XXXXXXX
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
    }
    return digits;
  };

  const handleEINChange = (value: string) => {
    const formattedEIN = formatEIN(value);
    handleInputChange('federalEIN', formattedEIN);
  };

  const validateForm = () => {
    const required = [
      'businessAddress.street',
      'businessAddress.city',
      'businessAddress.state',
      'businessAddress.zipCode',
      'stateOfIncorporation',
      'primaryPOSSystem',
      'tipHandlingMethod',
      'payScheduleFrequency'
    ];

    for (const field of required) {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!formData[parent as keyof typeof formData][child as keyof typeof formData.businessAddress]) {
          return false;
        }
      } else {
        if (!formData[field as keyof typeof formData]) {
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Store business setup info
      const businessSetupInfo = {
        ...businessInfo,
        ...formData,
        completedStep: 2
      };
      
      localStorage.setItem('shiftmint_business_setup', JSON.stringify(businessSetupInfo));
      
      // Navigate to step 3 - Add Team Members
      navigate('/onboarding/team-setup');
    } catch (error: any) {
      setError(error.message || 'Failed to save business setup');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Step 2 of 3</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Business Setup</h1>
            <p className="text-muted-foreground">Let's configure your business details and payroll preferences</p>
          </div>

          <Card className="glass-card border-border/30 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Configure Your Business</CardTitle>
              <CardDescription>
                Step 2 of 3 - Business information and payroll setup
              </CardDescription>
              <Progress value={66} className="w-full mt-4" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Business Address */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Business Address</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={formData.businessAddress.street}
                        onChange={(e) => handleInputChange('businessAddress.street', e.target.value)}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.businessAddress.city}
                          onChange={(e) => handleInputChange('businessAddress.city', e.target.value)}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select 
                          value={formData.businessAddress.state} 
                          onValueChange={(value) => handleInputChange('businessAddress.state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {usStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.businessAddress.zipCode}
                          onChange={(e) => handleInputChange('businessAddress.zipCode', e.target.value)}
                          placeholder="10001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.businessAddress.country}
                          onChange={(e) => handleInputChange('businessAddress.country', e.target.value)}
                          placeholder="United States"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Tax Information</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="federalEIN">Federal EIN (Tax ID)</Label>
                      <Input
                        id="federalEIN"
                        value={formData.federalEIN}
                        onChange={(e) => handleEINChange(e.target.value)}
                        placeholder="XX-XXXXXXX"
                        maxLength={10}
                      />
                      <p className="text-sm text-muted-foreground">
                        Your Employer Identification Number (optional but recommended)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stateOfIncorporation">State of Incorporation *</Label>
                      <Select 
                        value={formData.stateOfIncorporation} 
                        onValueChange={(value) => handleInputChange('stateOfIncorporation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {usStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* POS System */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">POS System</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryPOSSystem">Primary POS System *</Label>
                    <Select 
                      value={formData.primaryPOSSystem} 
                      onValueChange={(value) => handleInputChange('primaryPOSSystem', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your POS system" />
                      </SelectTrigger>
                      <SelectContent>
                        {posSystems.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      We'll help you integrate your POS system for automatic tip tracking
                    </p>
                  </div>
                </div>

                {/* Tip Handling */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Tip Handling Method</h3>
                  </div>
                  
                  <RadioGroup 
                    value={formData.tipHandlingMethod} 
                    onValueChange={(value) => handleInputChange('tipHandlingMethod', value)}
                  >
                    {tipMethods.map((method) => (
                      <div key={method.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <div className="flex-1">
                          <Label htmlFor={method.value} className="font-medium">
                            {method.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Payroll Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Payroll Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payScheduleFrequency">Pay Schedule Frequency *</Label>
                      <Select 
                        value={formData.payScheduleFrequency} 
                        onValueChange={(value) => handleInputChange('payScheduleFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pay frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {paySchedules.map((schedule) => (
                            <SelectItem key={schedule.value} value={schedule.value}>
                              {schedule.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creditCardTipTracking">Credit Card Tip Tracking</Label>
                      <Select 
                        value={formData.creditCardTipTracking ? 'yes' : 'no'} 
                        onValueChange={(value) => handleInputChange('creditCardTipTracking', value === 'yes')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes - Track credit card tips</SelectItem>
                          <SelectItem value="no">No - Cash tips only</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic tracking of credit card tips from your POS system
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold"
                  >
                    {loading ? 'Saving...' : 'Continue to Team Setup'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessSetup; 