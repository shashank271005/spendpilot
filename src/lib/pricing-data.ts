export type ToolCategory = 'coding' | 'chat' | 'api' | 'other';

export interface PlanData {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
}

export interface ToolData {
  id: string;
  name: string;
  category: ToolCategory;
  plans: PlanData[];
}

export const PRICING_DATA: Record<string, ToolData> = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    plans: [
      { name: 'Pro', pricePerSeat: 20 },
      { name: 'Business', pricePerSeat: 40 },
    ],
  },
  github_copilot: {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { name: 'Individual', pricePerSeat: 10 },
      { name: 'Business', pricePerSeat: 19 },
      { name: 'Enterprise', pricePerSeat: 39 },
    ],
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'coding',
    plans: [
      { name: 'Pro', pricePerSeat: 15 },
      { name: 'Team', pricePerSeat: 25 },
    ],
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    category: 'chat',
    plans: [
      { name: 'Pro', pricePerSeat: 20 },
      { name: 'Team', pricePerSeat: 30, minSeats: 5 },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat',
    plans: [
      { name: 'Plus', pricePerSeat: 20 },
      { name: 'Team', pricePerSeat: 30, minSeats: 2 },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    category: 'chat',
    plans: [
      { name: 'Advanced', pricePerSeat: 20 },
    ],
  },
  anthropic_api: {
    id: 'anthropic_api',
    name: 'Anthropic API',
    category: 'api',
    plans: [
      { name: 'Pay-as-you-go', pricePerSeat: 0 }, // Variable cost
    ],
  },
  openai_api: {
    id: 'openai_api',
    name: 'OpenAI API',
    category: 'api',
    plans: [
      { name: 'Pay-as-you-go', pricePerSeat: 0 }, // Variable cost
    ],
  },
};

export const getAllTools = () => Object.values(PRICING_DATA);
