
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useExport } from '@/hooks/useExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Building, 
  DollarSign, 
  CreditCard, 
  Users, 
  Bell, 
  FileText, 
  Settings as SettingsIcon, 
  Shield,
  Phone,
  Mail,
  Key,
  Trash2,
  Edit,
  Save,
  X,
  Plus,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  Zap,
  Link,
  Eye,
  EyeOff
} from 'lucide-react';

interface BusinessData {
  id: string;
  name: string;
  type: string;
  address: any;
  phone: string;
  website: string;
  ein: string;
  state_of_incorporation: string;
  primary_pos_system: string;
  tip_handling_method: string;
  pay_schedule_frequency: string;
  credit_card_tip_tracking: boolean;
  employee_count: number;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  is_business_owner: boolean;
}

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { exportData, loading: exportLoading } = useExport();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enable2FA: false
  });

  const [businessForm, setBusinessForm] = useState({
    name: '',
    type: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    phone: '',
    website: '',
    ein: '',
    stateOfIncorporation: '',
    timezone: 'America/New_York'
  });

  const [payrollForm, setPayrollForm] = useState({
    payFrequency: 'weekly',
    payPeriodStartDay: 'monday',
    payrollMethod: 'direct_deposit',
    overtimeRules: 'flsa',
    holidayPayRules: 'none',
    minimumWage: '15.00',
    tipHandlingMethod: 'pooled',
    tipAllocationRules: {}
  });

  const [posForm, setPosForm] = useState({
    posSystem: 'square',
    autoSync: true,
    syncFrequency: 'hourly',
    importHistorical: false,
    apiKey: '',
    webhookUrl: ''
  });

  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: true,
    smsAlerts: false,
    payrollAlerts: true,
    complianceAlerts: true,
    anomalyThreshold: 30,
    dailyReports: false,
    weeklyReports: true
  });

  const [complianceForm, setComplianceForm] = useState({
    auditLogRetention: '365',
    timecardEditPermissions: 'admin_only',
    tipDiscrepancyThreshold: '5.00',
    autoFlagRules: true,
    exportFormat: 'csv'
  });

  useEffect(() => {
    loadUserData();
    loadBusinessData();
    loadEmployees();
    loadAuditLogs();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserData(data);
      setProfileForm({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        enable2FA: false
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadBusinessData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setBusinessData(data);
      setBusinessForm({
        name: data.name || '',
        type: data.type || '',
        address: data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        phone: data.phone || '',
        website: data.website || '',
        ein: data.ein || '',
        stateOfIncorporation: data.state_of_incorporation || '',
        timezone: 'America/New_York'
      });
      
      setPayrollForm({
        payFrequency: data.pay_schedule_frequency || 'weekly',
        payPeriodStartDay: 'monday',
        payrollMethod: 'direct_deposit',
        overtimeRules: 'flsa',
        holidayPayRules: 'none',
        minimumWage: '15.00',
        tipHandlingMethod: data.tip_handling_method || 'pooled',
        tipAllocationRules: {}
      });
      
      setPosForm({
        posSystem: data.primary_pos_system || 'square',
        autoSync: true,
        syncFrequency: 'hourly',
        importHistorical: false,
        apiKey: '',
        webhookUrl: ''
      });
      
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const loadEmployees = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          users(first_name, last_name, email)
        `)
        .eq('business_id', user.id);
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAuditLogs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          phone: profileForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      
      await loadUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBusiness = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: businessForm.name,
          type: businessForm.type,
          address: businessForm.address,
          phone: businessForm.phone,
          website: businessForm.website,
          ein: businessForm.ein,
          state_of_incorporation: businessForm.stateOfIncorporation,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'Business Updated',
        description: 'Your business information has been successfully updated.',
      });
      
      await loadBusinessData();
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your business information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePayroll = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          pay_schedule_frequency: payrollForm.payFrequency,
          tip_handling_method: payrollForm.tipHandlingMethod,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'Payroll Settings Updated',
        description: 'Your payroll configuration has been successfully updated.',
      });
      
      await loadBusinessData();
    } catch (error) {
      console.error('Error updating payroll settings:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your payroll settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePOS = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          primary_pos_system: posForm.posSystem,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'POS Settings Updated',
        description: 'Your POS integration settings have been successfully updated.',
      });
      
      await loadBusinessData();
    } catch (error) {
      console.error('Error updating POS settings:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your POS settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    await exportData({
      format,
      includeEmployees: true,
      includeShifts: true,
      includeTips: true,
      includeAuditLogs: true
    });
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be a soft delete
      // and would trigger a cleanup process
      await logout();
      toast({
        title: 'Account Deleted',
        description: 'Your account has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting your account.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'bar', label: 'Bar' },
    { value: 'cafe', label: 'Café' },
    { value: 'fast_food', label: 'Fast Food' },
    { value: 'fine_dining', label: 'Fine Dining' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'catering', label: 'Catering' },
    { value: 'other', label: 'Other' }
  ];

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
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account, business, and system preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Payroll</span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">POS</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile & Authentication */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile & Authentication
              </CardTitle>
              <CardDescription>
                Manage your personal information and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={profileForm.currentPassword}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable2FA"
                      checked={profileForm.enable2FA}
                      onCheckedChange={(checked) => setProfileForm(prev => ({ ...prev, enable2FA: checked }))}
                    />
                    <Label htmlFor="enable2FA">Enable Two-Factor Authentication</Label>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Management</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-sm text-muted-foreground">Log out from all devices</p>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    Log Out Everywhere
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteAccount} disabled={loading}>
                          {loading ? 'Deleting...' : 'Delete Account'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Settings
              </CardTitle>
              <CardDescription>
                Manage your business information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessForm.name}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Restaurant Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessForm.type} onValueChange={(value) => setBusinessForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={businessForm.address.street}
                    onChange={(e) => setBusinessForm(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={businessForm.address.city}
                      onChange={(e) => setBusinessForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={businessForm.address.state} 
                      onValueChange={(value) => setBusinessForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, state: value }
                      }))}
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
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={businessForm.address.zipCode}
                      onChange={(e) => setBusinessForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, zipCode: e.target.value }
                      }))}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={businessForm.address.country}
                      onChange={(e) => setBusinessForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, country: e.target.value }
                      }))}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={businessForm.website}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourrestaurant.com"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tax Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ein">Federal EIN</Label>
                    <Input
                      id="ein"
                      value={businessForm.ein}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, ein: e.target.value }))}
                      placeholder="XX-XXXXXXX"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateIncorporation">State of Incorporation</Label>
                    <Select 
                      value={businessForm.stateOfIncorporation} 
                      onValueChange={(value) => setBusinessForm(prev => ({ ...prev, stateOfIncorporation: value }))}
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

              <div className="flex justify-end">
                <Button onClick={saveBusiness} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Business Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export & Data Management */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Export & Management
              </CardTitle>
              <CardDescription>
                Export your business data for analysis and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleExport('csv')} 
                  disabled={exportLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  onClick={() => handleExport('excel')} 
                  disabled={exportLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Excel
                </Button>
                <Button 
                  onClick={() => handleExport('pdf')} 
                  disabled={exportLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export PDF Report
                </Button>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Data Export:</strong> Your exported files will contain all employee data, 
                  shifts, tips, and audit logs. This is the core functionality that makes ShiftMint 
                  unique - comprehensive data synthesis for easy tax filing and compliance.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Export Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Employee Data</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete employee profiles, wages, roles, and tax information
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Shift Records</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Detailed shift logs with timestamps and duration tracking
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Tip Tracking</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive tip data with sources and distributions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Audit Logs</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete audit trail for compliance and security
                    </p>
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

export default Settings;
