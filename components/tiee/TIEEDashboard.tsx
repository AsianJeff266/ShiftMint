import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, Shield, Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FlagEvent, TIEEShift } from '@/types/tiee';
import { TIEEValidator } from '@/lib/tiee/validator';
import { transformFlagEvent, transformShift, transformPunchEvent } from '@/lib/tiee/transforms';
import { ValidationReports } from './ValidationReports';
import { AlgorithmSettings } from './AlgorithmSettings';
import { IntelligentRuleEngine } from './IntelligentRuleEngine';

export const TIEEDashboard: React.FC = () => {
  const [flags, setFlags] = useState<FlagEvent[]>([]);
  const [shifts, setShifts] = useState<TIEEShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedTimeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Calculate time range
      const timeRanges = {
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30
      };
      const hoursBack = timeRanges[selectedTimeRange as keyof typeof timeRanges] || 24;
      const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

      const [flagsResult, shiftsResult] = await Promise.all([
        supabase
          .from('flag_events')
          .select('*')
          .is('resolved_ts', null)
          .gte('created_ts', startTime),
        supabase
          .from('shifts')
          .select('*')
          .gte('start_ts', startTime)
          .order('start_ts', { ascending: false })
          .limit(100)
      ]);

      if (flagsResult.data) {
        setFlags(flagsResult.data.map(transformFlagEvent));
      }
      if (shiftsResult.data) {
        setShifts(shiftsResult.data.map(transformShift));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runValidation = async () => {
    setValidating(true);
    try {
      const validator = new TIEEValidator();
      
      // Get recent punch events based on selected time range
      const timeRanges = {
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30
      };
      const hoursBack = timeRanges[selectedTimeRange as keyof typeof timeRanges] || 24;
      const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

      const { data: punchEvents } = await supabase
        .from('punch_events')
        .select('*')
        .gte('ts_utc', startTime);

      if (punchEvents) {
        const transformedPunchEvents = punchEvents.map(transformPunchEvent);
        
        const result = await validator.validatePunchEvents({
          punchEvents: transformedPunchEvents,
          locationId: '00000000-0000-0000-0000-000000000001' // Default location
        });

        // Insert new flags into database
        for (const flag of result.flags) {
          await supabase.from('flag_events').insert({
            shift_id: flag.shiftId,
            rule_id: flag.ruleId,
            severity: flag.severity,
            description: flag.description
          });
        }

        await loadData();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  const resolveFlag = async (flagId: string, resolution: string) => {
    try {
      await supabase
        .from('flag_events')
        .update({
          resolved_ts: new Date().toISOString(),
          resolution_note: resolution
        })
        .eq('id', flagId);

      await loadData();
    } catch (error) {
      console.error('Failed to resolve flag:', error);
    }
  };

  const filteredFlags = selectedSeverity === 'all' 
    ? flags 
    : flags.filter(f => f.severity === selectedSeverity.toUpperCase());

  const errorFlags = filteredFlags.filter(f => f.severity === 'ERROR');
  const warningFlags = filteredFlags.filter(f => f.severity === 'WARN');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Rules-Based Payroll Validation System
          </h1>
          <p className="text-muted-foreground">Automated payroll validation using deterministic rule algorithms</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={runValidation} disabled={validating} className="w-full sm:w-auto">
            {validating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Validation
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{filteredFlags.length}</div>
            <p className="text-xs text-muted-foreground">Validation anomalies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-destructive">{errorFlags.length}</div>
            <p className="text-xs text-muted-foreground">Critical violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-accent">{warningFlags.length}</div>
            <p className="text-xs text-muted-foreground">Policy deviations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Validated Shifts</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{shifts.length}</div>
            <p className="text-xs text-muted-foreground">In timeframe</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="rules">Rule Engine</TabsTrigger>
          <TabsTrigger value="reports">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl">Validation Issues</CardTitle>
                <CardDescription>Rule-based anomalies requiring attention</CardDescription>
              </div>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Issues</SelectItem>
                  <SelectItem value="error">Errors Only</SelectItem>
                  <SelectItem value="warn">Warnings Only</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {filteredFlags.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {selectedSeverity === 'all' 
                      ? 'No validation issues detected. All payroll data passes rule checks!' 
                      : `No ${selectedSeverity}s found in the selected timeframe.`}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="md:hidden">
                  {/* Mobile Card Layout */}
                  <div className="space-y-3">
                    {filteredFlags.map((flag) => (
                      <Card key={flag.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={flag.severity === 'ERROR' ? 'destructive' : 'secondary'}>
                              {flag.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {flag.createdTs.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="font-mono text-sm text-primary">{flag.ruleId}</div>
                          <div className="text-sm">{flag.description}</div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveFlag(flag.id, 'Resolved - False positive')}
                              className="flex-1"
                            >
                              Mark Resolved
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => resolveFlag(flag.id, 'Fixed manually')}
                              className="flex-1"
                            >
                              Fixed
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Desktop Table Layout */}
              {filteredFlags.length > 0 && (
                <div className="hidden md:block">
                  <ScrollArea className="h-[500px] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Severity</TableHead>
                          <TableHead>Rule</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Detected</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFlags.map((flag) => (
                          <TableRow key={flag.id}>
                            <TableCell>
                              <Badge variant={flag.severity === 'ERROR' ? 'destructive' : 'secondary'}>
                                {flag.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-primary">{flag.ruleId}</TableCell>
                            <TableCell className="max-w-md">{flag.description}</TableCell>
                            <TableCell>
                              {flag.createdTs.toLocaleDateString()} {flag.createdTs.toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => resolveFlag(flag.id, 'Resolved - False positive')}
                                >
                                  Resolve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => resolveFlag(flag.id, 'Fixed manually')}
                                >
                                  Fixed
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Shifts Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Validation Summary</CardTitle>
              <CardDescription>Rule-based validation results for processed shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {shifts.filter(s => s.status === 'APPROVED').length}
                  </div>
                  <div className="text-sm text-accent/80">Valid Shifts</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {shifts.filter(s => s.status === 'FLAGGED').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Flagged Shifts</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {shifts.filter(s => s.status === 'OPEN').length}
                  </div>
                  <div className="text-sm text-primary/80">Pending Review</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <IntelligentRuleEngine />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ValidationReports />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AlgorithmSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
