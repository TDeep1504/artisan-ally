
-- Add unique constraint on seller_profiles.user_id for upsert support
ALTER TABLE public.seller_profiles ADD CONSTRAINT seller_profiles_user_id_unique UNIQUE (user_id);

-- Add unique constraint on cart_items to prevent duplicate product entries
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id);
