CREATE OR REPLACE FUNCTION deduct_credits(target_user_id UUID, amount INT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INT;
  user_role user_role;
BEGIN
  SELECT credit_balance, role INTO current_balance, user_role FROM public.users WHERE id = target_user_id FOR UPDATE;
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  IF current_balance >= amount THEN
    UPDATE public.users SET credit_balance = credit_balance - amount WHERE id = target_user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
