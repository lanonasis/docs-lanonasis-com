---
title: Python Best Practices
sidebar_label: Best Practices
---

# Python Best Practices

Use the Python SDK with short-lived credentials, structured retries, and explicit error handling in production flows.

## Recommendations

- Reuse a single client per process where possible.
- Prefer environment variables or secure secret storage for credentials.
- Treat search thresholds as tunable inputs and validate them against your corpus quality.

## Related Docs

- [Python Quickstart](/sdks/python/quickstart)
- [Python API Reference](/sdks/python/api-reference)
