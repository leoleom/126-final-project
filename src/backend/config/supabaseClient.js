const { createClient } = require('@supabase/supabase-js');

console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log(
  "SECRET KEY EXISTS:",
  !!process.env.SUPABASE_SECRET_KEY
);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

module.exports = supabase;