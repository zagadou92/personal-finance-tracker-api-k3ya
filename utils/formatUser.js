// utils/formatUser.js
export function formatGoogleProfile(profile) {
  return {
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name?.givenName || null,
    lastName: profile.name?.familyName || null,
    email: profile.emails?.[0]?.value || null,
    emailVerified: profile.emails?.[0]?.verified || false,
    photo: profile.photos?.[0]?.value || null,
    provider: profile.provider,
    createdAt: new Date()
  };
}
