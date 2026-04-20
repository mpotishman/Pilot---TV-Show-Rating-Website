"use server";

import { insertRating, insertSeasonRating } from "@/lib/ratings";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitRating(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.user?.id) {
    return { errors: { auth: "You must be logged in to submit a rating" } };
  }

  const userId = currentUser.user.id;
  const rating = formData.get("rating");
  const review = formData.get("review") || "";
  const showId = formData.get("showId");
  const seasonNumber = formData.get("season");
  const episodeNumber = formData.get("episode");
  // We grab the username from the hidden field to help with the redirect path
  const username = formData.get("username") || currentUser.user.username;

  let errors = {};

  if (!rating) {
    errors.rating = "Please select a rating";
  } else {
    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      errors.rating = "Rating must be between 1-5 stars";
    }
  }

  if (review && review.length > 500) {
    errors.review = "Review cannot be more than 500 characters";
  }

  if (!showId || !seasonNumber || !episodeNumber) {
    errors.general = "Missing episode information";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await insertRating(
      userId,
      showId,
      parseInt(seasonNumber, 10),
      parseInt(episodeNumber, 10),
      parseInt(rating, 10),
      review
    );

    // Revalidate the page so the new data shows up immediately
    revalidatePath(
      `/${username}/shows/${showId}?tab=episodes&season=${seasonNumber}&episode=${episodeNumber}`
    );

    return { success: true };
  } catch (error) {
    console.error("Error inserting rating:", error);
    return { errors: { general: "Failed to save rating. Please try again." } };
  }
}

export async function submitSeasonRating(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.user?.id) {
    return { errors: { auth: "You must be logged in to submit a rating" } };
  }

  const userId = currentUser.user.id;
  // form fields we expect (names must match client form):
  // - average_season_rating (may be ""), - season-rating-comment, - showId, - season
  const seasonRatingRaw = formData.get("average_season_rating");
  const seasonReview = formData.get("season-rating-comment") || "";
  const showId = formData.get("showId");
  const seasonNumber = formData.get("season");

  const username = currentUser.user.username;

  // validation
  let errors = {};
  if (!seasonReview || String(seasonReview).trim().length === 0) {
    errors.review = "Cannot submit empty season review";
  } else if (seasonReview.length > 500) {
    errors.review = "Season review cannot be over 500 characters";
  }

  if (!showId || !seasonNumber) {
    errors.general = "Missing show/season information";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // parse numeric average if present
  let avgValue = null;
  if (seasonRatingRaw != null && String(seasonRatingRaw).trim() !== "") {
    const parsed = Number(seasonRatingRaw);
    if (Number.isFinite(parsed)) {
      avgValue = parsed;
    } else {
      // ignore invalid average (treat as null)
      avgValue = null;
    }
  }

  try {
    // call insertSeasonRating with correct order: userId, showId, season_number, average_rating, season_review
    await insertSeasonRating(
      userId,
      showId,
      parseInt(seasonNumber, 10),
      avgValue,
      seasonReview
    );

    // Revalidate the page so the new data shows up immediately
    revalidatePath(`/${username}/shows/${showId}?tab=episodes&season=${seasonNumber}`);

    return { success: true };
  } catch (error) {
    console.error("Error inserting season rating:", error);
    return { errors: { general: "Failed to save season rating. Please try again." } };
  }
}
