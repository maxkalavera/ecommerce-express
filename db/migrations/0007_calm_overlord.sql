ALTER TABLE "carts_items" ALTER COLUMN "quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "carts_items" ADD COLUMN "price" numeric(20, 2) NOT NULL;