CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"parentId" integer,
	"parentKey" uuid,
	CONSTRAINT "categories_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"productId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"path" varchar(255) NOT NULL,
	CONSTRAINT "products_images_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(20, 2) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"isFavorite" boolean DEFAULT false NOT NULL,
	"isOnCart" boolean DEFAULT false NOT NULL,
	"isLabeled" boolean DEFAULT false NOT NULL,
	"labelContent" varchar(255) DEFAULT '' NOT NULL,
	"labelColor" varchar(7) DEFAULT '#000000' NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "products_key_unique" UNIQUE("key"),
	CONSTRAINT "price_check1" CHECK ("products"."price" > 0),
	CONSTRAINT "labelColor_check1" CHECK ("products"."labelColor" ~ '^#[0-9a-f]{6}$')
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_categories_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentKey_categories_key_fk" FOREIGN KEY ("parentKey") REFERENCES "public"."categories"("key") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_images" ADD CONSTRAINT "products_images_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;