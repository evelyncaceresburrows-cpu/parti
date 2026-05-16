export class SupabaseService {
  async saveAnalysis(payload: unknown): Promise<{ saved: boolean; id: string }> {
    // Mock de persistencia para MVP.
    return { saved: true, id: `mock-${Date.now()}` };
  }
}
