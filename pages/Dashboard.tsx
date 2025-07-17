
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Today\'s Tips',
      value: '$284.50',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-accent',
    },
    {
      title: 'Hours Worked',
      value: '6.5h',
      change: 'On shift',
      icon: Clock,
      color: 'text-primary',
    },
    {
      title: 'Active Employees',
      value: '8',
      change: '4 on shift',
      icon: Users,
      color: 'text-muted-foreground',
    },
    {
      title: 'Weekly Average',
      value: '$1,847',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-accent',
    },
  ];

  const recentActivity = [
    { type: 'tip', message: 'Cash tip recorded: $45.00', time: '2 minutes ago' },
    { type: 'shift', message: 'Emily Davis clocked in', time: '15 minutes ago' },
    { type: 'tip', message: 'POS tips imported: $156.75', time: '1 hour ago' },
    { type: 'compliance', message: 'Daily tip report generated', time: '2 hours ago' },
  ];

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Welcome back! Here\'s your business overview.';
      case 'manager':
        return 'Ready to manage today\'s shifts and tips.';
      case 'employee':
        return 'Track your shifts and tips today.';
      default:
        return 'Welcome to ShiftMint!';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {getWelcomeMessage()}
          </p>
        </div>
        <div className="flex gap-3">
          {user?.role === 'employee' && (
            <Button asChild>
              <Link to="/shifts">Clock In/Out</Link>
            </Button>
          )}
          {(user?.role === 'manager' || user?.role === 'admin') && (
            <Button asChild>
              <Link to="/tips">Record Tips</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/tips">
                <DollarSign className="w-4 h-4 mr-2" />
                Record Tips
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/shifts">
                <Clock className="w-4 h-4 mr-2" />
                View Shifts
              </Link>
            </Button>
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/payroll">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Process Payroll
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/compliance">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Compliance Reports
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alert (if applicable) */}
      {(user?.role === 'manager' || user?.role === 'admin') && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-accent flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Compliance Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent/80 text-sm">
              Daily tip reports are due by 11:59 PM. Current status: 6/8 employees reported.
            </p>
            <Button size="sm" className="mt-3" asChild>
              <Link to="/compliance">Review Reports</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
