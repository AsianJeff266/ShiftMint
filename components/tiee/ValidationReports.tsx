
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, FileText, Download, AlertCircle } from 'lucide-react';
import { AnomalyDetectionEngine } from '@/lib/anomaly-detection/engine';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RuleMetrics {
  ruleId: string;
  ruleName: string;
  triggers: number;
  resolved: number;
  accuracy: number;
  trend: 'up' | 'down' | 'stable';
}

interface ValidationTrend {
  date: string;
  errors: number;
  warnings: number;
  total: number;
}

export const ValidationReports: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedRule, setSelectedRule] = useState<string>('all');
  const [engine] = useState(() => new AnomalyDetectionEngine());
  const [ruleMetrics, setRuleMetrics] = useState<RuleMetrics[]>([]);
  const [trends, setTrends] = useState<ValidationTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [timeframe, user?.businessId]);

  const loadReportData = async () => {
    if (!user?.businessId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Try to fetch real validation data from the database
      const { data: flagData, error } = await supabase
        .from('flag_events')
        .select('*')
        .eq('business_id', user.businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flag data:', error);
        setHasData(false);
        setRuleMetrics([]);
        setTrends([]);
        return;
      }

      if (!flagData || flagData.length === 0) {
        setHasData(false);
        setRuleMetrics([]);
        setTrends([]);
        return;
      }

      // Process real data
      setHasData(true);
      const rules = engine.getRules();
      
      // Generate metrics from actual data
      const metrics: RuleMetrics[] = rules.map(rule => {
        const ruleFlagEvents = flagData.filter(flag => flag.rule_id === rule.id);
        const resolvedEvents = ruleFlagEvents.filter(flag => flag.resolved_ts);
        
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          triggers: ruleFlagEvents.length,
          resolved: resolvedEvents.length,
          accuracy: ruleFlagEvents.length > 0 ? Math.round((resolvedEvents.length / ruleFlagEvents.length) * 100) : 0,
          trend: 'stable' as const
        };
      });
      
      setRuleMetrics(metrics);
      
      // Generate trend data from actual events
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const trendData: ValidationTrend[] = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toLocaleDateString();
        
        const dayEvents = flagData.filter(flag => {
          const flagDate = new Date(flag.created_at).toLocaleDateString();
          return flagDate === dateStr;
        });
        
        const errors = dayEvents.filter(e => e.severity === 'ERROR').length;
        const warnings = dayEvents.filter(e => e.severity === 'WARN').length;
        
        return {
          date: dateStr,
          errors,
          warnings,
          total: errors + warnings
        };
      });
      
      setTrends(trendData);
    } catch (error) {
      console.error('Error loading report data:', error);
      setHasData(false);
      setRuleMetrics([]);
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!hasData) {
      return;
    }

    const csvContent = [
      ['Rule ID', 'Rule Name', 'Triggers', 'Resolved', 'Accuracy'],
      ...ruleMetrics.map(rule => [
        rule.ruleId,
        rule.ruleName,
        rule.triggers.toString(),
        rule.resolved.toString(),
        `${rule.accuracy}%`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${timeframe}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredMetrics = selectedRule === 'all' 
    ? ruleMetrics 
    : ruleMetrics.filter(m => m.ruleId === selectedRule);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Validation Reports & Analytics
            </h2>
            <p className="text-muted-foreground">
              Detailed analysis of rule performance and trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={(value: '7d' | '30d' | '90d') => setTimeframe(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportReport} disabled={!hasData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Validation Data Available</h3>
            <p className="text-muted-foreground text-center mb-6">
              There's no validation data to display for the selected time period.<br />
              Run validation checks to generate analytics and reports.
            </p>
            <Button onClick={loadReportData}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rest of the component with actual data display
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Validation Reports & Analytics
          </h2>
          <p className="text-muted-foreground">
            Detailed analysis of rule performance and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={(value: '7d' | '30d' | '90d') => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMetrics.map((rule) => (
          <Card key={rule.ruleId}>
            <CardHeader>
              <CardTitle className="text-sm">{rule.ruleName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Triggers</span>
                  <span className="font-medium">{rule.triggers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <span className="font-medium">{rule.resolved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="font-medium">{rule.accuracy}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Validation Trends</TabsTrigger>
          <TabsTrigger value="performance">Rule Performance</TabsTrigger>
          <TabsTrigger value="distribution">Issue Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Activity Over Time</CardTitle>
              <CardDescription>
                Trend analysis of errors and warnings detected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="warnings" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule Performance Analysis</CardTitle>
              <CardDescription>
                Individual rule trigger rates and accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ruleId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="triggers" fill="#8884d8" />
                  <Bar dataKey="resolved" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Distribution by Rule Type</CardTitle>
              <CardDescription>
                Breakdown of validation issues by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredMetrics.map(m => ({ name: m.ruleName, value: m.triggers }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {filteredMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Top Validation Issues</h4>
                  {filteredMetrics
                    .sort((a, b) => b.triggers - a.triggers)
                    .slice(0, 6)
                    .map((rule, index) => (
                      <div key={rule.ruleId} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{rule.ruleName}</span>
                        </div>
                        <Badge variant="outline">{rule.triggers}</Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
