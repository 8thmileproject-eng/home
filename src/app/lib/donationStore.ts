// Simple in-memory storage for donations
// In production, you should use a real database like PostgreSQL, MongoDB, or SQLite

export interface Donation {
  id: string;
  amount: number;
  frequency: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  isAnonymous: boolean;
  coverFees: boolean;
  createdAt: string;
  thanked: boolean;
}

class DonationStore {
  private donations: Donation[] = [];

  add(donation: Omit<Donation, "id" | "createdAt" | "thanked">): Donation {
    const newDonation: Donation = {
      ...donation,
      id: `don_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      thanked: false,
    };
    
    this.donations.push(newDonation);
    
    // In a real app, you would persist to database here
    console.log("Donation saved:", newDonation);
    
    return newDonation;
  }

  getAll(): Donation[] {
    return [...this.donations].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): Donation | undefined {
    return this.donations.find(d => d.id === id);
  }

  getUnthanked(): Donation[] {
    return this.donations.filter(d => !d.thanked);
  }

  markAsThanked(id: string): boolean {
    const donation = this.donations.find(d => d.id === id);
    if (donation) {
      donation.thanked = true;
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.donations.reduce((sum, d) => sum + d.amount, 0);
    const count = this.donations.length;
    const unthanked = this.donations.filter(d => !d.thanked).length;
    
    return {
      totalAmount: total,
      totalDonations: count,
      unthankedCount: unthanked,
      averageAmount: count > 0 ? total / count : 0,
    };
  }
}

// Export singleton instance
export const donationStore = new DonationStore();
