CREATE TABLE "categories_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"categoryId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"mimetype" varchar(255) NOT NULL,
	CONSTRAINT "categories_images_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"productId" integer NOT NULL,
	CONSTRAINT "products_items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "products_images" ADD COLUMN "filename" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_images" ADD CONSTRAINT "categories_images_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_items" ADD CONSTRAINT "products_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_images" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "products_images" DROP COLUMN "path";