import { Request, Response } from 'express';
import { professionalService } from './service.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';
import { ProfessionalStatus } from '../../types/index.js';

export class ProfessionalController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const professionals = await professionalService.getAllProfessionals();
    res.json({ success: true, data: professionals });
  });
  
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const professional = await professionalService.getProfessionalById(id);
    
    if (!professional) {
      res.status(404).json({ success: false, error: 'Professional not found' });
      return;
    }
    
    res.json({ success: true, data: professional });
  });
  
  // Professionals MUST be non-anonymous
  apply = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    
    // Ensure user is not anonymous
    if (req.user?.isAnonymous) {
      res.status(403).json({ 
        success: false, 
        error: 'Anonymous users cannot apply as professionals. Please use a verified account.' 
      });
      return;
    }
    
    const professional = await professionalService.apply(userId, req.body);
    res.status(201).json({ 
      success: true, 
      data: professional, 
      message: 'Application submitted for review' 
    });
  });
  
  // Only admins can verify
  verify = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const professional = await professionalService.verify(id, req.body);
    res.json({ 
      success: true, 
      data: professional, 
      message: `Professional ${professional.status === ProfessionalStatus.VERIFIED ? 'verified' : 'rejected'}` 
    });
  });
  
  getPending = asyncHandler(async (_req: Request, res: Response) => {
    const supabase = (await import('../../db/supabaseClient.js')).getSupabase();
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('status', ProfessionalStatus.PENDING)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    const mapped = (data || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      userId: p.user_id as string,
      licenseNumber: p.license_number as string,
      specialization: p.specialization as string,
      credentials: p.credentials as string,
      status: p.status as ProfessionalStatus,
      bio: p.bio as string | undefined,
      yearsOfExperience: p.years_of_experience as number,
      createdAt: p.created_at as string,
      updatedAt: p.updated_at as string,
    }));
    
    res.json({ success: true, data: mapped });
  });
}

export const professionalController = new ProfessionalController();
