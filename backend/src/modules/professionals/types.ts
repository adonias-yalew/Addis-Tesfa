import { ProfessionalStatus } from '../../types/index.js';

export interface Professional {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  credentials: string;
  status: ProfessionalStatus;
  bio?: string;
  yearsOfExperience: number;
  verificationDocuments: string[];
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalApplication {
  licenseNumber: string;
  specialization: string;
  credentials: string;
  yearsOfExperience: number;
  bio?: string;
  verificationDocuments?: string[];
}

export interface VerifyProfessionalInput {
  status: ProfessionalStatus;
  rejectionReason?: string;
}
