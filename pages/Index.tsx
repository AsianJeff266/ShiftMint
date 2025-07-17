
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Navigation } from '@/components/Navigation';
import { ArrowRight, Zap, CheckCircle, BarChart3, Shield, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "TIEE Intelligence",
      description: "Real-time payroll validation catches errors before they become costly problems"
    },
    {
      icon: DollarSign,
      title: "Smart Tip Tracking",
      description: "Automatic tip pool balancing with sales-to-tip ratio monitoring"
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "Built-in FLSA, IRS, and state compliance with audit-proof documentation"
    },
    {
      icon: BarChart3,
      title: "Manager Dashboards",
      description: "Intuitive tools for flag resolution and payroll oversight"
    }
  ];

  const trustIndicators = [
    {
      value: "99.9%",
      label: "Accuracy Rate",
      description: "Error detection precision"
    },
    {
      value: "50+",
      label: "Compliance Rules",
      description: "Built-in validation checks"
    },
    {
      value: "24/7",
      label: "Real-time Monitoring",
      description: "Continuous payroll oversight"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-blue opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-gold opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* New Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">All in one.</span>
                <br />
                <span className="text-gradient-primary">
                  Get it done.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                The modern payroll OS built specifically for tipped workforces. 
                Transform chaos into clarity with intelligent automation and real-time validation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                onClick={() => navigate('/demo')}
              >
                View Demo
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-3xl blur-3xl"></div>
            <Card className="relative glass-card shadow-elevated border-border/30">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">ShiftMint Dashboard</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card rounded-lg p-4 border-primary/20">
                    <div className="text-2xl font-bold text-accent">$2,847</div>
                    <div className="text-sm text-muted-foreground">Weekly Tips</div>
                  </div>
                  <div className="glass-card rounded-lg p-4 border-primary/20">
                    <div className="text-2xl font-bold text-primary">98.5%</div>
                    <div className="text-sm text-muted-foreground">Compliance</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payroll Status</span>
                    <span className="text-sm text-accent">All Good</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Built for <span className="text-gradient-primary">Tipped Industries</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Traditional payroll systems weren't designed for tipped industries. 
              ShiftMint understands your unique challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card border-border/30 hover:shadow-blue transition-all duration-300 group">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="space-y-2">
                <div className={`text-4xl font-bold ${
                  index === 0 ? 'text-gradient-blue' : 
                  index === 1 ? 'text-gradient-gold' : 
                  'text-gradient-primary'
                }`}>
                  {indicator.value}
                </div>
                <div className="text-lg font-semibold text-foreground">{indicator.label}</div>
                <div className="text-sm text-muted-foreground">{indicator.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="absolute inset-0 bg-muted/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Transform Your <span className="text-gradient-primary">Payroll</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of restaurants and hospitality businesses already using ShiftMint 
              to streamline their payroll and ensure compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/signup')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-primary/30 hover:bg-primary/10"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ShiftMint, Inc. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <button 
                onClick={() => navigate('/privacy')} 
                className="hover:text-accent transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={() => navigate('/terms')} 
                className="hover:text-accent transition-colors"
              >
                Terms
              </button>
              <button 
                onClick={() => navigate('/support')} 
                className="hover:text-accent transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
