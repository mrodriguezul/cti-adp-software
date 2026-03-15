-- CreateTable
CREATE TABLE "lpa_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(50),
    "lastname" VARCHAR(50),
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "status" CHAR(1) NOT NULL DEFAULT 'A',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lpa_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lpa_stock" (
    "id" SERIAL NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "onhand" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" CHAR(1) NOT NULL DEFAULT 'A',
    "image_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lpa_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lpa_clients" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "address" VARCHAR(255),
    "phone" VARCHAR(30),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" CHAR(1) NOT NULL DEFAULT 'A',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lpa_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lpa_invoices" (
    "id" SERIAL NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "client_id" INTEGER NOT NULL,
    "client_name" VARCHAR(100),
    "client_address" VARCHAR(255),
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "status" CHAR(1) NOT NULL DEFAULT 'U',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lpa_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lpa_invoice_items" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "stock_name" VARCHAR(255),
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lpa_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lpa_users_username_key" ON "lpa_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "lpa_stock_sku_key" ON "lpa_stock"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "lpa_clients_email_key" ON "lpa_clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lpa_invoices_invoice_number_key" ON "lpa_invoices"("invoice_number");

-- AddForeignKey
ALTER TABLE "lpa_invoices" ADD CONSTRAINT "lpa_invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "lpa_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lpa_invoice_items" ADD CONSTRAINT "lpa_invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "lpa_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lpa_invoice_items" ADD CONSTRAINT "lpa_invoice_items_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "lpa_stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
