import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/ui/logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Trash2,
  Users,
  Mail,
  DollarSign,
  Upload,
  FileText,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hourlyWage: string;
  tipEligible: boolean;
}

const TeamSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state
  const [employees, setEmployees] = useState<Employee[]>([{
    id: '1',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    hourlyWage: '',
    tipEligible: true
  }]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Load business info from previous steps
  useEffect(() => {
    const savedBusinessSetup = localStorage.getItem('shiftmint_business_setup');
    if (savedBusinessSetup) {
      setBusinessInfo(JSON.parse(savedBusinessSetup));
    }
  }, []);

  const employeeRoles = [
    { value: 'server', label: 'Server' },
    { value: 'bartender', label: 'Bartender' },
    { value: 'host', label: 'Host/Hostess' },
    { value: 'busser', label: 'Busser' },
    { value: 'cook', label: 'Cook' },
    { value: 'manager', label: 'Manager' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'food_runner', label: 'Food Runner' },
    { value: 'other', label: 'Other' }
  ];

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      hourlyWage: '',
      tipEligible: true
    };
    setEmployees([...employees, newEmployee]);
  };

  const removeEmployee = (id: string) => {
    if (employees.length > 1) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const updateEmployee = (id: string, field: keyof Employee, value: string | boolean) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmployees = () => {
    const errors: string[] = [];
    
    employees.forEach((employee, index) => {
      if (!employee.firstName.trim()) {
        errors.push(`Employee ${index + 1}: First name is required`);
      }
      if (!employee.lastName.trim()) {
        errors.push(`Employee ${index + 1}: Last name is required`);
      }
      if (employee.email && !validateEmail(employee.email)) {
        errors.push(`Employee ${index + 1}: Invalid email format`);
      }
      if (employee.hourlyWage && (isNaN(Number(employee.hourlyWage)) || Number(employee.hourlyWage) < 0)) {
        errors.push(`Employee ${index + 1}: Invalid hourly wage`);
      }
    });
    
    return errors;
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Here you would typically parse the CSV file
      // For now, we'll just show a placeholder
      setError('CSV upload functionality coming soon!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validationErrors = validateEmployees();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      // Store complete onboarding data
      const completeOnboardingData = {
        ...businessInfo,
        employees: employees.filter(emp => emp.firstName.trim() || emp.lastName.trim()),
        completedStep: 3,
        onboardingCompleted: true
      };
      
      localStorage.setItem('shiftmint_onboarding_complete', JSON.stringify(completeOnboardingData));
      
      // Navigate to onboarding completion
      navigate('/onboarding/complete');
    } catch (error: any) {
      setError(error.message || 'Failed to save team setup');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip team setup and go to completion
    const completeOnboardingData = {
      ...businessInfo,
      employees: [],
      completedStep: 3,
      onboardingCompleted: true
    };
    
    localStorage.setItem('shiftmint_onboarding_complete', JSON.stringify(completeOnboardingData));
    navigate('/onboarding/complete');
  };

  const handleBack = () => {
    navigate('/onboarding/business-setup');
  };

  const getCompletedEmployees = () => {
    return employees.filter(emp => emp.firstName.trim() && emp.lastName.trim()).length;
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
            <span className="text-sm text-muted-foreground">Step 3 of 3</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Add Your Team</h1>
            <p className="text-muted-foreground">
              Add your employees to get started with payroll and tip management
            </p>
          </div>

          <Card className="glass-card border-border/30 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Team Members</CardTitle>
              <CardDescription>
                Step 3 of 3 - Add your employees (Optional)
              </CardDescription>
              <Progress value={100} className="w-full mt-4" />
              
              <div className="flex justify-center items-center space-x-4 mt-4">
                <Badge variant="secondary">
                  {getCompletedEmployees()} employee{getCompletedEmployees() !== 1 ? 's' : ''} added
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* CSV Upload Option */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Employee Information</h3>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCSVUpload(!showCSVUpload)}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Bulk Upload CSV</span>
                    </Button>
                  </div>

                  {showCSVUpload && (
                    <Card className="border-dashed border-2 border-border">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="font-semibold mb-2">Upload Employee CSV</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload a CSV file with employee data (firstName, lastName, email, role, hourlyWage, tipEligible)
                          </p>
                          <Input
                            type="file"
                            accept=".csv"
                            onChange={handleCSVUpload}
                            className="max-w-sm mx-auto"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Download our <button className="text-primary underline">CSV template</button> to get started
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Employee List */}
                <div className="space-y-6">
                  {employees.map((employee, index) => (
                    <Card key={employee.id} className="border-border/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Employee {index + 1}</CardTitle>
                          {employees.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeEmployee(employee.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`firstName-${employee.id}`}>First Name</Label>
                            <Input
                              id={`firstName-${employee.id}`}
                              value={employee.firstName}
                              onChange={(e) => updateEmployee(employee.id, 'firstName', e.target.value)}
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`lastName-${employee.id}`}>Last Name</Label>
                            <Input
                              id={`lastName-${employee.id}`}
                              value={employee.lastName}
                              onChange={(e) => updateEmployee(employee.id, 'lastName', e.target.value)}
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`email-${employee.id}`}>Email (for invite)</Label>
                          <Input
                            id={`email-${employee.id}`}
                            type="email"
                            value={employee.email}
                            onChange={(e) => updateEmployee(employee.id, 'email', e.target.value)}
                            placeholder="john@example.com"
                          />
                          <p className="text-xs text-muted-foreground">
                            Optional - We'll send an invite to set up their account
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`role-${employee.id}`}>Role</Label>
                            <Select 
                              value={employee.role} 
                              onValueChange={(value) => updateEmployee(employee.id, 'role', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {employeeRoles.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`hourlyWage-${employee.id}`}>Hourly Wage (Optional)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id={`hourlyWage-${employee.id}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={employee.hourlyWage}
                                onChange={(e) => updateEmployee(employee.id, 'hourlyWage', e.target.value)}
                                placeholder="15.00"
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tipEligible-${employee.id}`}
                            checked={employee.tipEligible}
                            onCheckedChange={(checked) => updateEmployee(employee.id, 'tipEligible', checked as boolean)}
                          />
                          <Label htmlFor={`tipEligible-${employee.id}`} className="text-sm">
                            Tip Eligible
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Employee Button */}
                <div className="flex justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addEmployee}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Another Employee</span>
                  </Button>
                </div>

                {/* Skip Option */}
                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip for now - I'll add employees later
                  </Button>
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
                    {loading ? 'Setting up...' : 'Complete Setup'}
                    <Check className="ml-2 h-4 w-4" />
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

export default TeamSetup; 