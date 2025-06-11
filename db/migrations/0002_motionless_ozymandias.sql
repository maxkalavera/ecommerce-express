ALTER TABLE "categories_images" RENAME COLUMN "name" TO "url";--> statement-breakpoint
ALTER TABLE "categories_images" ALTER COLUMN "mimetype" DROP NOT NULL;