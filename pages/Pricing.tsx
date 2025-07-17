import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Navigation } from '@/components/Navigation';
import { 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Building, 
  Crown, 
  Users, 
  DollarSign, 
  Shield, 
  BarChart3,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for small restaurants and cafes",
      icon: Zap,
      features: [
        "Up to 15 employees",
        "Basic tip tracking",
        "Standard payroll processing",
        "Email support",
        "Basic compliance reporting",
        "Mobile app access",
        "30-day free trial"
      ],
      popular: false,
      ctaText: "Start Free Trial",
      ctaAction: () => navigate('/signup')
    },
    {
      name: "Growth",
      price: "$79",
      period: "per month",
      description: "Ideal for growing restaurants and multi-location businesses",
      icon: Building,
      features: [
        "Up to 50 employees",
        "Advanced tip pooling",
        "Automated compliance monitoring",
        "Priority support",
        "Advanced analytics",
        "POS integrations",
        "Custom reporting",
        "Manager dashboard",
        "Audit trails"
      ],
      popular: true,
      ctaText: "Start Free Trial",
      ctaAction: () => navigate('/signup')
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large restaurant groups and hospitality chains",
      icon: Crown,
      features: [
        "Unlimited employees",
        "Multi-location management",
        "Advanced tip algorithms",
        "Dedicated support",
        "Custom integrations",
        "White-label options",
        "Advanced security",
        "Training & onboarding",
        "Custom compliance rules"
      ],
      popular: false,
      ctaText: "Contact Sales",
      ctaAction: () => navigate('/support/contact')
    }
  ];

  const faqs = [
    {
      question: "What's included in the free trial?",
      answer: "All plans include a 30-day free trial with full access to all features. No credit card required."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "How does billing work?",
      answer: "We offer monthly and annual billing. Annual plans receive a 20% discount."
    },
    {
      question: "What support is included?",
      answer: "All plans include email support. Growth and Enterprise plans include priority support with faster response times."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include a 30-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`glass-card border-border/30 relative transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-primary/20 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={plan.ctaAction}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {plan.ctaText}
                  {plan.name !== 'Enterprise' && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose <span className="text-gradient-primary">ShiftMint</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Per-Employee Fees</h3>
              <p className="text-sm text-muted-foreground">
                Flat monthly pricing regardless of your team size
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Processing</h3>
              <p className="text-sm text-muted-foreground">
                Instant payroll validation and tip calculations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compliance Built-In</h3>
              <p className="text-sm text-muted-foreground">
                Automatic FLSA, IRS, and state compliance monitoring
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Detailed insights into your payroll and tip data
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass-card border-border/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of restaurants already using ShiftMint
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/support/contact')}
              className="px-8 py-4 text-lg font-semibold"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 