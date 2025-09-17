# Analytics API

Retrieve comprehensive analytics and insights about your memory usage, performance metrics, and system health.

## Endpoint

```
GET /api/v1/analytics
```

## Description

The Analytics API provides detailed insights into your memory operations, usage patterns, performance metrics, and system health. Use this data to optimize your applications and understand usage trends.

## Authentication

```http
Authorization: Bearer <your-api-key>
```

## Request

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for API authentication |
| `Accept` | string | No | Response format (`application/json` or `application/csv`) |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeframe` | string | No | Time period for analytics (`1h`, `24h`, `7d`, `30d`, `90d`) |
| `start_date` | string | No | Start date in ISO 8601 format |
| `end_date` | string | No | End date in ISO 8601 format |
| `metrics` | string[] | No | Specific metrics to include |
| `group_by` | string | No | Group results by (`hour`, `day`, `week`, `month`) |
| `format` | string | No | Response format (`json`, `csv`) |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/api/v1/analytics?timeframe=7d&metrics=memory_operations,search_queries,response_times" \
  -H "Authorization: Bearer your-api-key" \
  -H "Accept: application/json"
```

```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

const analytics = await client.getAnalytics({
  timeframe: '7d',
  metrics: ['memory_operations', 'search_queries', 'response_times'],
  groupBy: 'day'
});

console.log(analytics.summary);
```

```python
from lanonasis import MemoryClient
from datetime import datetime, timedelta

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

end_date = datetime.now()
start_date = end_date - timedelta(days=7)

analytics = client.get_analytics(
    start_date=start_date.isoformat(),
    end_date=end_date.isoformat(),
    metrics=["memory_operations", "search_queries", "response_times"],
    group_by="day"
)

print(analytics.summary)
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "summary": {
      "total_memories": 15420,
      "total_searches": 8934,
      "total_operations": 24354,
      "active_users": 156,
      "avg_response_time": 145.2,
      "success_rate": 99.8,
      "cost_this_period": 45.67
    },
    "time_series": [
      {
        "timestamp": "2024-01-15T00:00:00Z",
        "memory_operations": 1205,
        "search_queries": 743,
        "response_times": {
          "avg": 142.1,
          "p50": 138.5,
          "p95": 189.2,
          "p99": 245.8
        },
        "errors": 2,
        "cost": 3.45
      }
    ],
    "top_queries": [
      {
        "query": "user authentication",
        "count": 234,
        "avg_response_time": 156.7
      },
      {
        "query": "product recommendations",
        "count": 189,
        "avg_response_time": 142.3
      }
    ],
    "memory_usage": {
      "total_size_mb": 2048.5,
      "growth_rate": 12.3,
      "top_categories": [
        {
          "category": "user_data",
          "size_mb": 1024.2,
          "percentage": 50.0
        },
        {
          "category": "product_catalog",
          "size_mb": 512.1,
          "percentage": 25.0
        }
      ]
    },
    "performance": {
      "uptime_percentage": 99.95,
      "avg_throughput": 145.2,
      "peak_throughput": 892.4,
      "error_rate": 0.2
    },
    "cost_breakdown": {
      "storage": 12.45,
      "compute": 18.23,
      "api_calls": 14.99,
      "total": 45.67
    }
  },
  "metadata": {
    "timeframe": "7d",
    "generated_at": "2024-01-15T10:30:00Z",
    "next_update": "2024-01-15T10:35:00Z"
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TIMEFRAME",
    "message": "Invalid timeframe specified",
    "details": {
      "field": "timeframe",
      "valid_values": ["1h", "24h", "7d", "30d", "90d"]
    }
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key",
    "details": {
      "reason": "invalid_api_key"
    }
  }
}
```

## Available Metrics

### Core Metrics
- `memory_operations` - Total memory CRUD operations
- `search_queries` - Number of search requests
- `response_times` - API response time statistics
- `error_rate` - Percentage of failed requests
- `throughput` - Requests per second

### Usage Metrics
- `total_memories` - Total number of stored memories
- `active_users` - Number of unique active users
- `storage_usage` - Memory storage consumption
- `api_calls` - Total API requests made

### Cost Metrics
- `cost_this_period` - Total cost for the period
- `cost_breakdown` - Detailed cost by service
- `projected_cost` - Estimated cost for next period

## Timeframes

| Timeframe | Description | Granularity |
|-----------|-------------|-------------|
| `1h` | Last hour | 1 minute |
| `24h` | Last 24 hours | 1 hour |
| `7d` | Last 7 days | 1 day |
| `30d` | Last 30 days | 1 day |
| `90d` | Last 90 days | 1 week |

## Real-time Monitoring

For real-time analytics, use the WebSocket endpoint:

```javascript
const ws = new WebSocket('wss://api.lanonasis.com/api/v1/analytics/stream');

ws.onmessage = (event) => {
  const analytics = JSON.parse(event.data);
  console.log('Real-time metrics:', analytics);
};
```

## Best Practices

1. **Regular Monitoring**: Set up automated monitoring for key metrics
2. **Alerting**: Configure alerts for performance thresholds
3. **Cost Optimization**: Monitor cost trends and optimize usage
4. **Data Retention**: Understand data retention policies for analytics

## Use Cases

- **Performance Monitoring**: Track API response times and throughput
- **Cost Management**: Monitor usage and optimize spending
- **Capacity Planning**: Understand growth trends and plan scaling
- **Debugging**: Identify performance bottlenecks and errors
- **Business Intelligence**: Generate reports for stakeholders