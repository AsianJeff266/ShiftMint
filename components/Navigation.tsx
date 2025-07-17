import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  DollarSign,
  Phone,
  BookOpen,
  Star,
  PlayCircle,
  Settings,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const productFeatures = [
    { name: 'Payroll Automation', href: '/features/payroll', icon: Zap },
    { name: 'Tip Tracking', href: '/features/tips', icon: DollarSign },
    { name: 'Audit Compliance', href: '/features/compliance', icon: Shield },
    { name: 'Manager Tools', href: '/features/management', icon: BarChart3 },
    { name: 'Employee Portal', href: '/features/employee', icon: Users },
  ];

  const supportOptions = [
    { name: 'Help Center', href: '/support', icon: BookOpen },
    { name: 'Contact Support', href: '/support/contact', icon: Phone },
    { name: 'System Status', href: '/support/status', icon: Settings },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn("border-b border-border/50 glass-card sticky top-0 z-50 bg-background/95 backdrop-blur-md", className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNavigation('/')}
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Product Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 hover:bg-muted/50">
                  <span>Product</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card border-border/50">
                {productFeatures.map((feature) => (
                  <DropdownMenuItem 
                    key={feature.href} 
                    onClick={() => handleNavigation(feature.href)}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50"
                  >
                    <feature.icon className="h-4 w-4 text-primary" />
                    <span>{feature.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing */}
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/pricing')}
              className="hover:bg-muted/50"
            >
              Pricing
            </Button>

            {/* Demo */}
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/demo')}
              className="hover:bg-muted/50 flex items-center space-x-1"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Demo</span>
            </Button>

            {/* Customer Stories */}
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/testimonials')}
              className="hover:bg-muted/50 flex items-center space-x-1"
            >
              <Star className="h-4 w-4" />
              <span>Stories</span>
            </Button>

            {/* Support Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 hover:bg-muted/50">
                  <span>Support</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 glass-card border-border/50">
                {supportOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.href} 
                    onClick={() => handleNavigation(option.href)}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50"
                  >
                    <option.icon className="h-4 w-4 text-primary" />
                    <span>{option.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Blog */}
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/blog')}
              className="hover:bg-muted/50"
            >
              Blog
            </Button>
          </nav>

          {/* Auth & CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/login')}
              className="hover:bg-muted/50 hidden sm:flex"
            >
              Sign In
            </Button>
            
            {/* Persistent CTA Button */}
            <Button 
              onClick={() => handleNavigation('/signup')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Free
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              {/* Product Features */}
              <div className="space-y-2">
                <div className="font-medium text-sm text-muted-foreground px-3">PRODUCT</div>
                {productFeatures.map((feature) => (
                  <Button
                    key={feature.href}
                    variant="ghost"
                    onClick={() => handleNavigation(feature.href)}
                    className="w-full justify-start space-x-3"
                  >
                    <feature.icon className="h-4 w-4" />
                    <span>{feature.name}</span>
                  </Button>
                ))}
              </div>

              {/* Other Nav Items */}
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/pricing')}
                className="justify-start space-x-3"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pricing</span>
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/demo')}
                className="justify-start space-x-3"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Demo</span>
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/testimonials')}
                className="justify-start space-x-3"
              >
                <Star className="h-4 w-4" />
                <span>Customer Stories</span>
              </Button>

              {/* Support */}
              <div className="space-y-2">
                <div className="font-medium text-sm text-muted-foreground px-3">SUPPORT</div>
                {supportOptions.map((option) => (
                  <Button
                    key={option.href}
                    variant="ghost"
                    onClick={() => handleNavigation(option.href)}
                    className="w-full justify-start space-x-3"
                  >
                    <option.icon className="h-4 w-4" />
                    <span>{option.name}</span>
                  </Button>
                ))}
              </div>

              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/blog')}
                className="justify-start space-x-3"
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Button>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-border/50 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigation('/login')}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => handleNavigation('/signup')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold"
                >
                  Get Started Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation; 