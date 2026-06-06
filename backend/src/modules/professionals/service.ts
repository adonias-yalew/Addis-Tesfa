import { getSupabase } from '../../db/supabaseClient.js';
import { Professional, ProfessionalApplication, VerifyProfessionalInput } from './types.js';
import { ProfessionalStatus } from '../../types/index.js';

export class ProfessionalService {
  async getAllProfessionals(): Promise<Professional[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('professional_profiles')
      .select('*')
      .eq('status', ProfessionalStatus.VERIFIED)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapProfessional);
  }
  
  async getProfessionalById(id: string): Promise<Professional | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('professional_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return this.mapProfessional(data);
  }
  
  async getProfessionalByUserId(userId: string): Promise<Professional | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('professional_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return null;
    return this.mapProfessional(data);
  }
  
  async apply(userId: string, input: ProfessionalApplication): Promise<Professional> {
    const supabase = getSupabase();
    
    // Check if already applied
    const existing = await this.getProfessionalByUserId(userId);
    if (existing) {
      throw new Error('Professional application already exists');
    }
    
    const { data, error } = await supabase
      .from('professional_profiles')
      .insert({
        user_id: userId,
        license_number: input.licenseNumber,
        specialization: input.specialization,
        credentials: input.credentials,
        years_of_experience: input.yearsOfExperience,
        verification_documents: input.verificationDocuments || [],
        bio: input.bio,
        status: ProfessionalStatus.PENDING,
      })
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to submit application');
    return this.mapProfessional(data);
  }
  
  async verify(id: string, input: VerifyProfessionalInput): Promise<Professional> {
    const supabase = getSupabase();
    
    const updates: Record<string, unknown> = { status: input.status };
    if (input.rejectionReason) updates.rejection_reason = input.rejectionReason;
    
    const { data, error } = await supabase
      .from('professional_profiles')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to verify professional');
    return this.mapProfessional(data);
  }
  
  private mapProfessional(data: Record<string, unknown>): Professional {
    return {
      id: data.id as string,
      userId: data.user_id as string,
      licenseNumber: data.license_number as string,
      specialization: data.specialization as string,
      credentials: data.credentials as string,
      status: data.status as ProfessionalStatus,
      bio: data.bio as string | undefined,
      yearsOfExperience: data.years_of_experience as number,
      verificationDocuments: data.verification_documents as string[] || [],
      rejectionReason: data.rejection_reason as string | undefined,
      verifiedAt: data.verified_at as string | undefined,
      verifiedBy: data.verified_by as string | undefined,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const professionalService = new ProfessionalService();
