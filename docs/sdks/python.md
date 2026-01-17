---
sidebar_position: 3
---

# Python SDK

Official Python SDK for LanOnasis Memory-as-a-Service.

## Installation

```bash
pip install lanonasis
```

**Status:** ⏳ Coming Soon (not yet published to PyPI)

## Quick Start

```python
from lanonasis import MemoryClient

client = MemoryClient(api_key="your-api-key")

# Create a memory
memory = client.create_memory(
    title="Important Note",
    content="This is my memory content",
    tags=["work", "project"]
)
```

## Documentation

Full documentation will be available at [PyPI](https://pypi.org/project/lanonasis/) once published.
