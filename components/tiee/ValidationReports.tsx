
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, FileText, Download } from 'lucide-react';
import { AnomalyDetectionEngine } from '@/lib/anomaly-detection/engine';

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
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedRule, setSelectedRule] = useState<string>('all');
  const [engine] = useState(() => new AnomalyDetectionEngine());
  const [ruleMetrics, setRuleMetrics] = useState<RuleMetrics[]>([]);
  const [trends, setTrends] = useState<ValidationTrend[]>([]);

  useEffect(() => {
    generateReportData();
  }, [timeframe]);

  const generateReportData = () => {
    const rules = engine.getRules();
    
    // Generate mock metrics for each rule
    const metrics: RuleMetrics[] = rules.map(rule => ({
      ruleId: rule.id,
      ruleName: rule.name,
      triggers: Math.floor(Math.random() * 100) + 10,
      resolved: Math.floor(Math.random() * 80) + 5,
      accuracy: Math.floor(Math.random() * 20) + 80,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    }));
    
    setRuleMetrics(metrics);
    
    // Generate trend data
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const trendData: ValidationTrend[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      const errors = Math.floor(Math.random() * 15) + 2;
      const warnings = Math.floor(Math.random() * 25) + 5;
      
      return {
        date: date.toLocaleDateString(),
        errors,
        warnings,
        total: errors + warnings
      };
    });
    
    setTrends(trendData);
  };

  const exportReport = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            Validation Reports & Analytics
          </h2>
          <p className="text-muted-foreground">Detailed analysis of rule performance and trends</p>
        </div>
        <div className="flex gap-2">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {ruleMetrics.reduce((sum, r) => sum + Math.floor(r.triggers * 0.3), 0)}
                </p>
                <p className="text-sm text-red-600/80">Total Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {ruleMetrics.reduce((sum, r) => sum + Math.floor(r.triggers * 0.7), 0)}
                </p>
                <p className="text-sm text-yellow-600/80">Total Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(ruleMetrics.reduce((sum, r) => sum + r.accuracy, 0) / ruleMetrics.length)}%
                </p>
                <p className="text-sm text-green-600/80">Avg Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {ruleMetrics.reduce((sum, r) => sum + r.resolved, 0)}
                </p>
                <p className="text-sm text-blue-600/80">Issues Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Validation Trends</TabsTrigger>
          <TabsTrigger value="rules">Rule Performance</TabsTrigger>
          <TabsTrigger value="distribution">Issue Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Activity Over Time</CardTitle>
              <CardDescription>Trend analysis of errors and warnings detected</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} name="Errors" />
                  <Line type="monotone" dataKey="warnings" stroke="#f59e0b" strokeWidth={2} name="Warnings" />
                  <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} name="Total Issues" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Rule Performance Analysis</CardTitle>
                  <CardDescription>Individual rule trigger rates and accuracy</CardDescription>
                </div>
                <Select value={selectedRule} onValueChange={setSelectedRule}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rules</SelectItem>
                    {ruleMetrics.map(rule => (
                      <SelectItem key={rule.ruleId} value={rule.ruleId}>
                        {rule.ruleId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ruleId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="triggers" fill="#3b82f6" name="Triggers" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rule Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMetrics.map((rule, index) => (
                  <div key={rule.ruleId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{rule.ruleId}</Badge>
                        <span className="font-medium">{rule.ruleName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.triggers} triggers • {rule.resolved} resolved • {rule.accuracy}% accuracy
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.trend === 'up' ? 'destructive' : rule.trend === 'down' ? 'default' : 'secondary'}>
                        {rule.trend === 'up' ? '↗' : rule.trend === 'down' ? '↘' : '→'} {rule.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Distribution by Rule Type</CardTitle>
              <CardDescription>Breakdown of validation issues by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ruleMetrics.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ ruleId, percent }) => `${ruleId} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="triggers"
                    >
                      {ruleMetrics.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Top Validation Issues</h4>
                  {ruleMetrics
                    .sort((a, b) => b.triggers - a.triggers)
                    .slice(0, 6)
                    .map((rule, index) => (
                      <div key={rule.ruleId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-sm">{rule.ruleId}</span>
                        </div>
                        <span className="text-sm font-medium">{rule.triggers}</span>
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
