import { SOCIAL_PLATFORMS } from "./socialPlatforms";

export const useSocialUrl = () => {
  const generateUrl = (platform, mode) => {
    const config = SOCIAL_PLATFORMS[platform];
    if (!config) return "";
    return config[mode] || "";
  };

  return { generateUrl };
};