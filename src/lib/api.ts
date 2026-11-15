// Law & Legacy Chamber API Client

const API_BASE = "";

export interface SiteContentRow {
  section: string;
  key: string;
  value: any;
}

export interface LegalEvent {
  id: string;
  title: string;
  description?: string | null;
  event_url?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  created_at: string;
}

export interface ConsultationSubmission {
  name: string;
  email: string;
  phone?: string;
  practice_area?: string;
  message?: string;
}

export interface SlideItem {
  id: string;
  title?: string | null;
  caption?: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export const api = {
  // --- Site Content ---
  async getSiteContent(section?: string): Promise<any> {
    const url = section ? `${API_BASE}/api/site-content?section=${encodeURIComponent(section)}` : `${API_BASE}/api/site-content`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch site content: ${res.statusText}`);
    return res.json();
  },

  async updateSiteContent(section: string, key: string, value: any): Promise<void> {
    const res = await fetch(`${API_BASE}/api/site-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, key, value }),
    });
    if (!res.ok) throw new Error("Failed to update site content");
  },

  // --- Events & News ---
  async getEvents(): Promise<LegalEvent[]> {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  },

  async createEvent(event: Partial<LegalEvent>): Promise<LegalEvent> {
    const res = await fetch(`${API_BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error("Failed to create event");
    return res.json();
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete event");
  },

  // --- Consultations ---
  async submitConsultation(data: ConsultationSubmission): Promise<{ success: boolean; consultation_id: string; tracking_code: string; message: string }> {
    const res = await fetch(`${API_BASE}/api/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit consultation");
    return res.json();
  },

  async getConsultations(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/consultations`);
    if (!res.ok) throw new Error("Failed to fetch consultations");
    return res.json();
  },

  // --- Admin Verification & Security ---
  async verifyAdmin(password: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/api/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Authentication failed");
    }
    return res.json();
  },

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/api/admin/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to change password");
    }
    return res.json();
  },

  // --- Hero Slides & Uploads ---
  async getSlides(): Promise<SlideItem[]> {
    const res = await fetch(`${API_BASE}/api/slides`);
    if (!res.ok) throw new Error("Failed to fetch slides");
    return res.json();
  },

  async createSlide(slide: Partial<SlideItem>): Promise<SlideItem> {
    const res = await fetch(`${API_BASE}/api/slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slide),
    });
    if (!res.ok) throw new Error("Failed to create slide");
    return res.json();
  },

  async updateSlide(id: string, slide: Partial<SlideItem>): Promise<SlideItem> {
    const res = await fetch(`${API_BASE}/api/slides/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slide),
    });
    if (!res.ok) throw new Error("Failed to update slide");
    return res.json();
  },

  async deleteSlide(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/slides/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete slide");
  },

  async uploadImage(file: File): Promise<{ url: string; fileName: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: reader.result,
              fileName: file.name,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Image upload failed");
          }
          const data = await res.json();
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  },
};
