
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DollarSign, GripVertical, Plus, Trash2 } from 'lucide-react';

interface TipPoolRule {
  id: string;
  role: string;
  percentage: number;
}

interface TippingSettingsProps {
  data: any;
  onChange: (data: any) => void;
}

export const TippingSettings: React.FC<TippingSettingsProps> = ({ data, onChange }) => {
  const [tipStyle, setTipStyle] = useState(data.tipStyle || 'pos');
  const [enableCashTips, setEnableCashTips] = useState(data.enableCashTips || false);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [tipPoolRules, setTipPoolRules] = useState<TipPoolRule[]>(data.tipPoolRules || [
    { id: '1', role: 'Server', percentage: 60 },
    { id: '2', role: 'Kitchen', percentage: 25 },
    { id: '3', role: 'Host', percentage: 15 },
  ]);
  const [advancedPooling, setAdvancedPooling] = useState(data.advancedPooling || '{}');

  const updateData = (updates: any) => {
    const newData = { ...data, ...updates };
    onChange(newData);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tipPoolRules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTipPoolRules(items);
    updateData({ tipPoolRules: items });
  };

  const addTipPoolRule = () => {
    const newRule: TipPoolRule = {
      id: Date.now().toString(),
      role: 'New Role',
      percentage: 0
    };
    const newRules = [...tipPoolRules, newRule];
    setTipPoolRules(newRules);
    updateData({ tipPoolRules: newRules });
  };

  const removeTipPoolRule = (id: string) => {
    const newRules = tipPoolRules.filter(rule => rule.id !== id);
    setTipPoolRules(newRules);
    updateData({ tipPoolRules: newRules });
  };

  const updateTipPoolRule = (id: string, field: 'role' | 'percentage', value: string | number) => {
    const newRules = tipPoolRules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    );
    setTipPoolRules(newRules);
    updateData({ tipPoolRules: newRules });
  };

  const totalPercentage = tipPoolRules.reduce((sum, rule) => sum + rule.percentage, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Tipping & Pooling Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tip Style Selector */}
          <div className="space-y-2">
            <Label htmlFor="tip-style">Tip Style</Label>
            <Select value={tipStyle} onValueChange={(value) => {
              setTipStyle(value);
              updateData({ tipStyle: value });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select tip collection method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pos">POS Integration</SelectItem>
                <SelectItem value="hourly">Hourly Declaration</SelectItem>
                <SelectItem value="table">Table-Based</SelectItem>
                <SelectItem value="hybrid">Hybrid Method</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enable Cash Tips */}
          <div className="flex items-center space-x-2">
            <Switch
              id="cash-tips"
              checked={enableCashTips}
              onCheckedChange={(checked) => {
                setEnableCashTips(checked);
                updateData({ enableCashTips: checked });
              }}
            />
            <Label htmlFor="cash-tips">Enable Cash Tip Entry</Label>
          </div>
        </CardContent>
      </Card>

      {/* Tip Pool Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tip Pool Distribution</CardTitle>
            <Badge variant={totalPercentage === 100 ? "default" : "destructive"}>
              {totalPercentage}% Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tip-pool-rules">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {tipPoolRules.map((rule, index) => (
                    <Draggable key={rule.id} draggableId={rule.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-3 p-3 border rounded-lg bg-white"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>
                          <Input
                            value={rule.role}
                            onChange={(e) => updateTipPoolRule(rule.id, 'role', e.target.value)}
                            placeholder="Role name"
                            className="flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={rule.percentage}
                              onChange={(e) => updateTipPoolRule(rule.id, 'percentage', parseInt(e.target.value) || 0)}
                              className="w-20"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTipPoolRule(rule.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            variant="outline"
            onClick={addTipPoolRule}
            className="w-full mt-3 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Role
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Pooling Logic */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Advanced Pooling Logic</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJsonEditor(!showJsonEditor)}
            >
              {showJsonEditor ? 'Hide' : 'Show'} JSON Editor
            </Button>
          </div>
        </CardHeader>
        {showJsonEditor && (
          <CardContent>
            <Textarea
              value={advancedPooling}
              onChange={(e) => {
                setAdvancedPooling(e.target.value);
                updateData({ advancedPooling: e.target.value });
              }}
              placeholder="Enter advanced pooling logic as JSON..."
              rows={6}
              className="font-mono text-sm"
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};
