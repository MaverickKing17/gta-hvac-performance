
export enum Persona {
  CHLOE = 'Chloe',
  JESSICA = 'Jessica'
}

export interface LeadData {
  name: string;
  phone: string;
  age?: string;
  summary: string;
  temp: 'HOT INSTALL' | 'REPAIR' | 'REBATE';
  agent: string;
  address?: string;
  heatingType?: string;
}

export interface RebateOption {
  type: string;
  amount: string;
  requirement: string;
}

export interface TranscriptionEntry {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  persona?: Persona;
}
