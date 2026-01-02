<h1 align="center">nextdns-manager</h1>
<p align="center">CLI and Web tools for managing NextDNS profiles</p>
<div align="center">
  <a href="https://github.com/abhijithvijayan/nextdns-manager/actions/workflows/test.yml">
    <img src="https://github.com/abhijithvijayan/nextdns-manager/actions/workflows/test.yml/badge.svg" alt="Tests" />
  </a>
  <a href="https://github.com/abhijithvijayan/nextdns-manager/blob/main/license">
    <img src="https://img.shields.io/github/license/abhijithvijayan/nextdns-manager.svg" alt="LICENSE" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20nextdns-manager%21%20by%20%40_abhijithv%0A%0ACLI%20and%20Web%20tools%20for%20managing%20NextDNS%20profiles%0Ahttps%3A%2F%2Fgithub.com%2Fabhijithvijayan%2Fnextdns-manager%0A%0A%23nextdns%20%23dns%20%23privacy">
     <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social" alt="TWEET" />
  </a>
</div>
<h3 align="center">Made by <a href="https://twitter.com/_abhijithv">@abhijithvijayan</a></h3>
<p align="center">
  Donate:
  <a href="https://www.paypal.me/iamabhijithvijayan" target='_blank'><i><b>PayPal</b></i></a>,
  <a href="https://www.patreon.com/abhijithvijayan" target='_blank'><i><b>Patreon</b></i></a>
</p>
<p align="center">
  <a href='https://www.buymeacoffee.com/abhijithvijayan' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png' border='0' alt='Buy Me a Coffee' />
  </a>
</p>
<hr />

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
  - [Manage Domain](#manage-domain)
  - [Sync Lists](#sync-lists)
  - [Diff Profiles](#diff-profiles)
  - [Copy Profile](#copy-profile)
- [Web App](#web-app)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Issues](#issues)
- [License](#license)

## Features

- **Manage domains across all profiles** - Add, remove, enable, or disable domains from allowlist/denylist across all profiles with a single command
- **Sync denylist/allowlist across profiles** - Automatically sync domains across all profiles using majority voting
- **Diff profiles** - Visualize differences between NextDNS profiles in a table format
- **Clone profiles** - Copy entire NextDNS profiles including:
  - Security settings (threat intelligence, safe browsing, cryptojacking protection, etc.)
  - Privacy settings (blocklists, native tracking blockers)
  - Parental control settings (safe search, services, categories)
  - Denylist and allowlist entries
  - Custom rewrites
  - General settings (logs, block page, performance, web3)
- Automatic verification of cloned profiles
- Schema validation to detect API changes

## Project Structure

```
source/
├── core/           # Shared TypeScript library (used by CLI and Web)
│   ├── api.ts          # NextDNS API client with injectable HTTP adapter
│   ├── types.ts        # Shared TypeScript types
│   ├── manage-domain.ts
│   ├── sync-lists.ts
│   ├── diff-profiles.ts
│   ├── copy-profile.ts
│   └── index.ts        # Public exports
├── cli/            # Node.js CLI application
│   └── src/
│       ├── index.ts        # CLI entry point
│       └── commands/       # Command implementations
└── web/            # Next.js web application
    └── src/
        └── lib/api.ts      # Web-specific API adapter (Cloudflare proxy)
```

## Installation

Requires Node.js 18 or later.

```sh
cd source/cli
npm install
npm run build
```

Run commands with:

```sh
node dist/cli/src/index.js <command> [options]
```

Or link globally:

```sh
npm link
nextdns <command> [options]
```

## Usage

### Manage Domain

Add, remove, enable, or disable a domain in the allowlist or denylist across all profiles.

```sh
nextdns manage -k <API_KEY> -d <DOMAIN> -l <LIST> [-a <ACTION>] [-p <PROFILES>]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `-k`, `--api-key` | NextDNS API key |
| `-d`, `--domain` | Domain to manage (e.g., `example.com`) |
| `-l`, `--list` | Target list: `allowlist` or `denylist` |
| `-a`, `--action` | Action: `add` (default), `remove`, `enable`, or `disable` |
| `-p`, `--profiles` | Specific profile IDs to target (default: all profiles) |

#### Examples

```sh
# Add domain to denylist across all profiles
nextdns manage -k "your-api-key" -d "malware.com" -l denylist

# Add domain to allowlist
nextdns manage -k "your-api-key" -d "trusted.com" -l allowlist

# Disable a domain (keep it but inactive)
nextdns manage -k "your-api-key" -d "example.com" -l denylist -a disable

# Enable a previously disabled domain
nextdns manage -k "your-api-key" -d "example.com" -l denylist -a enable

# Remove a domain
nextdns manage -k "your-api-key" -d "example.com" -l denylist -a remove

# Target specific profiles only
nextdns manage -k "your-api-key" -d "example.com" -l denylist -p abc123 def456
```

### Sync Lists

Synchronize denylist and allowlist domains across all NextDNS profiles using majority voting.

```sh
nextdns sync -k <API_KEY> [-l <LIST>] [-p <PROFILES>] [--dry-run]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `-k`, `--api-key` | NextDNS API key |
| `-l`, `--list` | Which list to sync: `allowlist`, `denylist`, or `both` (default: both) |
| `-p`, `--profiles` | Specific profile IDs to sync (default: all profiles) |
| `--dry-run` | Show what would be synced without making changes |

#### How It Works

1. Fetches all domains from denylist/allowlist across all profiles
2. For each domain, determines the canonical state using majority voting (enabled wins ties)
3. Adds missing domains to profiles that don't have them
4. Updates domain status where it differs from the canonical state

#### Examples

```sh
# Sync both lists across all profiles
nextdns sync -k "your-api-key"

# Preview changes without applying (dry run)
nextdns sync -k "your-api-key" --dry-run

# Sync only denylist
nextdns sync -k "your-api-key" -l denylist

# Sync specific profiles only
nextdns sync -k "your-api-key" -p abc123 def456
```

### Diff Profiles

Visualize differences between NextDNS profiles in a table format.

```sh
nextdns diff -k <API_KEY> [-p <PROFILES>] [-s <SECTION>] [--diff-only]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `-k`, `--api-key` | NextDNS API key |
| `-p`, `--profiles` | Specific profile IDs to compare (default: all profiles) |
| `-s`, `--section` | Section to compare: `all`, `lists`, `security`, `privacy`, `parental`, `settings` (default: all) |
| `--diff-only` | Only show rows with differences |

#### Examples

```sh
# Compare all profiles across all sections
nextdns diff -k "your-api-key"

# Show only differences
nextdns diff -k "your-api-key" --diff-only

# Compare only security settings
nextdns diff -k "your-api-key" -s security

# Compare specific profiles
nextdns diff -k "your-api-key" -p abc123 def456
```

### Copy Profile

Clone an entire NextDNS profile to a new profile.

```sh
nextdns copy -s <SOURCE_API_KEY> -d <DEST_API_KEY> -p <PROFILE_ID> [-f]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `-s`, `--source-key` | API key for the source NextDNS account |
| `-d`, `--dest-key` | API key for the destination NextDNS account |
| `-p`, `--profile-id` | Profile ID to clone from the source account |
| `-f`, `--force` | Force copy even if unknown API fields are detected |

#### Example

```sh
nextdns copy -s "source-api-key" -d "dest-api-key" -p "a1b2c3"
```

### Getting Your API Key

1. Log in to your NextDNS account
2. Navigate to Account settings
3. Generate or copy your API key

## Web App

A Next.js web application is available in `source/web/` that uses the shared core library with a Cloudflare Workers proxy.

```sh
cd source/web
npm install
npm run dev
```

The web app routes API calls through `/api/nextdns` to a Cloudflare Worker that handles authentication.

## Fields Copied

### Security

| API Field | NextDNS Setting |
|-----------|-----------------|
| `threatIntelligenceFeeds` | Threat Intelligence Feeds |
| `aiThreatDetection` | AI-Driven Threat Detection |
| `googleSafeBrowsing` | Google Safe Browsing |
| `cryptojacking` | Cryptojacking Protection |
| `dnsRebinding` | DNS Rebinding Protection |
| `idnHomographs` | IDN Homograph Attacks Protection |
| `typosquatting` | Typosquatting Protection |
| `dga` | Domain Generation Algorithms (DGAs) Protection |
| `nrd` | Block Newly Registered Domains (NRDs) |
| `ddns` | Block Dynamic DNS Hostnames |
| `parking` | Block Parked Domains |
| `csam` | Block Child Sexual Abuse Material |
| `tlds` | Block Top-Level Domains (TLDs) |

### Privacy

| API Field | NextDNS Setting |
|-----------|-----------------|
| `blocklists` | Blocklists (NextDNS, Steven Black, AdGuard, OISD, etc.) |
| `natives` | Native Tracking Protection (Windows, Apple, Samsung, etc.) |
| `disguisedTrackers` | Block Disguised Third-Party Trackers |
| `allowAffiliate` | Allow Affiliate & Tracking Links |

### Parental Control

| API Field | NextDNS Setting |
|-----------|-----------------|
| `services` | Websites, Apps & Games (TikTok, Snapchat, Roblox, etc.) |
| `categories` | Categories (Porn, Gambling, Dating, Piracy) |
| `safeSearch` | SafeSearch |
| `youtubeRestrictedMode` | YouTube Restricted Mode |
| `blockBypass` | Block Bypass Methods |

### Settings

| API Field | NextDNS Setting |
|-----------|-----------------|
| `logs` | Logs (enabled, privacy adjustments, retention, location) |
| `blockPage` | Block Page |
| `performance` | Performance (EDNS Client Subnet, Cache Boost, CNAME Flattening) |
| `bav` | Bypass Age Verification |
| `web3` | Web3 (ENS, Unstoppable Domains, Handshake, IPFS) |

### Other

| Section | Description |
|---------|-------------|
| Denylist | All entries with active status |
| Allowlist | All entries with active status |
| Rewrites | All custom DNS rewrites |

## Fields NOT Copied

These fields cannot be copied via the API and require manual configuration:

| Field | NextDNS Setting | Reason |
|-------|-----------------|--------|
| `id` | Profile ID | Auto-generated by NextDNS for new profile |
| `fingerprint` | Profile fingerprint | Auto-generated by NextDNS for new profile |
| `setup` | Setup (DNS IPs, linked IP) | Auto-generated by NextDNS for new profile |
| `parentalControl.recreation` | Recreation Time | Not supported by API for write operations |

## Schema Validation

The tools validate the API response against known fields. If NextDNS adds new features, you'll see a warning:

```
WARNING: Unknown fields detected in API response!
This script may be outdated and missing new NextDNS features.
  - Unknown field(s) at 'security': newFeature

To proceed anyway, use the --force flag.
```

## Running Tests

```sh
cd source/cli
npm test
```

## API Documentation

For more information about the NextDNS API, see the [official API documentation](https://nextdns.github.io/api/).

## Issues

_Looking to contribute? Look for the [Good First Issue](https://github.com/abhijithvijayan/nextdns-manager/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22good+first+issue%22) label._

### Bugs

Please file an issue [here](https://github.com/abhijithvijayan/nextdns-manager/issues/new) for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/abhijithvijayan/nextdns-manager/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22type%3A+bug%22)

## License

MIT © [Abhijith Vijayan](https://abhijithvijayan.in)
