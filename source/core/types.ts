/**
 * NextDNS API Types
 * Shared between CLI and Web
 */

export interface Profile {
  id: string;
  fingerprint?: string;
  name: string;
}

export interface DomainEntry {
  id: string;
  active: boolean;
}

export interface BlocklistEntry {
  id: string;
}

export interface NativeEntry {
  id: string;
}

export interface ServiceEntry {
  id: string;
  active: boolean;
}

export interface CategoryEntry {
  id: string;
  active: boolean;
}

export interface TldEntry {
  id: string;
}

export interface RewriteEntry {
  id?: string;
  name: string;
  content: string;
  type?: string;
}

export interface ProfileSecurity {
  threatIntelligenceFeeds: boolean;
  aiThreatDetection: boolean;
  googleSafeBrowsing: boolean;
  cryptojacking: boolean;
  dnsRebinding: boolean;
  idnHomographs: boolean;
  typosquatting: boolean;
  dga: boolean;
  nrd: boolean;
  ddns: boolean;
  parking: boolean;
  csam: boolean;
  newlyActiveDomains?: boolean;
  algorithmicallyGeneratedDomains?: boolean;
  freeHostingDomains?: boolean;
  tunnelingEndpoints?: boolean;
  dataDropServices?: boolean;
  residentialHosting?: boolean;
  untrustedCertificates?: boolean;
  fastFluxNetworks?: boolean;
  dnsDataExfiltration?: boolean;
  dnsPayloadDelivery?: boolean;
  decentralizedWebGateways?: boolean;
  highRiskTlds?: boolean;
  tlds?: TldEntry[];
}

export interface ProfilePrivacy {
  blocklists?: BlocklistEntry[];
  natives?: NativeEntry[];
  disguisedTrackers: boolean;
  rotatingAdDomains?: boolean;
  allowAffiliate: boolean;
}

export interface ProfileParentalControl {
  safeSearch: boolean;
  youtubeRestrictedMode: boolean;
  blockBypass: boolean;
  services?: ServiceEntry[];
  categories?: CategoryEntry[];
  recreation?: unknown;
}

export interface ProfileSettings {
  logs?: {
    enabled: boolean;
    drop?: {
      ip: boolean;
      domain: boolean;
    };
    retention?: number;
    location?: string;
  };
  blockPage?: {
    enabled: boolean;
  };
  performance?: {
    ecs: boolean;
    cacheBoost: boolean;
    cnameFlattening: boolean;
    handshake?: boolean;
  };
  web3?: boolean;
  bav?: boolean;
}

export interface ProfileData {
  id: string;
  fingerprint?: string;
  name: string;
  setup?: unknown;
  security?: ProfileSecurity;
  privacy?: ProfilePrivacy;
  parentalControl?: ProfileParentalControl;
  denylist?: DomainEntry[];
  allowlist?: DomainEntry[];
  settings?: ProfileSettings;
  rewrites?: RewriteEntry[];
}

export type ListType = 'allowlist' | 'denylist';

export type DomainAction = 'add' | 'remove' | 'enable' | 'disable';

export interface ApiError {
  code: string;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  errors?: ApiError[];
}

// Operation result types for CLI/Web feedback
export interface OperationResult {
  profileId: string;
  profileName: string;
  success: boolean;
  error?: string;
}

export interface SyncOperation {
  type: 'add' | 'update';
  profileId: string;
  profileName: string;
  domain: string;
  shouldBeActive: boolean;
  listType: ListType;
}

export interface DiffRow {
  label: string;
  values: Map<string, string>;
  hasDiff: boolean;
}

export interface DiffSection {
  title: string;
  rows: DiffRow[];
  legend?: string;
}

/**
 * Boolean security toggles that have always been part of the API.
 * Copy falls back to a default when the source omits one of these.
 */
export const LEGACY_SECURITY_TOGGLE_FIELDS = [
  'threatIntelligenceFeeds',
  'aiThreatDetection',
  'googleSafeBrowsing',
  'cryptojacking',
  'dnsRebinding',
  'idnHomographs',
  'typosquatting',
  'dga',
  'nrd',
  'ddns',
  'parking',
  'csam',
] as const;

/**
 * Boolean security toggles added later by NextDNS.
 * Copied only when the source profile actually returns them.
 */
export const NEW_SECURITY_TOGGLE_FIELDS = [
  'newlyActiveDomains',
  'algorithmicallyGeneratedDomains',
  'freeHostingDomains',
  'tunnelingEndpoints',
  'dataDropServices',
  'residentialHosting',
  'untrustedCertificates',
  'fastFluxNetworks',
  'dnsDataExfiltration',
  'dnsPayloadDelivery',
  'decentralizedWebGateways',
  'highRiskTlds',
] as const;

/**
 * Deprecated by NextDNS: still accepted, but always read back as false and
 * ignored on writes. Kept in copy payloads, hidden from diffs.
 */
export const DEPRECATED_SECURITY_FIELDS = [
  'idnHomographs',
  'typosquatting',
  'dga',
] as const;

export const SECURITY_TOGGLE_FIELDS = [
  ...LEGACY_SECURITY_TOGGLE_FIELDS,
  ...NEW_SECURITY_TOGGLE_FIELDS,
] as const;

/** Security toggles worth showing when comparing profiles, in dashboard order. */
export const SECURITY_DIFF_FIELDS = [
  'threatIntelligenceFeeds',
  'aiThreatDetection',
  'googleSafeBrowsing',
  'nrd',
  'newlyActiveDomains',
  'algorithmicallyGeneratedDomains',
  'freeHostingDomains',
  'ddns',
  'tunnelingEndpoints',
  'residentialHosting',
  'untrustedCertificates',
  'dataDropServices',
  'fastFluxNetworks',
  'dnsDataExfiltration',
  'dnsPayloadDelivery',
  'dnsRebinding',
  'cryptojacking',
  'decentralizedWebGateways',
  'parking',
  'highRiskTlds',
  'csam',
] as const;

export const LEGACY_PRIVACY_TOGGLE_FIELDS = [
  'disguisedTrackers',
  'allowAffiliate',
] as const;

export const NEW_PRIVACY_TOGGLE_FIELDS = ['rotatingAdDomains'] as const;

export const PRIVACY_TOGGLE_FIELDS = [
  'disguisedTrackers',
  'rotatingAdDomains',
  'allowAffiliate',
] as const;

// Known fields for schema validation
export const KNOWN_FIELDS = {
  root: new Set<string>([
    'id',
    'fingerprint',
    'name',
    'setup',
    'security',
    'privacy',
    'parentalControl',
    'denylist',
    'allowlist',
    'settings',
    'rewrites',
  ]),
  security: new Set<string>([...SECURITY_TOGGLE_FIELDS, 'tlds']),
  privacy: new Set<string>([...PRIVACY_TOGGLE_FIELDS, 'blocklists', 'natives']),
  parentalControl: new Set<string>([
    'safeSearch',
    'youtubeRestrictedMode',
    'blockBypass',
    'services',
    'categories',
    'recreation',
  ]),
  settings: new Set<string>([
    'logs',
    'blockPage',
    'performance',
    'web3',
    'bav',
  ]),
  'settings.logs': new Set<string>([
    'enabled',
    'drop',
    'retention',
    'location',
  ]),
  'settings.performance': new Set<string>([
    'ecs',
    'cacheBoost',
    'cnameFlattening',
  ]),
};

export const SKIPPED_FIELDS = {
  root: new Set<string>(['id', 'fingerprint', 'setup']),
  parentalControl: new Set<string>(['recreation']),
};
