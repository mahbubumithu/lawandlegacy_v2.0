// Chamber Data Adapter
import { api } from '@/lib/api';

class QueryBuilder {
  private table: string;
  private filters: Record<string, any> = {};
  private orderByCol: string = '';
  private orderAsc: boolean = true;
  private pendingUpdate?: any;
  private pendingInsert?: any;
  private isDelete: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }) {
    this.orderByCol = column;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }

  insert(data: any) {
    this.pendingInsert = data;
    return this.execute();
  }

  update(data: any) {
    this.pendingUpdate = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  async then(resolve: (val: { data: any; error: any }) => void, reject?: (err: any) => void) {
    try {
      const res = await this.execute();
      resolve(res);
    } catch (err: any) {
      if (reject) reject(err);
      else resolve({ data: null, error: err });
    }
  }

  private async execute(): Promise<{ data: any; error: any }> {
    try {
      if (this.pendingInsert) {
        if (this.table === 'events') {
          const created = await api.createEvent(this.pendingInsert);
          return { data: created, error: null };
        }
        if (this.table === 'slides') {
          const created = await api.createSlide(this.pendingInsert);
          return { data: created, error: null };
        }
        return { data: null, error: null };
      }

      if (this.isDelete) {
        if (this.table === 'events' && this.filters.id) {
          await api.deleteEvent(this.filters.id);
          return { data: true, error: null };
        }
        if (this.table === 'slides' && this.filters.id) {
          await api.deleteSlide(this.filters.id);
          return { data: true, error: null };
        }
        return { data: null, error: null };
      }

      if (this.pendingUpdate) {
        if (this.table === 'site_content' && this.filters.section && this.filters.key) {
          await api.updateSiteContent(this.filters.section, this.filters.key, this.pendingUpdate.value);
          return { data: true, error: null };
        }
        if (this.table === 'slides' && this.filters.id) {
          const updated = await api.updateSlide(this.filters.id, this.pendingUpdate);
          return { data: updated, error: null };
        }
        return { data: null, error: null };
      }

      // SELECT
      if (this.table === 'site_content') {
        if (this.filters.section) {
          const content = await api.getSiteContent(this.filters.section);
          const rows = Object.entries(content).map(([key, value]) => ({
            section: this.filters.section,
            key,
            value,
          }));
          return { data: rows, error: null };
        } else {
          const grouped = await api.getSiteContent();
          const rows: any[] = [];
          for (const [section, keys] of Object.entries(grouped)) {
            for (const [key, value] of Object.entries(keys as Record<string, any>)) {
              rows.push({ section, key, value });
            }
          }
          return { data: rows, error: null };
        }
      }

      if (this.table === 'events') {
        const events = await api.getEvents();
        return { data: events, error: null };
      }

      if (this.table === 'slides') {
        const slides = await api.getSlides();
        return { data: slides, error: null };
      }

      return { data: [], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
}

export const supabase = {
  from(table: string) {
    return new QueryBuilder(table);
  },
  functions: {
    async invoke(funcName: string, { body }: { body: { password?: string } } = { body: {} }) {
      try {
        if (funcName === 'verify-admin' && body.password) {
          const result = await api.verifyAdmin(body.password);
          return { data: result, error: null };
        }
        return { data: { success: false }, error: new Error('Unknown function') };
      } catch (err: any) {
        return { data: null, error: err };
      }
    },
  },
};
