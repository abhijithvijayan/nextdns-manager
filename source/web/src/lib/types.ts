/**
 * Re-export types from shared core
 * This allows web app to use shared types while maintaining the import path
 */
export type {
  Profile,
  ProfileData,
  ProfileSecurity,
  ProfilePrivacy,
  ProfileParentalControl,
  ProfileSettings,
  DomainEntry,
  BlocklistEntry,
  NativeEntry,
  ServiceEntry,
  CategoryEntry,
  TldEntry,
  RewriteEntry,
  ListType,
  DomainAction,
  OperationResult,
  SyncOperation,
  ApiResponse,
} from '@core/types';

// Re-export core functions for use in components
export {
  manageDomain,
  getAllProfiles,
  syncLists,
  analyzeSync,
  diffProfiles,
  formatDiffAsText,
  copyProfile,
  validateApiSchema,
  reconstructPayload,
} from '@core/index';

export type {
  ManageDomainOptions,
  ManageDomainCallbacks,
  SyncListsOptions,
  SyncAnalysis,
  SyncTarget,
  SyncResult,
  SyncCallbacks,
  DiffOptions,
  DiffSection,
  DiffResult,
  CopyProfileOptions,
  CopyCallbacks,
  CopyResult,
} from '@core/index';
