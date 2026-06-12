import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bqqlgibvcyyoxwwqvusb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcWxnaWJ2Y3l5b3h3d3F2dXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzYzNDYsImV4cCI6MjA5NTQ1MjM0Nn0.e8eQqq48l2_qCA_D3eCRG3iVEuIZeOAyMRasl5rUFWY'

export const supabase = createClient(supabaseUrl, supabaseKey)
