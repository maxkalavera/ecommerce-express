ALTER TABLE "categories_images" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_images" ADD COLUMN "key" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "products_images" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "products_images" ADD COLUMN "key" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_images" ADD CONSTRAINT "categories_images_key_unique" UNIQUE("key");--> statement-breakpoint
ALTER TABLE "products_images" ADD CONSTRAINT "products_images_key_unique" UNIQUE("key");