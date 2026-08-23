---
title: Database Topology & Data Ownership
sidebar_label: Database Topology
description: "Which data domain is authoritative where — the platform database topology-of-record and the public cross-link to the canonical topology docs."
---

# Database Topology & Data Ownership

This page is the **public-facing summary** of the LanOnasis database
topology-of-record. It answers the recurring operational question — *which
database is authoritative for which data* — without exposing the connection
details that live in the private backend repository.

The canonical topology documentation is maintained in internal operator
documentation. This page stays in sync with it and contains only the approved
public summary; if a statement here disagrees with the internal documentation,
the internal documentation wins.

## Source-of-truth map

| Data domain | Source of truth | Notes |
| --- | --- | --- |
| Memory data (MaaS / intelligence) | Primary platform Supabase project | `maas.memory_entries` and related memory/intelligence data live here. The legacy replica never carried live memory data. |
| `auth_gateway.*` (writers) | Dedicated auth-gateway Supabase project | Authoritative since the 2026-07-18 operator directive. |
| Outbox / events backup feed | Populated **from** the primary project **into** the emergency replica | Emergency-recovery path only. |
| Emergency replica | Legacy replica database | Retained as a frozen/downstream emergency recovery path. It is **not** a source of truth for live data. |

## What changed on 2026-07-18

- The auth-gateway project became the **authoritative** store for
  `auth_gateway.*` and related security data.
- The legacy replica was demoted to an **emergency / frozen replica** used for
  recovery feeds only.
- Memory data was already authoritative in the primary platform project; the
  replica never carried live memory data.

Operational implication: treat the primary project and the auth-gateway project
as authoritative for their respective domains, and treat the legacy replica as
downstream-only. Do not point live writers at the replica.

## Where to go next

- [Platform Architecture & Domains](./architecture.md) — the service-level map
- [Auth Gateway (Enterprise Identity)](./auth-gateway.md) — identity, sessions,
  and API-key contexts
- [Memory Suite Overview](../memory/overview.md) — REST, SDK, and CLI surface
- [Operating the LanOnasis Platform](../ops/operating-platform.md) — monitoring
  and production considerations

> **Operators:** for the full topology-of-record, network attribution notes,
> migration record, and routing inventory, read the internal operator
> documentation. Do not republish its contents (project references,
> credentials, or internal topology detail) in public-facing material.
