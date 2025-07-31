ALTER TABLE "carts" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "carts" RENAME COLUMN "userKey" TO "user_key";--> statement-breakpoint
ALTER TABLE "carts_items" RENAME COLUMN "cartId" TO "cart_id";--> statement-breakpoint
ALTER TABLE "carts_items" RENAME COLUMN "cartkKey" TO "cart_key";--> statement-breakpoint
ALTER TABLE "carts_items" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "carts_items" RENAME COLUMN "productKey" TO "product_key";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "parentKey" TO "parent_key";--> statement-breakpoint
ALTER TABLE "categories_images" RENAME COLUMN "categoryId" TO "category_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "orders_items" RENAME COLUMN "orderId" TO "order_id";--> statement-breakpoint
ALTER TABLE "orders_items" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "override_price" TO "price";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "colorHex" TO "color_hex";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "isLabeled" TO "is_labeled";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "labelContent" TO "label_content";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "labelColor" TO "label_color";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "categoryId" TO "category_id";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "categoryKey" TO "category_key";--> statement-breakpoint
ALTER TABLE "products_images" RENAME COLUMN "isCover" TO "is_cover";--> statement-breakpoint
ALTER TABLE "products_items" RENAME COLUMN "isFavorite" TO "is_favorite";--> statement-breakpoint
ALTER TABLE "products_items" RENAME COLUMN "isOnCart" TO "is_on_cart";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_unique";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_userKey_unique";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "label_color_hex";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "color_hex";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "positive_price";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_userKey_users_key_fk";
--> statement-breakpoint
ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_cartId_carts_id_fk";
--> statement-breakpoint
ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_cartkKey_carts_key_fk";
--> statement-breakpoint
ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_productKey_products_key_fk";
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentKey_categories_key_fk";
--> statement-breakpoint
ALTER TABLE "categories_images" DROP CONSTRAINT "categories_images_categoryId_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_items" DROP CONSTRAINT "orders_items_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_items" DROP CONSTRAINT "orders_items_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_categoryKey_categories_key_fk";
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_key_users_key_fk" FOREIGN KEY ("user_key") REFERENCES "public"."users"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_cart_key_carts_key_fk" FOREIGN KEY ("cart_key") REFERENCES "public"."carts"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_key_products_key_fk" FOREIGN KEY ("product_key") REFERENCES "public"."products"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_key_categories_key_fk" FOREIGN KEY ("parent_key") REFERENCES "public"."categories"("key") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories_images" ADD CONSTRAINT "categories_images_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_key_categories_key_fk" FOREIGN KEY ("category_key") REFERENCES "public"."categories"("key") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_key_unique" UNIQUE("user_key");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "label_color_hex" CHECK ("products"."label_color" ~ '^#[0-9a-fA-F]{6}$');--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "color_hex" CHECK ("products"."color_hex" ~ '^#[0-9a-fA-F]{6}$');--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "positive_price" CHECK ("products"."price" >= 0);


--> Located at 0002_fat_squadron_supreme.sql
CREATE OR REPLACE FUNCTION validate_products_categories_reference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.category_key != (SELECT key FROM categories WHERE id = NEW.category_id) THEN
		RAISE EXCEPTION 'Product category UUID key does not match category ID reference';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_product_categories_reference
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION validate_products_categories_reference();
