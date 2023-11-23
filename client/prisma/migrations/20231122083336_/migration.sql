-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[];
