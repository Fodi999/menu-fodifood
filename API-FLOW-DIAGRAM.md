# API Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Application                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   api.get('/orders') │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  apiRequest<T>()     │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────────────────┐
              │ Check sessionStorage cache       │
              │ "rustHealthy"                    │
              └──────────┬───────────────────────┘
                         │
           ┌─────────────┴──────────────┐
           │                            │
    [Cached: true]              [Cached: false/null]
           │                            │
           ▼                            ▼
    ┌──────────────┐          ┌──────────────────┐
    │ Use cached   │          │ checkRustHealth()│
    │ status       │          │ /health endpoint │
    └──────┬───────┘          └────────┬─────────┘
           │                           │
           │                   ┌───────┴────────┐
           │                   │                │
           │            [Health OK]      [Health FAIL]
           │                   │                │
           │                   ▼                ▼
           │         ┌──────────────┐  ┌────────────────┐
           │         │ Save "true"  │  │ Save "false"   │
           │         │ to session   │  │ to session     │
           │         └──────┬───────┘  └────────┬───────┘
           │                │                   │
           └────────────────┴───────────────────┘
                            │
              ┌─────────────┴──────────────┐
              │                            │
       [Rust Available]           [Rust Unavailable]
              │                            │
              ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │ Try Rust API     │         │ callMockAPI()    │
    │ fetch(url)       │         │ Instant response │
    └────────┬─────────┘         └────────┬─────────┘
             │                            │
    ┌────────┴─────────┐                  │
    │                  │                  │
[Success]         [Error/Timeout]         │
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐   ┌──────────────────┐   ┌──────────────┐
│ Return  │   │ Mark unavailable │   │ Match route  │
│ JSON    │   │ Update session   │   │ /businesses  │
└─────────┘   │ Fallback to Mock │   │ /products    │
              └────────┬─────────┘   │ /orders      │
                       │             │ /market      │
                       │             │ /analytics   │
                       │             │ /metrics     │
                       │             │ /users       │
                       │             └──────┬───────┘
                       │                    │
                       └────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Return Mock Data      │
                    │ or [] if unsupported  │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Frontend receives     │
                    │ data (always!)        │
                    └───────────────────────┘
```

## Key Features

### 🔄 Automatic Fallback
```
Rust API Failed → Mock API → Graceful [] if unsupported
```

### ⚡ Performance
```
First Request:  Health Check + sessionStorage Save
Next Requests:  sessionStorage Read (instant!)
```

### 🛡️ Error Resilience
```
Any Error → Update Cache → Mock Fallback → Return Data or []
NO EXCEPTIONS THROWN TO USER
```

### 📊 Endpoint Coverage
```
✅ /businesses     → mockApi.getBusinesses()
✅ /businesses/:id → mockApi.getBusiness(id)
✅ /products       → mockApi.getProducts()
✅ /products/:id   → mockApi.getProduct(id)
✅ /orders         → mockApi.getOrders()
✅ /market         → mockApi.getMarketData()
✅ /analytics      → mockApi.getAnalytics()
✅ /metrics        → mockApi.getMetrics()
✅ /users          → mockApi.getUsers()
```

---

## Example Flow: User visits /business/dashboard

```
1. Page loads → api.get('/businesses')
   │
2. apiRequest() checks sessionStorage
   │
3. [Cache Miss] → checkRustHealth()
   │
4. Health endpoint times out (2s)
   │
5. Mark Rust unavailable, save to session
   │
6. callMockAPI('/businesses')
   │
7. mockApi.getBusinesses() returns mock data
   │
8. Dashboard renders with mock data
   │
9. Console: "⚠️ Rust API unreachable — switching to MockAPI"
   │
10. User sees data immediately!

Next time user navigates:
1. Page loads → api.get('/analytics')
   │
2. [Cache Hit] → "rustHealthy: false"
   │
3. Skip health check, go directly to Mock
   │
4. Return data in <50ms
   │
5. Super fast! ⚡
```

---

## State Management

### sessionStorage Keys
```typescript
{
  "rustHealthy": "true" | "false"  // Cached health status
}
```

### Memory State
```typescript
let rustAvailable = true;   // Current availability flag
let checkedOnce = false;    // Prevents duplicate checks
```

---

## Error Scenarios

### Scenario 1: Rust Backend Down
```
Health Check → FAIL → Mock API → ✅ Data
```

### Scenario 2: Rust Backend Timeout
```
Request → Timeout (2s) → Mock API → ✅ Data
```

### Scenario 3: Unsupported Endpoint
```
Mock API → No Handler → Return [] → ✅ Empty List
```

### Scenario 4: Mock API Error
```
Mock API → Error → Return [] → ✅ Empty List
```

**Result: NO CRASHES EVER!** 🛡️
