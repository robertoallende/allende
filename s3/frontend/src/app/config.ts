/**
 * Application Configuration
 * 
 * This file contains feature flags and UI configuration options
 * that can be toggled to enable/disable various interface elements.
 */

export interface AppConfig {
  ui: {
    /** Show/hide the theme selector */
    showThemeSelector: boolean;
  };
  /** Default theme for the website */
  theme: "default" | "dark" | "claude";
}

/**
 * Default application configuration
 * 
 * To modify these settings:
 * 1. Change the values below
 * 2. Restart the development server
 */
export const appConfig: AppConfig = {
  ui: {
    showThemeSelector: true,   // Show theme selector so users can change themes
  },
  theme: "claude",  // Set Claude as default theme
};

/**
 * Get current app configuration
 */
export function getAppConfig(): AppConfig {
  return appConfig;
}
