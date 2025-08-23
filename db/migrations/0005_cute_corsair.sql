ALTER TABLE "products" DROP CONSTRAINT "color_hex";--> statement-breakpoint
ALTER TABLE "products_items" ADD COLUMN "color" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "products_items" ADD COLUMN "color_hex" varchar(7) DEFAULT '#000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "color_hex";--> statement-breakpoint
ALTER TABLE "products_items" ADD CONSTRAINT "color_hex" CHECK ("products_items"."color_hex" ~ '^#[0-9a-fA-F]{6}$');