import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  ArrowRight,
  Users,
  Building,
  CreditCard,
  DollarSign,
  Calendar,
  Zap,
  Trophy,
  Sparkles
} from 'lucide-react';

const Complete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Load complete onboarding data
    const savedData = localStorage.getItem('shiftmint_onboarding_complete');
    if (savedData) {
      setOnboardingData(JSON.parse(savedData));
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGoToDashboard();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoToDashboard = async () => {
    setLoading(true);
    
    try {
      // Here you would typically save all the onboarding data to Supabase
      // For now, we'll just show success and redirect
      
      toast({
        title: 'Welcome to ShiftMint!',
        description: 'Your account has been set up successfully.',
      });
      
      // Clear onboarding data from localStorage
      localStorage.removeItem('shiftmint_business_info');
      localStorage.removeItem('shiftmint_business_setup');
      localStorage.removeItem('shiftmint_onboarding_complete');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Setup Complete',
        description: 'Redirecting to your dashboard...',
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const completionStats = [
    {
      icon: Users,
      title: 'Team Members',
      value: onboardingData?.employees?.length || 0,
      subtitle: 'employees added'
    },
    {
      icon: Building,
      title: 'Business Setup',
      value: '100%',
      subtitle: 'configuration complete'
    },
    {
      icon: CreditCard,
      title: 'POS Integration',
      value: onboardingData?.primaryPOSSystem || 'Ready',
      subtitle: 'system configured'
    },
    {
      icon: DollarSign,
      title: 'Tip Tracking',
      value: onboardingData?.tipHandlingMethod || 'Configured',
      subtitle: 'method selected'
    }
  ];

  const nextSteps = [
    {
      icon: Users,
      title: 'Invite Your Team',
      description: 'Send invitations to employees to join your ShiftMint workspace',
      action: 'Invite Team'
    },
    {
      icon: Calendar,
      title: 'Schedule Setup',
      description: 'Configure work schedules and shift patterns',
      action: 'Set Schedule'
    },
    {
      icon: CreditCard,
      title: 'Connect POS',
      description: 'Link your POS system for automatic tip tracking',
      action: 'Connect Now'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Setup Complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              🎉 Welcome to ShiftMint!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your account has been successfully set up
            </p>
            <p className="text-muted-foreground">
              You'll be redirected to your dashboard in{' '}
              <span className="font-semibold text-primary">{countdown}</span> seconds
            </p>
          </div>

          {/* Setup Summary */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {completionStats.map((stat, index) => (
              <Card key={index} className="glass-card border-border/30 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Business Info Summary */}
          {onboardingData && (
            <Card className="glass-card border-border/30 shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary" />
                  <span>Business Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Business Name</h3>
                      <p className="text-lg">{onboardingData.businessName || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Business Type</h3>
                      <p className="capitalize">{onboardingData.businessType || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Employee Count</h3>
                      <p>{onboardingData.employeeCount || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Primary POS</h3>
                      <p className="capitalize">{onboardingData.primaryPOSSystem || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Tip Method</h3>
                      <p className="capitalize">{onboardingData.tipHandlingMethod || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Pay Schedule</h3>
                      <p className="capitalize">{onboardingData.payScheduleFrequency || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="glass-card border-border/30 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Recommended Next Steps</span>
              </CardTitle>
              <CardDescription>
                Complete these steps to get the most out of ShiftMint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {step.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/support')}
              className="flex items-center space-x-2"
            >
              <span>Need Help?</span>
            </Button>
            <Button 
              onClick={handleGoToDashboard}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold flex items-center space-x-2"
            >
              <span>{loading ? 'Loading...' : 'Go to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complete; 