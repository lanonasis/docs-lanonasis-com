---
sidebar_position: 3
---

# Error Codes

Complete reference for LanOnasis API error codes.

## Common Errors

| Code | Description | Resolution |
|------|-------------|------------|
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify API key |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify resource exists |
| 429 | Rate Limited | Reduce request frequency |
| 500 | Server Error | Contact support |

## Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested memory does not exist",
    "details": {
      "memoryId": "mem_123"
    }
  }
}
```
