-- Demo seed: creates a demo user with 10 trips and varying driving scores
-- Safe to run repeatedly: truncates relevant tables first.

BEGIN;

-- Remove existing data (preserves schema)
TRUNCATE TABLE public.driving_scores, public.trips, public.users RESTART IDENTITY CASCADE;

-- Insert demo user
INSERT INTO public.users (id, name, email, created_at, user_score)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Demo User', 'demo@example.com', now(), 0);

-- Insert 10 trips for the demo user (different days/times and nearby coords)
INSERT INTO public.trips (id, user_id, start_time, end_time, start_lat, start_lng, end_lat, end_lng)
VALUES
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', now() - interval '10 days', now() - interval '10 days' + interval '25 minutes', 43.4723, -80.5449, 43.4750, -80.5400),
  ('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', now() - interval '9 days', now() - interval '9 days' + interval '12 minutes', 43.4705, -80.5455, 43.4715, -80.5435),
  ('00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', now() - interval '8 days', now() - interval '8 days' + interval '40 minutes', 43.4680, -80.5480, 43.4820, -80.5320),
  ('00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', now() - interval '7 days', now() - interval '7 days' + interval '7 minutes', 43.4760, -80.5420, 43.4765, -80.5415),
  ('00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', now() - interval '6 days', now() - interval '6 days' + interval '18 minutes', 43.4800, -80.5380, 43.4780, -80.5390),
  ('00000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', now() - interval '5 days', now() - interval '5 days' + interval '55 minutes', 43.4600, -80.5550, 43.4920, -80.5200),
  ('00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', now() - interval '4 days', now() - interval '4 days' + interval '30 minutes', 43.4720, -80.5440, 43.4900, -80.5300),
  ('00000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', now() - interval '3 days', now() - interval '3 days' + interval '5 minutes', 43.4721, -80.5450, 43.4729, -80.5441),
  ('00000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', now() - interval '2 days', now() - interval '2 days' + interval '20 minutes', 43.4740, -80.5420, 43.4760, -80.5400),
  ('00000000-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', now() - interval '1 days', now() - interval '1 days' + interval '15 minutes', 43.4700, -80.5470, 43.4690, -80.5460);

-- Insert driving scores for the trips with varying values (mix of good/ok/bad)
INSERT INTO public.driving_scores (id, trip_id, overall_score, braking_score, accel_score, speed_score, created_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 92, 95, 90, 90, now() - interval '10 days'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 75, 80, 70, 75, now() - interval '9 days'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 58, 60, 55, 60, now() - interval '8 days'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 88, 90, 85, 90, now() - interval '7 days'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 67, 70, 65, 65, now() - interval '6 days'),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 45, 50, 40, 45, now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 82, 85, 80, 81, now() - interval '4 days'),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 97, 98, 95, 98, now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', 73, 75, 70, 72, now() - interval '2 days'),
  ('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 60, 62, 58, 60, now() - interval '1 days');

-- Update user's aggregate score to the average of driving_scores.overall_score
UPDATE public.users
SET user_score = (
  SELECT AVG(overall_score) FROM public.driving_scores WHERE trip_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-00000000000a'
  )
)
WHERE id = '11111111-1111-1111-1111-111111111111';

COMMIT;

-- End of demo seed
