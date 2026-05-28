/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ICssTheme } from '@/common/config/storage.ts';

import { defaultThemeCover } from './themeCovers.ts';

// Theme CSS loaded as raw strings via Vite ?raw imports
import defaultCss from './presets/default.css?raw';

/**
 * 默认主题 ID / Default theme ID
 * 用于标识默认主题（无自定义 CSS）/ Used to identify the default theme (no custom CSS)
 */
export const DEFAULT_THEME_ID = 'default-theme';

/**
 * 预设 CSS 主题列表 / Preset CSS themes list
 */
export const PRESET_THEMES: ICssTheme[] = [
  {
    id: DEFAULT_THEME_ID,
    name: 'PanAI Default',
    is_preset: true,
    cover: defaultThemeCover,
    css: defaultCss,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
];
