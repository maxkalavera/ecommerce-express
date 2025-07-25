  CREATE OR REPLACE FUNCTION validate_product_reference()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.product_uuid != (SELECT uuid FROM products WHERE id = NEW.product_id) THEN
      RAISE EXCEPTION 'Product UUID does not match ID reference';
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER check_product_reference
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION validate_product_reference();