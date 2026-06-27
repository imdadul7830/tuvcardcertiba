import { pgTable, text, jsonb, integer, bigint } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
  due: integer('due').notNull().default(0),
  iqamaNumber: text('iqama_number'),
  companyName: text('company_name'),
  companyCrNumber: text('company_cr_number'),
});

export const trainees = pgTable('trainees', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  iqama: text('iqama').notNull(),
  company: text('company').notNull(),
  project: text('project').notNull(),
  course: text('course').notNull(),
  photoUrl: text('photo_url').notNull(),
  issueDate: text('issue_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  trainedBy: text('trained_by').notNull(),
  approvedBy: text('approved_by').notNull(),
  levelCategory: text('level_category').notNull(),
  status: text('status').notNull(),
  addedBy: text('added_by'),
  createdAt: bigint('created_at', { mode: 'number' }),
});

export const settings = pgTable('settings', {
  id: text('id').primaryKey(),
  courses: jsonb('courses').notNull().default([]),
  branches: jsonb('branches').notNull().default([]),
});

export const siteContent = pgTable('site_content', {
  id: text('id').primaryKey(),
  data: jsonb('data').notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(), // e.g. INV-123456
  userId: text('user_id').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'paid'
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});

export const notices = pgTable('notices', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  userId: text('user_id'), // null means all users
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});


