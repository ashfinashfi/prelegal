import { DocumentType } from '@/types/documents';

export interface CatalogItem {
  id: DocumentType;
  name: string;
  category: 'Confidentiality' | 'Software & SaaS' | 'Services' | 'Compliance & AI';
  description: string;
  badge: string;
  samplePrompt: string;
  filename: string;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: DocumentType.MUTUAL_NDA,
    name: 'Mutual Non-Disclosure Agreement',
    category: 'Confidentiality',
    description: 'Standard two-way NDA protecting confidential disclosures between two parties evaluating a commercial relationship.',
    badge: 'Popular',
    samplePrompt: 'I need a Mutual NDA between Acme Corp and Beta LLC for evaluating a business partnership.',
    filename: 'Mutual-NDA.md',
  },
  {
    id: DocumentType.CLOUD_SERVICE,
    name: 'Cloud Service Agreement',
    category: 'Software & SaaS',
    description: 'Comprehensive SaaS agreement covering subscription terms, cloud hosting, service levels, fees, security, and IP.',
    badge: 'Standard SaaS',
    samplePrompt: 'Create a Cloud Service Agreement for my SaaS platform CloudScale Inc and client Enterprise Corp.',
    filename: 'Cloud-Service-Agreement.md',
  },
  {
    id: DocumentType.PILOT,
    name: 'Pilot Agreement',
    category: 'Software & SaaS',
    description: 'Short-term evaluation contract allowing prospects to test a product or software with limited liability.',
    badge: 'Trial / PoC',
    samplePrompt: 'Draft a 90-day Pilot Agreement with a $0 liability cap for testing our new AI search engine.',
    filename: 'Pilot-Agreement.md',
  },
  {
    id: DocumentType.DESIGN_PARTNER,
    name: 'Design Partner Agreement',
    category: 'Software & SaaS',
    description: 'Early-access agreement where beta users test pre-release software and provide structured product feedback.',
    badge: 'Beta / Feedback',
    samplePrompt: 'I need a Design Partner Agreement for our early alpha program with Feedback Co.',
    filename: 'Design-Partner-Agreement.md',
  },
  {
    id: DocumentType.SLA,
    name: 'Service Level Agreement',
    category: 'Services',
    description: 'Defines system availability targets (e.g. 99.9%), support response times, and service credit remedies.',
    badge: 'Operations',
    samplePrompt: 'Create a Service Level Agreement with 99.9% uptime target and 4-hour response time.',
    filename: 'Service-Level-Agreement.md',
  },
  {
    id: DocumentType.PROFESSIONAL_SERVICES,
    name: 'Professional Services Agreement',
    category: 'Services',
    description: 'For consulting, implementation, and custom development projects with milestones and deliverable schedules.',
    badge: 'Consulting',
    samplePrompt: 'Draft a Professional Services Agreement for web development services with fixed milestone fees.',
    filename: 'Professional-Services-Agreement.md',
  },
  {
    id: DocumentType.PARTNERSHIP,
    name: 'Partnership Agreement',
    category: 'Services',
    description: 'Commercial co-marketing and integration agreement covering trademark licenses, revenue share, and governance.',
    badge: 'Co-Marketing',
    samplePrompt: 'Create a Partnership Agreement between Partner A and Partner B with a 20% revenue share.',
    filename: 'Partnership-Agreement.md',
  },
  {
    id: DocumentType.SOFTWARE_LICENSE,
    name: 'Software License Agreement',
    category: 'Software & SaaS',
    description: 'For on-premise, SDK, or installable software distributions with explicit grant, warranty, and restriction terms.',
    badge: 'On-Premise',
    samplePrompt: 'Draft a Software License Agreement for our desktop application with standard license fees.',
    filename: 'Software-License-Agreement.md',
  },
  {
    id: DocumentType.DPA,
    name: 'Data Processing Agreement',
    category: 'Compliance & AI',
    description: 'GDPR-compliant controller-to-processor terms covering personal data categories, subprocessors, and security.',
    badge: 'GDPR / Privacy',
    samplePrompt: 'Create a GDPR Data Processing Agreement between Data Controller Inc and Processor LLC.',
    filename: 'Data-Processing-Agreement.md',
  },
  {
    id: DocumentType.BAA,
    name: 'Business Associate Agreement',
    category: 'Compliance & AI',
    description: 'HIPAA-compliant agreement for vendors processing Protected Health Information (PHI) and safeguarding patient data.',
    badge: 'HIPAA / Healthcare',
    samplePrompt: 'Draft a HIPAA Business Associate Agreement for handling protected health data.',
    filename: 'Business-Associate-Agreement.md',
  },
  {
    id: DocumentType.AI_ADDENDUM,
    name: 'AI Addendum',
    category: 'Compliance & AI',
    description: 'Specialized terms for AI/ML capabilities, model training data permissions, input confidentiality, and output IP.',
    badge: 'AI & ML',
    samplePrompt: 'Create an AI Addendum ensuring customer inputs are not used to train foundational AI models.',
    filename: 'AI-Addendum.md',
  },
];
