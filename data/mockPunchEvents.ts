
export interface PunchEvent {
  id: string;
  employee_id: string;
  location_id: string;
  job_code: string;
  punch_type: 'IN' | 'OUT' | 'BREAK_OUT' | 'BREAK_IN';
  ts_utc: string;
  source: string;
  raw_payload: any;
}

export const mockPunchEvents: PunchEvent[] = [
  {
    id: '1',
    employee_id: '1',
    location_id: 'loc_1',
    job_code: 'server',
    punch_type: 'IN',
    ts_utc: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: 'kiosk',
    raw_payload: { device_id: 'kiosk_001' }
  },
  {
    id: '2',
    employee_id: '1',
    location_id: 'loc_1',
    job_code: 'server',
    punch_type: 'OUT',
    ts_utc: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source: 'kiosk',
    raw_payload: { device_id: 'kiosk_001' }
  },
  {
    id: '3',
    employee_id: '2',
    location_id: 'loc_1',
    job_code: 'bartender',
    punch_type: 'IN',
    ts_utc: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'mobile',
    raw_payload: { device_id: 'mobile_app' }
  }
];
