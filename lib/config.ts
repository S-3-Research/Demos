import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";
import { IntakeData, UserIntent, UserRole } from "./types/intake";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

// Default starter prompts (fallback for users without intake data)
export const DEFAULT_STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Can you explain what Alzheimer's disease is and why clinical trials are important?",
    prompt: "Can you explain what Alzheimer's disease is and why clinical trials are important?",
    icon: "circle-question",
  },
  {
    label: "Find clinical trials that might be right for me?",
    prompt: "Find clinical trials that might be right for me?",
    icon: "search",
  },
  {
    label: "What are clinical trials and what should I expect if I participate in one?",
    prompt: "What are clinical trials and what should I expect if I participate in one?",
    icon: "notebook",
  },
];

// Starter prompts for trial matching intent - user role
const TRIAL_MATCHING_USER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "I'd like to find clinical trials that match my health profile",
    prompt: "I'd like to find clinical trials that match my health profile",
    icon: "search",
  },
  {
    label: "What are the eligibility criteria for Alzheimer's disease trials?",
    prompt: "What are the eligibility criteria for Alzheimer's disease trials?",
    icon: "notebook",
  },
  {
    label: "Are there trials near my location?",
    prompt: "Are there trials near my location?",
    icon: "circle-question",
  },
];

// Starter prompts for trial matching intent - caregiver role
const TRIAL_MATCHING_CAREGIVER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Help me find clinical trials suitable for the person I care for",
    prompt: "Help me find clinical trials suitable for the person I care for",
    icon: "search",
  },
  {
    label: "What eligibility criteria should I know about for Alzheimer's disease trials?",
    prompt: "What eligibility criteria should I know about for Alzheimer's disease trials?",
    icon: "notebook",
  },
  {
    label: "Are there trials near our location?",
    prompt: "Are there trials near our location?",
    icon: "circle-question",
  },
];

// Starter prompts for learning intent - user role
const LEARN_USER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Can you explain what Alzheimer's disease is and why clinical trials matter?",
    prompt: "Can you explain what Alzheimer's disease is and why clinical trials matter?",
    icon: "circle-question",
  },
  {
    label: "What should I expect if I participate in a clinical trial?",
    prompt: "What should I expect if I participate in a clinical trial?",
    icon: "notebook",
  },
  {
    label: "What are the potential risks and benefits of joining a trial?",
    prompt: "What are the potential risks and benefits of joining a trial?",
    icon: "search",
  },
];

// Starter prompts for learning intent - caregiver role
const LEARN_CAREGIVER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Can you explain Alzheimer's disease and why clinical trials are important?",
    prompt: "Can you explain Alzheimer's disease and why clinical trials are important?",
    icon: "circle-question",
  },
  {
    label: "What happens when someone participates in a clinical trial?",
    prompt: "What happens when someone participates in a clinical trial?",
    icon: "notebook",
  },
  {
    label: "What is my role as a caregiver in a clinical trial?",
    prompt: "What is my role as a caregiver in a clinical trial?",
    icon: "search",
  },
];

// Greetings based on intent and role
const GREETINGS = {
  trial_matching_user: "Welcome to TrialChat! I'm here to help you find clinical trials that match your needs. Let's get started!",
  trial_matching_caregiver: "Welcome to TrialChat! I'm here to help you find suitable clinical trials for your loved one. How can I assist you?",
  learn_about_trials_user: "Welcome to TrialChat! I'm here to answer your questions about ADRD and clinical trials. What would you like to learn?",
  learn_about_trials_caregiver: "Welcome to TrialChat! I'm here to help you understand ADRD clinical trials and your role as a caregiver. What can I explain?",
  default: "Welcome to TrialChat! I'm here to help you navigate ADRD clinical trials. How can I assist you today?",
};

// Helper function to get starter prompts based on user preferences
export const getStarterPromptsForUser = (intakeData: IntakeData | null): StartScreenPrompt[] => {
  if (!intakeData) {
    return DEFAULT_STARTER_PROMPTS;
  }

  const { intent, role } = intakeData;

  if (intent === 'trial_matching') {
    return role === 'caregiver' ? TRIAL_MATCHING_CAREGIVER_PROMPTS : TRIAL_MATCHING_USER_PROMPTS;
  } else if (intent === 'learn_about_trials') {
    return role === 'caregiver' ? LEARN_CAREGIVER_PROMPTS : LEARN_USER_PROMPTS;
  }

  return DEFAULT_STARTER_PROMPTS;
};

// Helper function to get greeting based on user preferences
export const getGreetingForUser = (intakeData: IntakeData | null): string => {
  if (!intakeData) {
    return GREETINGS.default;
  }

  const { intent, role } = intakeData;
  const key = `${intent}_${role}` as keyof typeof GREETINGS;

  return GREETINGS[key] || GREETINGS.default;
};

export const PLACEHOLDER_INPUT = "Ask about clinical trials, ADRD, or get personalized guidance...";

// Keep these for backward compatibility
export const STARTER_PROMPTS = DEFAULT_STARTER_PROMPTS;
export const GREETING = GREETINGS.default;

export const getThemeConfig = (
  theme: ColorScheme,
  baseSize?: 14 | 15 | 16 | 17 | 18
): ThemeOption => ({
  color: {
    grayscale: {
      hue: 215,  // 蓝色调的灰度，更符合医疗科技感
      tint: 5,
      shade: theme === "dark" ? -1 : -3,
    },
    accent: {
      primary: theme === "dark" ? "#60a5fa" : "#2563eb",  // 蓝色主题色，匹配 TrialChat
      level: 2,  // 稍微增强对比度
    },
  },
  radius: "round",  // 圆润的边角，友好亲和
  density: "normal",  // 正常间距，适合老年人阅读
  ...(baseSize && {
    typography: {
      baseSize,
    },
  }),
  // chatkit.studio/playground to explore config options
});
