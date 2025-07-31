ALTER TABLE "carts_items" RENAME COLUMN "product_id" TO "product_item_id";--> statement-breakpoint
ALTER TABLE "carts_items" RENAME COLUMN "product_key" TO "product_item_key";--> statement-breakpoint
ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_product_key_products_key_fk";
--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_item_id_products_items_id_fk" FOREIGN KEY ("product_item_id") REFERENCES "public"."products_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_item_key_products_items_key_fk" FOREIGN KEY ("product_item_key") REFERENCES "public"."products_items"("key") ON DELETE cascade ON UPDATE no action;

