ALTER TABLE "carts_items" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "positive_quantity" CHECK ("carts_items"."quantity" >= 1);