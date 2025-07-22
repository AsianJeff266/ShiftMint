
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TipForm } from '@/components/TipForm';
import { AutomaticTipCalculator } from '@/components/AutomaticTipCalculator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Calculator } from 'lucide-react';

interface TipEntry {
  id: string;
  amount: number;
  type: 'cash' | 'credit';
  employee: string;
  time: string;
  timestamp: string;
}

interface TipStats {
  todaysTips: number;
  cashTips: number;
  creditTips: number;
  yesterdaysTips: number;
}

export const Tips = () => {
  const { user } = useAuth();
  const [recentTips, setRecentTips] = useState<TipEntry[]>([]);
  const [tipStats, setTipStats] = useState<TipStats>({
    todaysTips: 0,
    cashTips: 0,
    creditTips: 0,
    yesterdaysTips: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTipData = async () => {
      if (!user?.businessId) return;

      try {
        setLoading(true);
        
        // Get today's date range
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        // Get yesterday's date range
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
        const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

        // Fetch today's tips
        const { data: todayTips, error: todayError } = await supabase
          .from('tip_entries')
          .select('amount, tip_type, timestamp, employees!inner(first_name, last_name)')
          .eq('business_id', user.businessId)
          .gte('timestamp', startOfDay.toISOString())
          .lte('timestamp', endOfDay.toISOString());

        // Fetch yesterday's tips
        const { data: yesterdayTips, error: yesterdayError } = await supabase
          .from('tip_entries')
          .select('amount')
          .eq('business_id', user.businessId)
          .gte('timestamp', startOfYesterday.toISOString())
          .lte('timestamp', endOfYesterday.toISOString());

        // Fetch recent tips (last 10)
        const { data: recentTipData, error: recentError } = await supabase
          .from('tip_entries')
          .select('id, amount, tip_type, timestamp, employees!inner(first_name, last_name)')
          .eq('business_id', user.businessId)
          .order('timestamp', { ascending: false })
          .limit(10);

        if (todayError || yesterdayError || recentError) {
          console.error('Error fetching tips:', todayError || yesterdayError || recentError);
        }

        // Process data
        const todayTipsTotal = todayTips?.reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
        const yesterdayTipsTotal = yesterdayTips?.reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
        const cashTipsTotal = todayTips?.filter(tip => tip.tip_type === 'cash').reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
        const creditTipsTotal = todayTips?.filter(tip => tip.tip_type === 'credit').reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;

        setTipStats({
          todaysTips: todayTipsTotal,
          cashTips: cashTipsTotal,
          creditTips: creditTipsTotal,
          yesterdaysTips: yesterdayTipsTotal,
        });

        // Process recent tips
        const processedRecentTips: TipEntry[] = recentTipData?.map(tip => ({
          id: tip.id,
          amount: tip.amount || 0,
          type: tip.tip_type as 'cash' | 'credit',
          employee: `${tip.employees?.first_name || ''} ${tip.employees?.last_name || ''}`.trim(),
          time: getTimeAgo(new Date(tip.timestamp)),
          timestamp: tip.timestamp,
        })) || [];

        setRecentTips(processedRecentTips);

      } catch (error) {
        console.error('Error fetching tip data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipData();
  }, [user?.businessId]);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleTipRecorded = (tip: any) => {
    // Add new tip to recent tips
    const newTip: TipEntry = {
      id: tip.id || Date.now().toString(),
      amount: tip.amount || 0,
      type: tip.type || 'cash',
      employee: tip.employee || 'Unknown',
      time: 'Just now',
      timestamp: new Date().toISOString(),
    };
    
    setRecentTips(prev => [newTip, ...prev.slice(0, 9)]);
    
    // Update stats
    setTipStats(prev => ({
      ...prev,
      todaysTips: prev.todaysTips + newTip.amount,
      cashTips: newTip.type === 'cash' ? prev.cashTips + newTip.amount : prev.cashTips,
      creditTips: newTip.type === 'credit' ? prev.creditTips + newTip.amount : prev.creditTips,
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const calculatePercentageOfTotal = (part: number, total: number): string => {
    if (total === 0) return '0%';
    return `${((part / total) * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Loading tip data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Record Tips</h1>
          <p className="text-muted-foreground mt-1">
            Track cash tips and calculate electronic tip distributions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tip Recording Forms */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Record Tips</CardTitle>
              <CardDescription>
                Choose between manual cash tip entry or automatic electronic tip calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="automatic" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Auto Calculate
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="mt-6">
                  <TipForm onTipRecorded={handleTipRecorded} />
                </TabsContent>
                
                <TabsContent value="automatic" className="mt-6">
                  <AutomaticTipCalculator onTipsCalculated={handleTipRecorded} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tips */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
              <CardDescription>
                Latest tip entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTips.length > 0 ? (
                  recentTips.map((tip) => (
                    <div key={tip.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{formatCurrency(tip.amount)}</p>
                        <p className="text-sm text-muted-foreground">{tip.employee}</p>
                        <p className="text-xs text-muted-foreground capitalize">{tip.type} tip</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{tip.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tips recorded yet</p>
                    <p className="text-sm">Start recording tips to see them here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tips</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(tipStats.todaysTips)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageChange(tipStats.todaysTips, tipStats.yesterdaysTips)} from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Tips</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(tipStats.cashTips)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageOfTotal(tipStats.cashTips, tipStats.todaysTips)} of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Tips</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(tipStats.creditTips)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageOfTotal(tipStats.creditTips, tipStats.todaysTips)} of total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
