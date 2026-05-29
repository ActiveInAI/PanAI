/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PanAI 基础组件库统一导出 / PanAI base components unified exports
 *
 * 提供所有基础组件和类型的统一导出入口
 * Provides unified export entry for all base components and types
 */

// ==================== 组件导出 / Component Exports ====================

export { default as PanModal } from './PanModal';
export { default as PanCollapse } from './PanCollapse';
export { default as PanSelect } from './PanSelect';
export { default as PanScrollArea } from './PanScrollArea';
export { default as PanSteps } from './PanSteps';

// ==================== 类型导出 / Type Exports ====================

// PanModal 类型 / PanModal types
export type {
  ModalSize,
  ModalHeaderConfig,
  ModalFooterConfig,
  ModalContentStyleConfig,
  PanModalProps,
} from './PanModal';
export { MODAL_SIZES } from './PanModal';

// PanCollapse 类型 / PanCollapse types
export type { PanCollapseProps, PanCollapseItemProps } from './PanCollapse';

// PanSelect 类型 / PanSelect types
export type { PanSelectProps } from './PanSelect';

// PanSteps 类型 / PanSteps types
export type { PanStepsProps } from './PanSteps';
