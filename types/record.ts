export interface RecordRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  kyc: string;
  amount: number;
  balance: number;
  date: string;
  method: string;
  type: string;
  subject: string;
  priority: string;
  agent: string;
  role: string;
  history?: string[];
  reason?: string;
  notes?: string[];
}
