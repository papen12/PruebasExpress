const { createClient } = require("@supabase/supabase-js");

class SupabaseService {
  constructor() {
    this.client = createClient('https://wiserpcdaukpgnvrftrz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpc2VycGNkYXVrcGdudnJmdHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzMwMDIsImV4cCI6MjA3OTY0OTAwMn0._HnCd4cpDRq2HssurUspHUOp_55U-JCZImvYAnWCWJI');
  }
  getClient() {
    return this.client;
  }
}

module.exports = new SupabaseService();
