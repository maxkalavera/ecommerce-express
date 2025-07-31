ALTER TABLE "carts" ADD COLUMN "userKey" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "carts_items" ADD COLUMN "cartkKey" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "carts_items" ADD COLUMN "productKey" uuid;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_userKey_users_key_fk" FOREIGN KEY ("userKey") REFERENCES "public"."users"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_cartkKey_carts_key_fk" FOREIGN KEY ("cartkKey") REFERENCES "public"."carts"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_productKey_products_key_fk" FOREIGN KEY ("productKey") REFERENCES "public"."products"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_userKey_unique" UNIQUE("userKey");