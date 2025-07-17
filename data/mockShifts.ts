
export interface Shift {
  id: string;
  employee_id: string;
  location_id: string;
  job_code: string;
  start_ts: string;
  end_ts?: string;
  duration_min?: number;
  status: 'OPEN' | 'CLOSED';
}

export const mockShifts: Shift[] = [
  {
    id: '1',
    employee_id: '1',
    location_id: 'loc_1',
    job_code: 'server',
    start_ts: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    end_ts: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration_min: 210,
    status: 'CLOSED'
  },
  {
    id: '2',
    employee_id: '2',
    location_id: 'loc_1',
    job_code: 'bartender',
    start_ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'OPEN'
  },
  {
    id: '3',
    employee_id: '3',
    location_id: 'loc_1',
    job_code: 'host',
    start_ts: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    end_ts: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration_min: 300,
    status: 'CLOSED'
  }
];
