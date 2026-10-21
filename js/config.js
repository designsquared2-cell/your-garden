// Supabase project for sign-in and sync. These two values are public by design (the "anon" key only
// allows what the database's row-level security rules allow). Never put the service_role key here.
'use strict';
const SB_URL='https://rscxrxbcwxxqmqogzsop.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY3hyeGJjd3h4cW1xb2d6c29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNzU2MDEsImV4cCI6MjEwNzg1MTYwMX0.TRyJ7J7MC5H-V-KRNNkx314m0eAlh1GX0T37HuyVu8Y';
// Public half of the push-notification key pair (the private half lives only in Supabase's secrets)
const VAPID_PUB='BKnZ-Rs1L8IseK4AOybuyrc6CE80FpFfB3pP1cAca5Hcj4_r6kDap7qwNJd7RqqX3pZ0keG0VOsP8L6vH-A8e1Q';
const SB_LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
