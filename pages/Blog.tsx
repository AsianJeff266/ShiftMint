import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: "Understanding FLSA Compliance for Tipped Employees",
      excerpt: "A comprehensive guide to federal labor standards for restaurants and hospitality businesses.",
      author: "Legal Team",
      date: "January 15, 2025",
      category: "Compliance"
    },
    {
      title: "Tip Pooling Best Practices",
      excerpt: "How to implement fair and legal tip pooling systems in your restaurant.",
      author: "Operations Team",
      date: "January 10, 2025",
      category: "Tips"
    },
    {
      title: "Payroll Automation: The Future of Restaurant Management",
      excerpt: "Discover how automation can streamline your payroll processes and reduce errors.",
      author: "Product Team",
      date: "January 5, 2025",
      category: "Technology"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold">
            ShiftMint <span className="text-gradient-primary">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and best practices for restaurant payroll management
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card key={index} className="glass-card border-border/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog; 