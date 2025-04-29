'use client';

import { useState } from 'react';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { PenBox, Plus, Tag, Clock, CheckCircle, XCircle } from 'lucide-react';

interface NFCTag {
  id: string;
  tag_id: string;
  location: string;
  assignedTo: string;
  status: 'active' | 'inactive';
  lastScan: string;
}

interface AttendanceRecord {
  id: string;
  employeeName: string;
  tagId: string;
  location: string;
  time: string;
  type: 'check-in' | 'check-out';
  status: 'on-time' | 'late' | 'early';
}

// Demo data
const demoTags: NFCTag[] = [
  {
    id: '1',
    tag_id: 'NFC-001',
    location: 'Main Entrance',
    assignedTo: 'Building A',
    status: 'active',
    lastScan: '2025-04-29T08:30:00',
  },
  {
    id: '2',
    tag_id: 'NFC-002',
    location: 'Garage Entry',
    assignedTo: 'Vehicle Bay',
    status: 'active',
    lastScan: '2025-04-29T07:45:00',
  },
  {
    id: '3',
    tag_id: 'NFC-003',
    location: 'Staff Room',
    assignedTo: 'Break Area',
    status: 'inactive',
    lastScan: '2025-04-28T17:15:00',
  },
];

const demoRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    tagId: 'NFC-001',
    location: 'Main Entrance',
    time: '2025-04-29T08:30:00',
    type: 'check-in',
    status: 'on-time',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    tagId: 'NFC-002',
    location: 'Garage Entry',
    time: '2025-04-29T08:45:00',
    type: 'check-in',
    status: 'late',
  },
  {
    id: '3',
    employeeName: 'Mike Johnson',
    tagId: 'NFC-001',
    location: 'Main Entrance',
    time: '2025-04-29T17:00:00',
    type: 'check-out',
    status: 'on-time',
  },
];

export default function NFCPage() {
  const [showAddTag, setShowAddTag] = useState(false);
  const [tags, setTags] = useState<NFCTag[]>(demoTags);
  const [records] = useState<AttendanceRecord[]>(demoRecords);

  const [newTag, setNewTag] = useState<Partial<NFCTag>>({
    tag_id: '',
    location: '',
    assignedTo: '',
    status: 'active',
  });

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.tag_id && newTag.location && newTag.assignedTo) {
      setTags(prev => [...prev, {
        ...newTag as NFCTag,
        id: Math.random().toString(36).substr(2, 9),
        lastScan: new Date().toISOString(),
      }]);
      setShowAddTag(false);
      setNewTag({
        tag_id: '',
        location: '',
        assignedTo: '',
        status: 'active',
      });
    }
  };

  const toggleTagStatus = (id: string) => {
    setTags(prev => prev.map(tag =>
      tag.id === id
        ? { ...tag, status: tag.status === 'active' ? 'inactive' : 'active' }
        : tag
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <ThemeHeader
        description="Manage NFC tags and view attendance records"
        action={
          <ThemeButton
            onClick={() => setShowAddTag(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add NFC Tag
          </ThemeButton>
        }
      >
        NFC Attendance Management
      </ThemeHeader>

      {/* NFC Tags Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tags.map(tag => (
          <ThemeCard
            key={tag.id}
            title={tag.tag_id}
            icon={<Tag className="h-5 w-5" />}
            action={
              <ThemeButton
                size="sm"
                variant={tag.status === 'active' ? 'ghost' : 'outline'}
                onClick={() => toggleTagStatus(tag.id)}
              >
                {tag.status === 'active' ? 'Deactivate' : 'Activate'}
              </ThemeButton>
            }
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Location: {tag.location}
              </p>
              <p className="text-sm text-muted-foreground">
                Assigned To: {tag.assignedTo}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Last Scan: {new Date(tag.lastScan).toLocaleString()}
              </div>
              <div className={`flex items-center gap-2 text-sm ${
                tag.status === 'active' ? 'text-green-500' : 'text-red-500'
              }`}>
                {tag.status === 'active' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Status: {tag.status.charAt(0).toUpperCase() + tag.status.slice(1)}
              </div>
            </div>
          </ThemeCard>
        ))}
      </div>

      {/* Recent Attendance Records */}
      <ThemeCard
        title="Recent Attendance Records"
        description="Latest check-ins and check-outs"
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3">Employee</th>
                <th className="text-left p-3">Tag ID</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="p-3">{record.employeeName}</td>
                  <td className="p-3">{record.tagId}</td>
                  <td className="p-3">{record.location}</td>
                  <td className="p-3">{record.employeeName}</td>
                  <td className="p-3">{record.tagId}</td>
                  <td className="p-3">{record.location}</td>
                  <td className="p-3">{new Date(record.time).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.type === 'check-in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.status === 'on-time'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'late'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ThemeCard>

      {/* Add Tag Dialog */}
      {showAddTag && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ThemeCard title="Add NFC Tag">
              <form onSubmit={handleAddTag} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tag ID</label>
                  <input
                    type="text"
                    value={newTag.tag_id}
                    onChange={(e) => setNewTag(prev => ({ ...prev, tag_id: e.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newTag.location}
                    onChange={(e) => setNewTag(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={newTag.assignedTo}
                    onChange={(e) => setNewTag(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <ThemeButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddTag(false)}
                  >
                    Cancel
                  </ThemeButton>
                  <ThemeButton type="submit">
                    Add Tag
                  </ThemeButton>
                </div>
              </form>
            </ThemeCard>
          </div>
        </div>
      )}
    </div>
  );
}
