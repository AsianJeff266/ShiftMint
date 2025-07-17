
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Users, Plus, Edit, Trash2, GripVertical, Shield } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  level: number;
  permissions: {
    shifts: boolean;
    payroll: boolean;
    compliance: boolean;
    reports: boolean;
    settings: boolean;
    users: boolean;
  };
}

interface UserAccessSettingsProps {
  data: any;
  onChange: (data: any) => void;
}

export const UserAccessSettings: React.FC<UserAccessSettingsProps> = ({ data, onChange }) => {
  const [roles, setRoles] = useState<Role[]>(data.roles || [
    {
      id: '1',
      name: 'Administrator',
      level: 1,
      permissions: {
        shifts: true,
        payroll: true,
        compliance: true,
        reports: true,
        settings: true,
        users: true,
      }
    },
    {
      id: '2',
      name: 'Manager',
      level: 2,
      permissions: {
        shifts: true,
        payroll: true,
        compliance: true,
        reports: true,
        settings: false,
        users: false,
      }
    },
    {
      id: '3',
      name: 'Employee',
      level: 3,
      permissions: {
        shifts: true,
        payroll: false,
        compliance: false,
        reports: false,
        settings: false,
        users: false,
      }
    }
  ]);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateData = (updates: any) => {
    const newData = { ...data, ...updates };
    onChange(newData);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(roles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update levels based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      level: index + 1
    }));

    setRoles(updatedItems);
    updateData({ roles: updatedItems });
  };

  const addRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: 'New Role',
      level: roles.length + 1,
      permissions: {
        shifts: false,
        payroll: false,
        compliance: false,
        reports: false,
        settings: false,
        users: false,
      }
    };
    setEditingRole(newRole);
    setIsDialogOpen(true);
  };

  const editRole = (role: Role) => {
    setEditingRole({ ...role });
    setIsDialogOpen(true);
  };

  const saveRole = () => {
    if (!editingRole) return;

    const existingIndex = roles.findIndex(r => r.id === editingRole.id);
    let newRoles;

    if (existingIndex >= 0) {
      newRoles = roles.map(r => r.id === editingRole.id ? editingRole : r);
    } else {
      newRoles = [...roles, editingRole];
    }

    setRoles(newRoles);
    updateData({ roles: newRoles });
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const deleteRole = (id: string) => {
    const newRoles = roles.filter(r => r.id !== id);
    setRoles(newRoles);
    updateData({ roles: newRoles });
  };

  const updateRolePermission = (permission: keyof Role['permissions'], value: boolean) => {
    if (!editingRole) return;
    
    setEditingRole({
      ...editingRole,
      permissions: {
        ...editingRole.permissions,
        [permission]: value
      }
    });
  };

  const permissionLabels = {
    shifts: 'Shift Management',
    payroll: 'Payroll Access',
    compliance: 'Compliance Reports',
    reports: 'Analytics & Reports',
    settings: 'System Settings',
    users: 'User Management',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Access & Permissions
            </CardTitle>
            <Button onClick={addRole} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="roles">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role, index) => (
                        <Draggable key={role.id} draggableId={role.id} index={index}>
                          {(provided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <TableCell {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-gray-400" />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  <span className="font-medium">{role.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">Level {role.level}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(role.permissions)
                                    .filter(([_, value]) => value)
                                    .map(([key]) => (
                                      <Badge key={key} variant="secondary" className="text-xs">
                                        {key}
                                      </Badge>
                                    ))
                                  }
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editRole(role)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteRole(role.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRole?.name === 'New Role' ? 'Add New Role' : 'Edit Role'}
            </DialogTitle>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Permissions</Label>
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`permission-${key}`}
                      checked={editingRole.permissions[key as keyof Role['permissions']]}
                      onCheckedChange={(checked) => updateRolePermission(key as keyof Role['permissions'], checked)}
                    />
                    <Label htmlFor={`permission-${key}`} className="text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveRole} className="flex-1">
                  Save Role
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
