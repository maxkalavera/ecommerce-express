ALTER TABLE "products" ADD COLUMN "displayImageId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_displayImageId_unique" UNIQUE("displayImageId");