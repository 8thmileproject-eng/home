// Simple in-memory storage for community reports
// In production, you should use a real database

export interface CommunityReport {
  id: string;
  communityName: string;
  location: string;
  reporterName: string;
  phone: string;
  email?: string;
  description: string;
  createdAt: string;
  reviewed: boolean;
}

class ReportStore {
  private reports: CommunityReport[] = [];

  add(report: Omit<CommunityReport, "id" | "createdAt" | "reviewed">): CommunityReport {
    const newReport: CommunityReport = {
      ...report,
      id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      reviewed: false,
    };
    
    this.reports.push(newReport);
    console.log("Report saved:", newReport);
    
    return newReport;
  }

  getAll(): CommunityReport[] {
    return [...this.reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): CommunityReport | undefined {
    return this.reports.find(r => r.id === id);
  }

  markAsReviewed(id: string): boolean {
    const report = this.reports.find(r => r.id === id);
    if (report) {
      report.reviewed = true;
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.reports.length;
    const reviewed = this.reports.filter(r => r.reviewed).length;
    const pending = total - reviewed;
    
    return {
      totalReports: total,
      reviewedCount: reviewed,
      pendingCount: pending,
    };
  }
}

export const reportStore = new ReportStore();
