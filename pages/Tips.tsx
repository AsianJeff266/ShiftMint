
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TipForm } from '@/components/TipForm';
import { AutomaticTipCalculator } from '@/components/AutomaticTipCalculator';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, Calculator } from 'lucide-react';

export const Tips = () => {
  const { user } = useAuth();
  const [recentTips, setRecentTips] = useState([
    { id: '1', amount: 45.00, type: 'cash', employee: 'John Smith', time: '2 minutes ago' },
    { id: '2', amount: 32.50, type: 'credit', employee: 'Sarah Johnson', time: '15 minutes ago' },
    { id: '3', amount: 28.75, type: 'credit', employee: 'Mike Chen', time: '1 hour ago' },
  ]);

  const handleTipRecorded = (tip: any) => {
    setRecentTips(prev => [tip, ...prev.slice(0, 4)]);
  };

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
                {recentTips.map((tip) => (
                  <div key={tip.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">${tip.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{tip.employee}</p>
                      <p className="text-xs text-muted-foreground capitalize">{tip.type} tip</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{tip.time}</p>
                    </div>
                  </div>
                ))}
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
            <div className="text-2xl font-bold">$284.50</div>
            <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Tips</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$156.25</div>
            <p className="text-xs text-muted-foreground">54.9% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Tips</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$128.25</div>
            <p className="text-xs text-muted-foreground">45.1% of total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
