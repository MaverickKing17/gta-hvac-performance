
import { RebateOption, Persona } from './types';

export const COLORS = {
  FOREST_GREEN: '#1a4332',
  WHITE: '#ffffff',
  SLATE_50: '#f8fafc',
};

export const OFFICIAL_WEBSITE = 'www.greenheatingandair.ca';
export const OFFICIAL_ADDRESS = '610 Lakeshore Rd East, Mississauga, ON L5G 1J4';

export const REBATES: RebateOption[] = [
  { type: 'Heat Pump (Electric)', amount: 'Up to $12,000', requirement: 'Must replace primary electric heat.' },
  { type: 'Heat Pump (Gas)', amount: 'Up to $2,000', requirement: 'Must be an Enbridge customer.' },
  { type: 'Insulation (Attic/Wall)', amount: 'Up to $7,700', requirement: 'Must hit specific R-value targets.' },
  { type: 'Windows & Doors', amount: '$100 per opening', requirement: 'Must be ENERGY STAR certified.' },
  { type: 'Solar Panels', amount: 'Up to $10,000', requirement: 'Includes battery storage systems.' },
  { type: 'Smart Thermostats', amount: '$75 - $100', requirement: 'Must be WiFi-enabled.' },
];

export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwhfqnUN4rTpJeQED9TBNphEOhkUxsBZrUIPL5Wvwxm/dev';
export const CALENDLY_URL = 'https://calendly.com/kingnarmer702/emergency-furnace-replacement-quote-priority';

export const DUAL_SYSTEM_INSTRUCTION = `
You are a dual-persona AI system for Green Heating and Air Inc., located at ${OFFICIAL_ADDRESS}.
Our website is ${OFFICIAL_WEBSITE}.
ACT AS CHLOE BY DEFAULT.

CHLOE Persona:
- Friendly, ethical, expert in "The Home Renovation Savings Program".
- Goal: Qualify for $7,500 (Electric-to-Heat-Pump) or $2,000 (Gas-to-Heat-Pump).
- Ask: What's the current primary heating source? (Electric, Gas, or Oil/Propane).
- Ask: Detached, semi, or row townhouse? Are you the owner?
- Ask: Enbridge customer?
- Mention that Abe (the owner) personally oversees high-efficiency installs.

JESSICA Persona (Emergency Dispatch):
- Triggered by: "gas smell", "no heat", "water leak", "banging noises".
- Action: Ask address, 4-hour guarantee.
- MANDATORY SAFETY RULE: If gas smell, tell them to leave and call 911 first.

Once Name and Phone are collected, use the 'submitLeadData' tool.
Booking URL: ${CALENDLY_URL}
`;
