-----------> 
CREATE FUNCTION validate_products_categories_reference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.category_key IS DISTINCT FROM (SELECT key FROM categories WHERE id = NEW.category_id) THEN
		RAISE EXCEPTION 'Category UUID key does not match category ID reference';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER check_product_categories_reference
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION validate_products_categories_reference();


-----------> 
CREATE FUNCTION validate_carts_users_reference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.user_key IS DISTINCT FROM (SELECT key FROM users WHERE id = NEW.user_id) THEN
		RAISE EXCEPTION 'User UUID key does not match user ID reference';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER check_carts_users_reference
BEFORE INSERT OR UPDATE ON carts
FOR EACH ROW EXECUTE FUNCTION validate_carts_users_reference();

-----------> 
CREATE FUNCTION validate_carts_items_carts_reference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.cart_key IS DISTINCT FROM (SELECT key FROM carts WHERE id = NEW.cart_id) THEN
		RAISE EXCEPTION 'Cart item UUID key does not match cart ID reference';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER check_carts_items_carts_reference
BEFORE INSERT OR UPDATE ON carts_items
FOR EACH ROW EXECUTE FUNCTION validate_carts_items_carts_reference();

-----------> 
CREATE FUNCTION validate_carts_items_products_reference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.product_item_key IS DISTINCT FROM (SELECT key FROM products_items WHERE id = NEW.product_item_id) THEN
		RAISE EXCEPTION 'Cart UUID key does not match cart ID reference';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER check_carts_items_products_reference
BEFORE INSERT OR UPDATE ON carts_items
FOR EACH ROW EXECUTE FUNCTION validate_carts_items_products_reference();

-----------> 
-- Check that a Product Item is only in a Cart once
CREATE FUNCTION validate_unique_product_in_cart()
RETURNS TRIGGER AS $$
BEGIN
    -- Verify the cart exists
    IF NOT EXISTS (SELECT 1 FROM carts WHERE id = NEW.cart_id) THEN
        RAISE EXCEPTION 'Cart ID % does not exist', NEW.cart_id;
    END IF;
    
    -- Verify the product isn't already in the cart
    IF EXISTS (
        SELECT 1 
        FROM carts_items 
        WHERE cart_id = NEW.cart_id 
        AND product_item_id = NEW.product_item_id
        AND id != COALESCE(NEW.id, -1)  -- Exclude current row for updates
    ) THEN
        RAISE EXCEPTION 'Product item ID % already exists in cart ID % #I4dOnz8ONyBG', NEW.product_item_id, NEW.cart_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER check_unique_product_in_cart
BEFORE INSERT OR UPDATE ON carts_items
FOR EACH ROW EXECUTE FUNCTION validate_unique_product_in_cart();

-----------> 
CREATE FUNCTION validate_categories_parent_reference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.parent_key IS DISTINCT FROM (SELECT key FROM categories WHERE id = NEW.parent_id) THEN
		RAISE EXCEPTION 'Parent UUID key does not match parent ID reference';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER check_categories_parent_reference
BEFORE INSERT OR UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION validate_categories_parent_reference();
