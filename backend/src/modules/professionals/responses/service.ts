import { getSupabase } from '../../../db/supabaseClient.js';

export interface ProfessionalResponse {
  id: string;
  postId: string;
  professionalId: string;
  content: string;
  isOfficialResponse: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResponseInput {
  postId: string;
  content: string;
  isOfficialResponse?: boolean;
}

export class ProfessionalResponseService {
  async getResponsesByPost(postId: string): Promise<ProfessionalResponse[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('professional_responses')
      .select(`
        *,
        professional:users(id, display_name, avatar_url),
        professional_profile:professional_profiles(specialization, credentials)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapResponse);
  }
  
  async createResponse(
    professionalId: string,
    input: CreateResponseInput
  ): Promise<ProfessionalResponse> {
    const supabase = getSupabase();
    
    // Verify professional is verified
    const { data: profile } = await supabase
      .from('professional_profiles')
      .select('status')
      .eq('user_id', professionalId)
      .single();
    
    if (!profile || profile.status !== 'VERIFIED') {
      throw new Error('Only verified professionals can respond to posts');
    }
    
    // Professionals CANNOT post anonymously - ensure is_anonymous is false
    const { data, error } = await supabase
      .from('professional_responses')
      .insert({
        post_id: input.postId,
        professional_id: professionalId,
        content: input.content,
        is_official_response: input.isOfficialResponse || false,
        helpful_count: 0,
      })
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to create response');
    
    // Award reputation points to professional for responding
    await this.awardReputation(professionalId, 10, 'RESPONSE_CREATED', 'professional_responses', data.id);
    
    return this.mapResponse(data);
  }
  
  async markAsHelpful(responseId: string): Promise<void> {
    const supabase = getSupabase();
    
    const { data: response } = await supabase
      .from('professional_responses')
      .select('professional_id, helpful_count')
      .eq('id', responseId)
      .single();
    
    if (!response) throw new Error('Response not found');
    
    await supabase
      .from('professional_responses')
      .update({ helpful_count: (response.helpful_count || 0) + 1 })
      .eq('id', responseId);
    
    // Award reputation to professional for helpful response
    await this.awardReputation(response.professional_id, 5, 'HELPFUL_RESPONSE', 'professional_responses', responseId);
  }
  
  private async awardReputation(
    userId: string,
    points: number,
    actionType: string,
    referenceType: string,
    referenceId: string
  ): Promise<void> {
    const supabase = getSupabase();
    
    await supabase.from('user_reputation_history').insert({
      user_id: userId,
      action_type: actionType,
      points: points,
      reference_type: referenceType,
      reference_id: referenceId,
    });
    
    // Recalculate user reputation
    await supabase.rpc('calculate_user_reputation', { user_uuid: userId });
  }
  
  private mapResponse(data: Record<string, unknown>): ProfessionalResponse {
    return {
      id: data.id as string,
      postId: data.post_id as string,
      professionalId: data.professional_id as string,
      content: data.content as string,
      isOfficialResponse: data.is_official_response as boolean,
      helpfulCount: data.helpful_count as number,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const professionalResponseService = new ProfessionalResponseService();
