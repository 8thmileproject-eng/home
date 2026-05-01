// Simple in-memory storage for partners
// In production, you should use a real database

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  partnershipType: string;
  description?: string;
  createdAt: string;
  contacted: boolean;
}

class PartnerStore {
  private partners: Partner[] = [];

  add(partner: Omit<Partner, "id" | "createdAt" | "contacted">): Partner {
    const newPartner: Partner = {
      ...partner,
      id: `par_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      contacted: false,
    };
    
    this.partners.push(newPartner);
    console.log("Partner saved:", newPartner);
    
    return newPartner;
  }

  getAll(): Partner[] {
    return [...this.partners].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): Partner | undefined {
    return this.partners.find(p => p.id === id);
  }

  markAsContacted(id: string): boolean {
    const partner = this.partners.find(p => p.id === id);
    if (partner) {
      partner.contacted = true;
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.partners.length;
    const contacted = this.partners.filter(p => p.contacted).length;
    const pending = total - contacted;
    
    return {
      totalPartners: total,
      contactedCount: contacted,
      pendingCount: pending,
    };
  }
}

export const partnerStore = new PartnerStore();
