import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, DollarSign, Shield, BarChart3, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Payroll Automation",
      description: "Automated payroll processing with real-time validation"
    },
    {
      icon: DollarSign,
      title: "Tip Tracking",
      description: "Comprehensive tip management and pool balancing"
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Built-in FLSA, IRS, and state compliance monitoring"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Advanced reporting and business insights"
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Complete employee lifecycle management"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold">
            Powerful <span className="text-gradient-primary">Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage payroll for tipped workforces
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features; 