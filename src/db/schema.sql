/* executar esse comando apenas uma vez para criar a database */
CREATE DATABASE db_charges_management;

/* executar esse comando apenas uma vez para ativar a extensão */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
	"id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"cpf" text UNIQUE,
	"phone" text,
	"created_at" timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
	"id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"cpf" text NOT NULL UNIQUE,
	"phone" text NOT NULL,
	"cep" text,
	"address" text,
	"complement" text,
	"district" text,
	"city" text,
	"state" char(2),
	FOREIGN KEY ("user_id") REFERENCES users("id")
);

CREATE TABLE IF NOT EXISTS charges (
	"id" serial PRIMARY KEY,
	"customer_id" uuid NOT NULL,
	"value" bigint NOT NULL,
	"deadline" timestamptz NOT NULL,
	"is_paid" boolean NOT NULL,
	"description" text NOT NULL,
	FOREIGN KEY("customer_id") REFERENCES customers("id")
);