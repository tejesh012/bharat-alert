
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  role: 'user' | 'admin';
  sightingsCount: number;
  createdAt: string;
}

export interface MissingChildReport {
  id: string;
  childName: string;
  age: number;
  description: string;
  lastSeenLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  lastSeenDate: string;
  contactInfo: string;
  photos?: string[];
  reportedBy: string;
  status: 'pending' | 'active' | 'solved';
  createdAt: string;
  approvedAt?: string;
  solvedAt?: string;
}

export interface Sighting {
  id: string;
  reportId: string;
  reportedBy: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Database {
  users: User[];
  pendingReports: MissingChildReport[];
  approvedReports: MissingChildReport[];
  solvedReports: MissingChildReport[];
  sightings: Sighting[];
  bannedUsers: string[];
}

// Mock database with sample data
const initialData: Database = {
  users: [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bharatalert.gov.in',
      phone: '+91-9999999999',
      role: 'admin',
      sightingsCount: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-1',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91-9876543210',
      role: 'user',
      sightingsCount: 1,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India'
      },
      createdAt: new Date().toISOString()
    }
  ],
  pendingReports: [
    {
      id: 'pending-1',
      childName: 'Priya Sharma',
      age: 8,
      description: 'Last seen wearing blue school uniform, carries a red backpack',
      lastSeenLocation: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Andheri, Mumbai, Maharashtra'
      },
      lastSeenDate: '2024-06-03T14:30:00Z',
      contactInfo: '+91-9876543211',
      reportedBy: 'user-1',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ],
  approvedReports: [
    {
      id: 'active-1',
      childName: 'Arjun Patel',
      age: 12,
      description: 'Wearing white t-shirt and blue jeans, has a distinctive scar on left hand',
      lastSeenLocation: {
        lat: 22.5726,
        lng: 88.3639,
        address: 'Park Street, Kolkata, West Bengal'
      },
      lastSeenDate: '2024-06-04T09:15:00Z',
      contactInfo: '+91-9876543212',
      reportedBy: 'user-1',
      status: 'active',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      approvedAt: new Date().toISOString()
    },
    {
      id: 'active-2',
      childName: 'Kavya Singh',
      age: 6,
      description: 'Small girl with braided hair, wearing pink dress with flower patterns',
      lastSeenLocation: {
        lat: 26.9124,
        lng: 75.7873,
        address: 'Jaipur, Rajasthan'
      },
      lastSeenDate: '2024-06-04T16:45:00Z',
      contactInfo: '+91-9876543213',
      reportedBy: 'user-1',
      status: 'active',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      approvedAt: new Date().toISOString()
    }
  ],
  solvedReports: [],
  sightings: [
    {
      id: 'sighting-1',
      reportId: 'active-1',
      reportedBy: 'user-1',
      location: {
        lat: 22.5726,
        lng: 88.3639,
        address: 'Near Park Street Metro, Kolkata'
      },
      description: 'Saw a boy matching the description near the metro station',
      timestamp: '2024-06-04T10:30:00Z',
      status: 'approved',
      createdAt: new Date().toISOString()
    }
  ],
  bannedUsers: []
};

class DataService {
  private data: Database;

  constructor() {
    const stored = localStorage.getItem('bharatAlertDB');
    this.data = stored ? JSON.parse(stored) : initialData;
  }

  private save() {
    localStorage.setItem('bharatAlertDB', JSON.stringify(this.data));
  }

  // Auth methods
  login(email: string, password: string): User | null {
    const user = this.data.users.find(u => u.email === email);
    if (user && !this.data.bannedUsers.includes(user.id)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  signup(userData: Omit<User, 'id' | 'sightingsCount' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      sightingsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  // Report methods
  getActiveReports(): MissingChildReport[] {
    return this.data.approvedReports.filter(r => r.status === 'active');
  }

  getPendingReports(): MissingChildReport[] {
    return this.data.pendingReports;
  }

  getSolvedReports(): MissingChildReport[] {
    return this.data.solvedReports;
  }

  getReportById(id: string): MissingChildReport | null {
    const allReports = [
      ...this.data.approvedReports,
      ...this.data.pendingReports,
      ...this.data.solvedReports
    ];
    return allReports.find(r => r.id === id) || null;
  }

  submitReport(reportData: Omit<MissingChildReport, 'id' | 'status' | 'createdAt'>): string {
    const newReport: MissingChildReport = {
      ...reportData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.data.pendingReports.push(newReport);
    this.save();
    return newReport.id;
  }

  approveReport(reportId: string): boolean {
    const reportIndex = this.data.pendingReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      const report = this.data.pendingReports[reportIndex];
      report.status = 'active';
      report.approvedAt = new Date().toISOString();
      this.data.approvedReports.push(report);
      this.data.pendingReports.splice(reportIndex, 1);
      this.save();
      return true;
    }
    return false;
  }

  rejectReport(reportId: string): boolean {
    const reportIndex = this.data.pendingReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      this.data.pendingReports.splice(reportIndex, 1);
      this.save();
      return true;
    }
    return false;
  }

  markReportSolved(reportId: string): boolean {
    const reportIndex = this.data.approvedReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      const report = this.data.approvedReports[reportIndex];
      report.status = 'solved';
      report.solvedAt = new Date().toISOString();
      this.data.solvedReports.push(report);
      this.data.approvedReports.splice(reportIndex, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Sighting methods
  getSightings(): Sighting[] {
    return this.data.sightings;
  }

  getSightingsByReport(reportId: string): Sighting[] {
    return this.data.sightings.filter(s => s.reportId === reportId);
  }

  getUserSightings(userId: string): Sighting[] {
    return this.data.sightings.filter(s => s.reportedBy === userId);
  }

  canUserReportSighting(userId: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    return user ? user.sightingsCount < 2 : false;
  }

  submitSighting(sightingData: Omit<Sighting, 'id' | 'status' | 'createdAt'>): string {
    const newSighting: Sighting = {
      ...sightingData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.data.sightings.push(newSighting);
    this.save();
    return newSighting.id;
  }

  approveSighting(sightingId: string): boolean {
    const sighting = this.data.sightings.find(s => s.id === sightingId);
    if (sighting) {
      sighting.status = 'approved';
      // Increment user's sighting count
      const user = this.data.users.find(u => u.id === sighting.reportedBy);
      if (user) {
        user.sightingsCount++;
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.save();
      return true;
    }
    return false;
  }

  rejectSighting(sightingId: string): boolean {
    const sightingIndex = this.data.sightings.findIndex(s => s.id === sightingId);
    if (sightingIndex !== -1) {
      this.data.sightings.splice(sightingIndex, 1);
      this.save();
      return true;
    }
    return false;
  }

  // User management
  banUser(userId: string): boolean {
    if (!this.data.bannedUsers.includes(userId)) {
      this.data.bannedUsers.push(userId);
      this.save();
      return true;
    }
    return false;
  }

  unbanUser(userId: string): boolean {
    const index = this.data.bannedUsers.indexOf(userId);
    if (index !== -1) {
      this.data.bannedUsers.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  getAllUsers(): User[] {
    return this.data.users;
  }

  getBannedUsers(): string[] {
    return this.data.bannedUsers;
  }
}

export const dataService = new DataService();
