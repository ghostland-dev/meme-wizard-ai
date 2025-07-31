-- Give 100 free credits to the current user
UPDATE profiles 
SET credits = credits + 100 
WHERE user_id = 'b8fca757-8bd6-45f8-9d9c-3704fecf2589';