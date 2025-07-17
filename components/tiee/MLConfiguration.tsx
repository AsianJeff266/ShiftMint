
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Settings, Zap, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'anomaly';
  accuracy: number;
  status: 'active' | 'training' | 'inactive';
  lastTrained: Date;
  parameters: Record<string, any>;
}

export const MLConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<MLModel[]>([
    {
      id: 'pattern-detector',
      name: 'Pattern Detection Model',
      type: 'anomaly',
      accuracy: 92.5,
      status: 'active',
      lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      parameters: {
        threshold: 0.85,
        lookbackDays: 30,
        sensitivity: 0.7
      }
    },
    {
      id: 'risk-classifier',
      name: 'Employee Risk Classifier',
      type: 'classification',
      accuracy: 88.3,
      status: 'active',
      lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      parameters: {
        features: ['punctuality', 'consistency', 'compliance'],
        threshold: 0.75,
        retrainInterval: 7
      }
    },
    {
      id: 'flag-predictor',
      name: 'Flag Prediction Model',
      type: 'regression',
      accuracy: 85.7,
      status: 'training',
      lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      parameters: {
        timeHorizon: 7,
        confidenceLevel: 0.8,
        features: ['historical_flags', 'schedule_changes', 'workload']
      }
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const [autoRetraining, setAutoRetraining] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState([75]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'classification': return <Target className="h-4 w-4" />;
      case 'regression': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const handleModelAction = (modelId: string, action: 'train' | 'deploy' | 'stop') => {
    const modelNames = {
      'pattern-detector': 'Pattern Detection Model',
      'risk-classifier': 'Employee Risk Classifier',
      'flag-predictor': 'Flag Prediction Model'
    };

    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { 
            ...model, 
            status: action === 'train' ? 'training' : action === 'deploy' ? 'active' : 'inactive',
            lastTrained: action === 'train' ? new Date() : model.lastTrained
          }
        : model
    ));

    toast({
      title: `Model ${action === 'deploy' ? 'Deployed' : action === 'train' ? 'Training Started' : 'Stopped'}`,
      description: `${modelNames[modelId as keyof typeof modelNames]} has been ${action === 'deploy' ? 'deployed' : action === 'train' ? 'queued for training' : 'stopped'}`,
    });
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Machine Learning Configuration
          </h2>
          <p className="text-muted-foreground">Configure and manage AI models for time-entry analysis</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Advanced Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Models</CardTitle>
            <CardDescription>Monitor and manage your ML models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        {getModelTypeIcon(model.type)}
                        <h4 className="font-medium">{model.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{model.type} model</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{model.accuracy}% accuracy</p>
                      <p className="text-xs text-muted-foreground">
                        Trained {model.lastTrained.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {model.status !== 'training' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleModelAction(model.id, 'train')}
                        >
                          Retrain
                        </Button>
                      )}
                      {model.status === 'inactive' && (
                        <Button 
                          size="sm"
                          onClick={() => handleModelAction(model.id, 'deploy')}
                        >
                          Deploy
                        </Button>
                      )}
                      {model.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleModelAction(model.id, 'stop')}
                        >
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
            <CardDescription>System-wide ML configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-retrain">Auto-retraining</Label>
              <Switch 
                id="auto-retrain"
                checked={autoRetraining}
                onCheckedChange={setAutoRetraining}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alert Threshold: {alertThreshold[0]}%</Label>
              <Slider
                value={alertThreshold}
                onValueChange={setAlertThreshold}
                max={100}
                min={50}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retrain-frequency">Retrain Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Apply Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Model Details */}
      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>Detailed settings for selected model</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="parameters" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <TabsList>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="parameters" className="space-y-4">
              {selectedModelData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedModelData.parameters).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      {typeof value === 'number' ? (
                        <Input 
                          type="number" 
                          defaultValue={value} 
                          step={key.includes('threshold') || key.includes('sensitivity') ? 0.1 : 1}
                        />
                      ) : Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item, index) => (
                            <Badge key={index} variant="outline">{item}</Badge>
                          ))}
                        </div>
                      ) : (
                        <Input defaultValue={value.toString()} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedModelData?.accuracy || 0}%
                      </p>
                      <p className="text-sm text-green-600/80">Accuracy</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">94.2%</p>
                      <p className="text-sm text-blue-600/80">Precision</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">87.5%</p>
                      <p className="text-sm text-purple-600/80">Recall</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Active Features</h4>
                {['Clock-in patterns', 'Break duration', 'Schedule adherence', 'Historical flags', 'Team interactions'].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{feature}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Weight: {(Math.random() * 0.3 + 0.1).toFixed(2)}
                      </span>
                      <Switch defaultChecked={Math.random() > 0.3} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
