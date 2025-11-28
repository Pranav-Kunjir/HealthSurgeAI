import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defained on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  hospitals: defineTable({
    name: v.string(),
    location: v.string(),
    email: v.optional(v.string()),
    hospitalName: v.optional(v.string()),
    ownerId: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  patients: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    contact: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  hospitalBeds: defineTable({
    emailId: v.string(),
    bedType: v.string(),
    hospitalName: v.optional(v.string()),
    bedNumber: v.number(),
    bedStatus: v.string(),
    patientName: v.optional(v.string()),
    patientAge: v.optional(v.number()),
    patientAdmittedAt: v.optional(v.number()),
    patientEstDischargeAt: v.optional(v.number()),
    patientVitalBPM: v.optional(v.number()),
    patientVitalSpO2: v.optional(v.number()),
    patientBP: v.optional(v.string()),
    pateintConditions: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["emailId"]),
});

