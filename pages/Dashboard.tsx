
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  todaysTips: number;
  hoursWorked: number;
  activeEmployees: number;
  weeklyAverage: number;
  employeesOnShift: number;
  hasActiveShifts: boolean;
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const { employees, loading: dataLoading } = useData();
  const [stats, setStats] = useState<DashboardStats>({
    todaysTips: 0,
    hoursWorked: 0,
    activeEmployees: 0,
    weeklyAverage: 0,
    employeesOnShift: 0,
    hasActiveShifts: false,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.businessId) return;

      try {
        setLoading(true);
        
        // Get today's date range
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        // Get week range
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Fetch today's tips
        const { data: todayTips, error: tipsError } = await supabase
          .from('tip_entries')
          .select('amount')
          .eq('business_id', user.businessId)
          .gte('timestamp', startOfDay.toISOString())
          .lte('timestamp', endOfDay.toISOString());

        // Fetch today's shifts
        const { data: todayShifts, error: shiftsError } = await supabase
          .from('shifts')
          .select('duration_minutes, status')
          .eq('business_id', user.businessId)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString());

        // Fetch active shifts
        const { data: activeShifts, error: activeShiftsError } = await supabase
          .from('shifts')
          .select('employee_id')
          .eq('business_id', user.businessId)
          .eq('status', 'active');

        // Fetch weekly tips for average
        const { data: weeklyTips, error: weeklyTipsError } = await supabase
          .from('tip_entries')
          .select('amount')
          .eq('business_id', user.businessId)
          .gte('timestamp', weekAgo.toISOString())
          .lte('timestamp', endOfDay.toISOString());

        // Fetch recent activity
        const { data: recentTips, error: recentTipsError } = await supabase
          .from('tip_entries')
          .select('amount, timestamp, tip_type')
          .eq('business_id', user.businessId)
          .order('timestamp', { ascending: false })
          .limit(5);

        const { data: recentShifts, error: recentShiftsError } = await supabase
          .from('shifts')
          .select('start_time, end_time, employees!inner(first_name, last_name)')
          .eq('business_id', user.businessId)
          .order('start_time', { ascending: false })
          .limit(5);

        // Process data
        const todaysTipsTotal = todayTips?.reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
        const todaysHours = todayShifts?.reduce((sum, shift) => sum + (shift.duration_minutes || 0), 0) || 0;
        const activeEmployeesCount = employees?.filter(emp => emp.status === 'active').length || 0;
        const weeklyTipsTotal = weeklyTips?.reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
        const weeklyAvg = weeklyTipsTotal / 7;
        const employeesOnShiftCount = activeShifts?.length || 0;

        setStats({
          todaysTips: todaysTipsTotal,
          hoursWorked: todaysHours / 60, // Convert to hours
          activeEmployees: activeEmployeesCount,
          weeklyAverage: weeklyAvg,
          employeesOnShift: employeesOnShiftCount,
          hasActiveShifts: employeesOnShiftCount > 0,
        });

        // Process recent activity
        const activities: ActivityItem[] = [];
        
        if (recentTips) {
          recentTips.forEach(tip => {
            const timeAgo = getTimeAgo(new Date(tip.timestamp));
            activities.push({
              type: 'tip',
              message: `${tip.tip_type === 'cash' ? 'Cash' : 'Credit'} tip recorded: $${tip.amount.toFixed(2)}`,
              time: timeAgo,
            });
          });
        }

        if (recentShifts) {
          recentShifts.forEach(shift => {
            const timeAgo = getTimeAgo(new Date(shift.start_time));
            const employeeName = `${shift.employees?.first_name || ''} ${shift.employees?.last_name || ''}`.trim();
            activities.push({
              type: 'shift',
              message: shift.end_time ? `${employeeName} completed shift` : `${employeeName} clocked in`,
              time: timeAgo,
            });
          });
        }

        // Sort activities by timestamp and take the most recent
        setRecentActivity(activities.slice(0, 4));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.businessId, employees]);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatHours = (hours: number): string => {
    return `${hours.toFixed(1)}h`;
  };

  const formatPercentage = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const dashboardStats = [
    {
      title: 'Today\'s Tips',
      value: formatCurrency(stats.todaysTips),
      change: stats.todaysTips > 0 ? '+' + formatCurrency(stats.todaysTips) : '$0.00',
      icon: DollarSign,
      color: 'text-accent',
    },
    {
      title: 'Hours Worked',
      value: formatHours(stats.hoursWorked),
      change: stats.hasActiveShifts ? 'Active shifts' : 'No active shifts',
      icon: Clock,
      color: 'text-primary',
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees.toString(),
      change: stats.employeesOnShift > 0 ? `${stats.employeesOnShift} on shift` : 'No one on shift',
      icon: Users,
      color: 'text-muted-foreground',
    },
    {
      title: 'Weekly Average',
      value: formatCurrency(stats.weeklyAverage),
      change: stats.weeklyAverage > 0 ? 'Daily average' : 'No data',
      icon: TrendingUp,
      color: 'text-accent',
    },
  ];

  if (loading || dataLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, {user?.firstName || 'User'}!
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
        {dashboardStats.map((stat) => {
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity</p>
                  <p className="text-sm">Start by adding employees and recording shifts</p>
                </div>
              )}
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
                  <Link to="/settings">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Settings
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
              Business Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent/80 text-sm">
              {stats.activeEmployees > 0 
                ? `You have ${stats.activeEmployees} active employees${stats.employeesOnShift > 0 ? ` with ${stats.employeesOnShift} currently on shift` : ''}.`
                : 'Start by adding employees to your team to begin tracking tips and shifts.'
              }
            </p>
            <Button size="sm" className="mt-3" asChild>
              <Link to="/employees">
                {stats.activeEmployees > 0 ? 'Manage Employees' : 'Add Employees'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
