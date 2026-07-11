export interface EntryPoint {
  type: "Tool" | "Project" | "Resource";
  name: string;
  description: string;
}

export interface DepthArea {
  id: string;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  entryPoints: EntryPoint[];
}

export interface LandscapeArea {
  id: string;
  name: string;
  description: string;
  depthAreas: DepthArea[];
}

export interface UnexpectedConnection {
  connectedTo: string;
  story: string;
  sparkIdea: string;
}

export interface PassionMap {
  passion: string;
  tagline: string;
  intro: string;
  landscape: LandscapeArea[];
  unexpectedConnections: UnexpectedConnection[];
  nextSteps: string[];
}

export interface Concept {
  concept: string;
  explanation: string;
}

export interface QuickStartGuide {
  title: string;
  estimatedTime: string;
  steps: string[];
}

export interface CuratedResource {
  name: string;
  type: string;
  description: string;
  urlQuery: string;
}

export interface DeepenResponse {
  subAreaName: string;
  conceptBreakdown: Concept[];
  quickStartGuides: QuickStartGuide[];
  curatedResources: CuratedResource[];
  encouragingMessage: string;
}

export interface SavedItem {
  id: string;
  passion: string;
  type: "Tool" | "Project" | "Resource" | "Concept" | "Guide";
  title: string;
  subtitle?: string;
  description: string;
  completed: boolean;
}
