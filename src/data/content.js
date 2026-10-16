// Content structure shared by the DOM sections and the 3D scene.
// The copy itself lives in public/locales/{es,en}/lang.json.

export const PROCESS_STEPS = [1, 2, 3, 4, 5, 6];

export const AI_PILLARS = [
  { n: 1, icon: "las la-file-alt" },
  { n: 2, icon: "las la-brain" },
  { n: 3, icon: "las la-plug" },
  { n: 4, icon: "las la-shield-alt" },
];

export const CASES = [
  { id: "qsm", client: "QSM", tools: ["n8n", "Gemini", "Next.js", "Supabase"] },
  { id: "mcontigo", client: "MContigo", tools: ["Python", "pandas", "Deepnote", "Google Sheets API"] },
  { id: "inventory", client: "Leadbox", tools: ["Python", "GraphQL"] },
  { id: "erp", client: "Distribuciones Marver", tools: ["Laravel", "GoHighLevel", "OAuth 2.0", "Twilio"] },
  { id: "qa", client: "Leadbox", tools: ["Playwright", "OWASP ZAP", "TypeScript"] },
];

export const STACK_GROUPS = [
  {
    key: "stack_group_prod",
    items: ["Laravel", "Vue", "React", "Next.js", "Angular", "WordPress", "Tailwind CSS", "MySQL", "PostgreSQL", "Supabase"],
  },
  { key: "stack_group_auto", items: ["n8n", "Zapier", "GoHighLevel", "Python", "pandas", "Playwright"] },
  { key: "stack_group_ai", items: ["Claude Code", "MCP", "OpenSpec", "Gemini"] },
  { key: "stack_group_3d", items: ["Three.js", "React Three Fiber"] },
  { key: "stack_group_learning", items: ["NestJS", "Node.js"] },
];

export const EXPERIENCES = [
  { id: "exp5", date: "date_exp5", title: "title_exp5", description: "description_exp5" },
  { id: "exp0", date: "date_exp0", title: "title_exp0", description: "description_exp0" },
  { id: "exp1", date: "date_exp1", title: "title_exp1", description: "description_exp1" },
  { id: "exp2", date: "date_exp2", title: "title_exp2", description: "description_exp2" },
  { id: "exp3", date: "date_exp3", title: "title_exp3", description: "description_exp3" },
  { id: "exp4", date: "date_exp4", title: "title_exp4", description: "description_exp4" },
];
