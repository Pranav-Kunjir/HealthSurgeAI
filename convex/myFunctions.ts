import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";

// Create a minimal hospital record for the authenticated user.


// Create a minimal patient record for the authenticated user
export const createPatientUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Fetch authenticated user document
    const user = await ctx.db.get(userId);
    const email = user?.email ?? null;

    // Check if patient already exists for this userId
    const existing = await ctx.db
      .query("patients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return existing; // Already exists → return it
    }

    // Create a new patient entry
    const record: any = {
      userId,
      name: user?.name ?? email ?? null,
      contact: email ?? null,
      createdAt: Date.now(),
    };

    const patientId = await ctx.db.insert("patients", record);

    return await ctx.db.get(patientId);
  },
});




// Get the current authenticated user's details
export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    return user;
  },
});


export const ensureHospitalForAuthenticatedUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Fetch authenticated user document
    const user = await ctx.db.get(userId);
    const email = user?.email;
    if (!email) throw new Error("Authenticated user has no email stored");

    // Check if hospital already exists with this email
    const existing = await ctx.db
      .query("hospitals")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return existing; // Already exists → return it
    }

    // Create a new hospital entry
    const hospitalId = await ctx.db.insert("hospitals", {
      name: user.name || "Unnamed Hospital",
      location: "Unknown",
      email,
      ownerId: userId,
      createdAt: Date.now(),
    });

    return await ctx.db.get(hospitalId);
  },

});



export const getBedsForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    const email = user?.email;
    if (!email) throw new Error("Authenticated user has no email");

    // Return all beds with this emailId using the by_email index
    const beds = await ctx.db
      .query("hospitalBeds")
      .withIndex("by_email", (q) => q.eq("emailId", email))
      .collect();

    // Convex returns documents — return them as-is.
    return beds;
  },
});

export const createBed = mutation({
  args: {
    bedType: v.string(),
    bedNumber: v.number(),
    bedStatus: v.string(),

    // optional patient fields
    hospitalName: v.optional(v.string()),
    patientName: v.optional(v.string()),
    patientAge: v.optional(v.number()),
    patientAdmittedAt: v.optional(v.number()),
    patientEstDischargeAt: v.optional(v.number()),
    patientVitalBPM: v.optional(v.number()),
    patientVitalSpO2: v.optional(v.number()),
    patientBP: v.optional(v.string()),
    pateintConditions: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    const email = user?.email;
    if (!email) throw new Error("Authenticated user has no email stored");

    // Basic required-field guards
    if (!args.bedType) throw new Error("bedType required");
    if (typeof args.bedNumber !== "number") throw new Error("bedNumber required");

    // Build record but OMIT undefined fields (don't set fields to null)
    const record: any = {
      emailId: email,
      bedType: args.bedType,
      bedNumber: args.bedNumber,
      bedStatus: args.bedStatus,
      createdAt: Date.now(),
    };

    // Add optional fields only when they are defined (not null/undefined)
    if (typeof args.hospitalName !== "undefined") record.hospitalName = args.hospitalName;
    if (typeof args.patientName !== "undefined") record.patientName = args.patientName;
    if (typeof args.patientAge !== "undefined") record.patientAge = args.patientAge;
    if (typeof args.patientAdmittedAt !== "undefined") record.patientAdmittedAt = args.patientAdmittedAt;
    if (typeof args.patientEstDischargeAt !== "undefined") record.patientEstDischargeAt = args.patientEstDischargeAt;
    if (typeof args.patientVitalBPM !== "undefined") record.patientVitalBPM = args.patientVitalBPM;
    if (typeof args.patientVitalSpO2 !== "undefined") record.patientVitalSpO2 = args.patientVitalSpO2;
    if (typeof args.patientBP !== "undefined") record.patientBP = args.patientBP;
    if (typeof args.pateintConditions !== "undefined") record.pateintConditions = args.pateintConditions;

    const id = await ctx.db.insert("hospitalBeds", record);
    return await ctx.db.get(id);
  },
});


export const getHospitalsForUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return []; // not authenticated -> empty list

    const user = await ctx.db.get(userId);
    const email = user?.email;
    if (!email) return []; // no email stored

    // Return all hospitals with this email (uses index "by_email" defined in schema)
    const hospitals = await ctx.db
      .query("hospitals")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    return hospitals;
  },
});


export const updateHospital = mutation({
  args: {
    hospitalId: v.id("hospitals"),
    patch: v.object({
      name: v.optional(v.string()),
      location: v.optional(v.string()),
      email: v.optional(v.string()),
      hospitalName: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { hospitalId, patch }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // get authenticated user doc (to check email if needed)
    const user = await ctx.db.get(userId);
    const userEmail = user?.email ?? null;

    const existing = await ctx.db.get(hospitalId);
    if (!existing) throw new Error("Hospital not found");

    // Debugging logs — remove in production
    console.log("updateHospital: userId:", userId?.toString?.());
    console.log("updateHospital: userId:", userId?.toString?.());
    console.log(
      "updateHospital: existing.ownerId:",
      existing.ownerId?.toString?.()
    );


    // Allow update if ownerId matches OR user email matches hospital email
    const ownerMatches =
      !!existing.ownerId && existing.ownerId.toString() === userId.toString();

    const emailMatches =
      !!userEmail && !!existing.email && userEmail.toLowerCase() === existing.email.toLowerCase();

    if (!ownerMatches && !emailMatches) {
      throw new Error("Not authorized to update this hospital");
    }

    await ctx.db.patch(hospitalId, patch);
    return await ctx.db.get(hospitalId);
  },
});

export const updatePatientForUser = mutation({
  args: {
    patch: v.object({
      name: v.optional(v.string()),
      contact: v.optional(v.string()),
      location: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { patch }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find existing patient for this user (uses patients.index("by_user"))
    const patient = await ctx.db
      .query("patients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (patient) {
      // Patch only the provided fields
      await ctx.db.patch(patient._id, patch);
      return await ctx.db.get(patient._id);
    }

    // No patient found — create a new one using provided fields
    const record: any = {
      userId,
      createdAt: Date.now(),
    };

    if (typeof patch.name !== "undefined") record.name = patch.name;
    if (typeof patch.contact !== "undefined") record.contact = patch.contact;
    if (typeof patch.location !== "undefined") record.location = patch.location;

    const id = await ctx.db.insert("patients", record);
    return await ctx.db.get(id);
  },
});