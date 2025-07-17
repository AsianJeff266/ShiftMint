import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Restaurant Manager",
      company: "Bella Vista Restaurant",
      content: "ShiftMint has transformed how we handle payroll. The tip tracking is incredibly accurate and saves us hours every week.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Owner",
      company: "Downtown Café",
      content: "The compliance features give me peace of mind. I know we're always following the latest regulations.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Director",
      company: "Coastal Restaurants Group",
      content: "Managing payroll across multiple locations used to be a nightmare. ShiftMint made it seamless.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold">
            What Our <span className="text-gradient-primary">Customers</span> Say
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how ShiftMint is helping restaurants streamline their payroll
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card border-border/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 