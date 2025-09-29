import 'next-themes';

declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    /**
     * The key used to store the theme in localStorage
     * @default 'vite-ui-theme'
     */
    storageKey?: string;
    /**
     * The default theme to use if no theme is stored in localStorage
     * @default 'system'
     */
    defaultTheme?: string;
    /**
     * Whether to enable system color scheme detection
     * @default true
     */
    enableSystem?: boolean;
    /**
     * Whether to disable transitions when switching themes
     * @default false
     */
    disableTransitionOnChange?: boolean;
    /**
     * The attribute to use for applying theme classes
     * @default 'class'
     */
    attribute?: string | 'class';
    /**
     * The value to use for the light theme
     * @default 'light'
     */
    value?: { [themeName: string]: string };
    /**
     * The HTML attribute to modify when the theme changes
     * @default 'class'
     */
    themes?: string[];
  }
}
