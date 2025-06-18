CREATE TABLE "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "carts_key_unique" UNIQUE("key"),
	CONSTRAINT "carts_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "carts_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"cartId" integer NOT NULL,
	"productId" integer NOT NULL,
	CONSTRAINT "carts_items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"parentKey" uuid,
	CONSTRAINT "categories_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "categories_images" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"url" varchar(255) NOT NULL,
	"mimetype" varchar(255),
	"categoryId" integer NOT NULL,
	CONSTRAINT "file_url_check1" CHECK ("categories_images"."url" ~ '^https?:\/\/(?:www\.)?[-\w@:%._\+~#=]+(\.[a-zA-Z]+)?(?:[-\w@:%_\+.~#?&\/\/=]*)$')
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "orders_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "orders_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"orderId" integer NOT NULL,
	"productId" integer NOT NULL,
	CONSTRAINT "orders_items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products_images" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"url" varchar(255) NOT NULL,
	"mimetype" varchar(255),
	"isCover" boolean DEFAULT false NOT NULL,
	"productId" integer NOT NULL,
	CONSTRAINT "file_url_check1" CHECK ("products_images"."url" ~ '^https?:\/\/(?:www\.)?[-\w@:%._\+~#=]+(\.[a-zA-Z]+)?(?:[-\w@:%_\+.~#?&\/\/=]*)$')
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "products_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"isFavorite" boolean DEFAULT false NOT NULL,
	"isOnCart" boolean DEFAULT false NOT NULL,
	"isLabeled" boolean DEFAULT false NOT NULL,
	"labelContent" varchar(255) DEFAULT '' NOT NULL,
	"labelColor" varchar(7) DEFAULT '#000000' NOT NULL,
	"override_price" numeric(20, 2),
	"quantity" integer DEFAULT 1 NOT NULL,
	"color" varchar(255),
	"size" varchar(255),
	"productId" integer NOT NULL,
	CONSTRAINT "products_items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_key_unique" UNIQUE("key"),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_cartId_carts_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentKey_categories_key_fk" FOREIGN KEY ("parentKey") REFERENCES "public"."categories"("key") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories_images" ADD CONSTRAINT "categories_images_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_images" ADD CONSTRAINT "products_images_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_items" ADD CONSTRAINT "products_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;