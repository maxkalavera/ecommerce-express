CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" uuid DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"price" numeric(20, 2) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"isFavorite" boolean DEFAULT false NOT NULL,
	"isOnCart" boolean DEFAULT false NOT NULL,
	"isLabeled" boolean DEFAULT false NOT NULL,
	"labelContent" varchar(255) DEFAULT '' NOT NULL,
	"labelColor" varchar(7) DEFAULT '#000000' NOT NULL,
	CONSTRAINT "price_check1" CHECK ("products"."price" > 0),
	CONSTRAINT "labelColor_check1" CHECK ("products"."labelColor" ~ '^#[0-9a-f]{6}$')
);
