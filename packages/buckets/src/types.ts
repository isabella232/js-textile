import CID from 'cids'

export const AbortError = new Error('aborted')

/**
 * Bucket create response
 */
export interface CreateResponse {
  seed: Uint8Array
  seedCid: string
  root?: Root
  links?: Links
}
/**
 * @deprecated
 */
export type CreateObject = CreateResponse

/**
 * PushOptions provides additional options for controlling a push to a bucket path.
 */
export interface PushOptions {
  /**
   * A callback function to use for monitoring push progress.
   */
  progress?: (num?: number) => void
  /**
   * The bucket root path as a string, or root object. Important to set this property when
   * there is a possibility of multiple parallel pushes to a bucket. Specifying this property
   * will enforce fast-forward only updates. It not provided explicitly, the root path will
   * be fetched via an additional API call before each push.
   */
  root?: Root | string

  /**
   * An optional abort signal to allow cancellation or aborting a bucket push.
   */
  signal?: AbortSignal
}

/**
 * The expected result format from pushing a path to a bucket
 */
export interface PushPathResult {
  path: {
    path: string
    cid: CID
    root: CID
    remainder: string
  }
  root: string
}

/**
 * Response from bucket links query.
 */
export interface Links {
  www: string
  ipns: string
  url: string
}

/**
 * @deprecated
 */
export type LinksObject = Links

/**
 * Bucket root info
 */
export interface Root {
  key: string
  name: string
  path: string
  createdAt: number
  updatedAt: number
  thread: string
}
/**
 * @deprecated
 */
export type RootObject = Root

export enum PathAccessRole {
  PATH_ACCESS_ROLE_UNSPECIFIED = 0,
  PATH_ACCESS_ROLE_READER = 1,
  PATH_ACCESS_ROLE_WRITER = 2,
  PATH_ACCESS_ROLE_ADMIN = 3,
}

export interface BuckMetadata {
  roles: Map<string, PathAccessRole>
  updatedAt: number
}
/**
 * @deprecated
 */
export type MetadataObject = BuckMetadata

/**
 * A bucket path item response
 */
export interface PathItem {
  cid: string
  name: string
  path: string
  size: number
  isDir: boolean
  items: Array<PathItem>
  count: number
  metadata?: BuckMetadata
}
/**
 * @deprecated
 */
export type PathItemObject = PathItem

/**
 * A bucket list path response
 */
export interface Path {
  item?: PathItem
  root?: Root
}
/**
 * @deprecated
 */
export type PathObject = Path

/**
 * ArchiveConfig is the desired state of a Cid in the Filecoin network.
 */
export interface ArchiveConfig {
  /**
   * RepFactor (ignored in Filecoin testnet) indicates the desired amount of active deals
   * with different miners to store the data. While making deals
   * the other attributes of FilConfig are considered for miner selection.
   */
  repFactor: number
  /**
   * DealMinDuration indicates the duration to be used when making new deals.
   */
  dealMinDuration: number
  /**
   * ExcludedMiners (ignored in Filecoin testnet) is a set of miner addresses won't be ever be selected
   * when making new deals, even if they comply to other filters.
   */
  excludedMiners: Array<string>
  /**
   * TrustedMiners (ignored in Filecoin testnet) is a set of miner addresses which will be forcibly used
   * when making new deals. An empty/nil list disables this feature.
   */
  trustedMiners: Array<string>
  /**
   * CountryCodes (ignored in Filecoin testnet) indicates that new deals should select miners on specific countries.
   */
  countryCodes: Array<string>
  /**
   * Renew indicates deal-renewal configuration.
   */
  renew?: ArchiveRenew
  /**
   * Addr is the wallet address used to store the data in filecoin
   */
  addr: string
  /**
   * MaxPrice is the maximum price that will be spent to store the data, 0 is no max
   */
  maxPrice: number
  /**
   *
   * FastRetrieval indicates that created deals should enable the
   * fast retrieval feature.
   */
  fastRetrieval: boolean
  /**
   * DealStartOffset indicates how many epochs in the future impose a
   * deadline to new deals being active on-chain. This value might influence
   * if miners accept deals, since they should seal fast enough to satisfy
   * this constraint.
   */
  dealStartOffset: number
}

/**
 * ArchiveRenew contains renew configuration for a ArchiveConfig.
 */
export interface ArchiveRenew {
  /**
   * Enabled indicates that deal-renewal is enabled for this Cid.
   */
  enabled: boolean
  /**
   * Threshold indicates how many epochs before expiring should trigger
   * deal renewal. e.g: 100 epoch before expiring.
   */
  threshold: number
}

/**
 * An object to configure options for Archive.
 */
export interface ArchiveOptions {
  /**
   * Provide a custom ArchiveConfig to override use of the default.
   */
  archiveConfig?: ArchiveConfig
}

/**
 * Information about a Filecoin deal for a bucket archive.
 */
export interface ArchiveDealInfo {
  /**
   * The cid of the deal proposal.
   */
  proposalCid: string
  /**
   * The id of the current deal state.
   */
  stateId: number
  /**
   * The name of the current deal state.
   */
  stateName: string
  /**
   * The id of the miner for the deal.
   */
  miner: string
  /**
   * The piece cid.
   */
  pieceCid: string
  /**
   * The size of the stored data in bytes, including padding.
   */
  size: number
  /**
   * The storage price in units of attoFIL per GiB per epoch.
   */
  pricePerEpoch: number
  /**
   * The start epoch of the deal.
   */
  startEpoch: number
  /**
   * The duration of the deal in epochs.
   */
  duration: number
  /**
   * The deal id.
   */
  dealId: number
  /**
   * The epoch in which the deal became active, or 0 if it is not yet active.
   */
  activationEpoch: number
  /**
   * A message from the miner.
   */
  message: string
}

/**
 * Archive job status codes
 */
export enum ArchiveStatus {
  /**
   * Status is not specified.
   */
  Unspecified,
  /**
   * The archive job is queued.
   */
  Queued,
  /**
   * The archive job is executing.
   */
  Executing,
  /**
   * The archive job has failed.
   */
  Failed,
  /**
   * The archive job was canceled.
   */
  Canceled,
  /**
   * The archive job succeeded.
   */
  Success,
}

/**
 * Information about a bucket archive.
 */
export interface Archive {
  /**
   * The data cid of the bucket at the time it was archived.
   */
  cid: string
  /**
   * The id of the archive job.
   */
  jobId: string
  /**
   * The current status of the archive job.
   */
  status: ArchiveStatus
  /**
   * Whether or not the archive was aborted.
   */
  aborted: boolean
  /**
   * If the archive was aborted, a message about why.
   */
  abortedMsg: string
  /**
   * If the archive job failed, a message about why.
   */
  failureMsg: string
  /**
   * The timestamp of when the archive was initiated.
   */
  createdAt: Date
  /**
   * A list of the underlying filecoin deal information for the archive.
   */
  dealInfo: Array<ArchiveDealInfo>
}

/**
 * Current and past archives for a bucket.
 */
export interface Archives {
  /**
   * The latest archive for a bucket in either a processing or final state.
   */
  current?: Archive
  /**
   * A list of past archives for a bucket.
   */
  history: Array<Archive>
}
