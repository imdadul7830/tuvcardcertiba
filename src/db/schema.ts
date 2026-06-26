import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
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
