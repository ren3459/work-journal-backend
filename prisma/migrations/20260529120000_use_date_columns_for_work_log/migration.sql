-- Store work dates as calendar dates without time.
ALTER TABLE "WorkLog" ALTER COLUMN "date" TYPE DATE USING "date"::date;
ALTER TABLE "WorkLog" ALTER COLUMN "completedAt" TYPE DATE USING "completedAt"::date;
