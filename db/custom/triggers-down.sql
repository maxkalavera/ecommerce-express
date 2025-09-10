-----------> 
DROP TRIGGER check_product_categories_reference ON products;
DROP FUNCTION validate_products_categories_reference;

-----------> 
DROP TRIGGER check_carts_users_reference ON carts;
DROP FUNCTION validate_carts_users_reference;

-----------> 
DROP TRIGGER check_carts_items_carts_reference ON carts_items;
DROP FUNCTION validate_carts_items_carts_reference;

-----------> 
DROP TRIGGER check_carts_items_products_reference ON carts_items;
DROP FUNCTION validate_carts_items_products_reference;

----------->
-- Check that a Product Item is only in a Cart once
DROP TRIGGER check_unique_product_in_cart ON carts_items;
DROP FUNCTION validate_unique_product_in_cart;

----------->
DROP TRIGGER check_categories_parent_reference ON categories;
DROP FUNCTION validate_categories_parent_reference;
