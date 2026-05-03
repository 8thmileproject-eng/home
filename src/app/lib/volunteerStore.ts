// Simple in-memory storage for volunteer applications
// In production, connect this to MongoDB or another database

export interface VolunteerApplication {
  id: string;
  roleId: string;
  roleTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  fieldOfStudy: string;
  occupation?: string;
  motivation: string;
  uniqueValue: string;
  hoursPerWeek: string;
  availableStartDate: string;
  portfolioLinks?: string;
  referenceName?: string;
  referenceRelationship?: string;
  referenceContact?: string;
  roleSpecificAnswers: Record<string, string>;
  createdAt: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
}

class VolunteerStore {
  private applications: VolunteerApplication[] = [];

  add(data: Omit<VolunteerApplication, "id" | "createdAt" | "status">): VolunteerApplication {
    const application: VolunteerApplication = {
      ...data,
      id: `vol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    this.applications.push(application);
    console.log("Volunteer application saved:", application.id, application.fullName, application.roleTitle);

    return application;
  }

  getAll(): VolunteerApplication[] {
    return [...this.applications].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): VolunteerApplication | undefined {
    return this.applications.find(a => a.id === id);
  }

  updateStatus(id: string, status: VolunteerApplication["status"]): boolean {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.applications.length;
    const pending = this.applications.filter(a => a.status === "pending").length;
    const reviewed = this.applications.filter(a => a.status === "reviewed").length;
    const accepted = this.applications.filter(a => a.status === "accepted").length;
    const rejected = this.applications.filter(a => a.status === "rejected").length;

    return { total, pending, reviewed, accepted, rejected };
  }
}

export const volunteerStore = new VolunteerStore();
