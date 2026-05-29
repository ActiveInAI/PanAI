/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { getPlatformServices } from '@/common/platform';

/**
 * Returns baseName unchanged in release builds, or baseName + '-dev' in dev builds.
 * When PANAI_MULTI_INSTANCE=1, appends '-2' to isolate the second dev instance.
 * Used to isolate symlink and directory names between environments.
 *
 * @example
 * getEnvAwareName('.panai')         // release -> '.panai',         dev -> '.panai-dev'
 * getEnvAwareName('.panai-config')  // release -> '.panai-config',  dev -> '.panai-config-dev'
 * // with PANAI_MULTI_INSTANCE=1:  dev -> '.panai-dev-2'
 */
export function getEnvAwareName(baseName: string): string {
  if (getPlatformServices().paths.isPackaged() === true) return baseName;
  const suffix = (process.env.PANAI_MULTI_INSTANCE ?? process.env.PANAI_MULTI_INSTANCE) === '1' ? '-dev-2' : '-dev';
  return `${baseName}${suffix}`;
}
