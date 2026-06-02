-- Test members for trying the booking flow before the real CSV is loaded.
-- Run in the Supabase SQL editor AFTER schema.sql.
-- Put YOUR OWN email on the rows so member-confirmation emails come to you,
-- not the club. Validation matches on lower(full_name) + membership_number.

insert into members (full_name, membership_number, email) values
  ('Test Member',  '1001', 'you@example.com'),   -- TODO: your email
  ('Jane Skipper', '1002', 'you@example.com'),   -- TODO: your email
  ('John Crew',    '1003', 'you@example.com');    -- TODO: your email

-- To remove the test rows later:
--   delete from members where membership_number in ('1001','1002','1003');
