# Bad Gateway (502/503) Issues - Analysis & Fixes

## Issues Found

### 1. **Critical: Missing Proxy Timeout Headers** ⚠️
**Location**: `/api/v1` and `/api/v1/rooms` nginx proxy configuration

**Problem**: 
- The `/socket.io/` location had timeout settings, but API endpoints didn't
- When backend is slow or loading, Nginx returns 502 Bad Gateway
- Default timeouts are 60s, but long-running operations timeout

**Fix Applied**:
```nginx
proxy_connect_timeout 60s;    # Time to establish connection
proxy_send_timeout 60s;       # Time to send request
proxy_read_timeout 300s;      # Time to receive response (5 min for slow ops)
proxy_buffering off;          # Don't buffer (fixes streaming issues)
```

---

### 2. **Port Mismatch** ⚠️
**Location**: Upstream server configuration

**Problem**:
- Service runs on port **4050** (set in systemd service file)
- But `/api/v1` routes proxied to `${PORT}` which is **4000**
- This port doesn't exist, causing connection refused = 502 error

**Fix Applied**:
- Changed all `/api/v1*` proxy_pass from `localhost:${PORT}` to `localhost:${PORT2}` (4050)
- Updated upstream definition to use only 4050 with proper failover config

---

### 3. **Missing HTTP Keep-Alive** ⚠️
**Location**: API endpoint proxy configurations

**Problem**:
- Missing `proxy_http_version 1.1` (needed for keep-alive)
- Missing `proxy_set_header Connection ""` (closes connections unnecessarily)
- Causes connection overhead and potential 502 on high traffic

**Fix Applied**:
```nginx
proxy_http_version 1.1;
proxy_set_header Connection "";  # Enable keep-alive
```

---

### 4. **Inefficient Upstream Load Balancing**
**Location**: Upstream block

**Problem**:
- Original config: `server 127.0.0.1:4050` and `server 127.0.0.1:4000`
- Using default round-robin with non-existent port 4000
- No load balancing algorithm specified

**Fix Applied**:
```nginx
upstream backend {
    least_conn;  # Route to least busy server
    server 127.0.0.1:4050 max_fails=3 fail_timeout=30s weight=1;
    keepalive 32;  # Connection pooling
}
```

---

### 5. **Missing Error Page Handling**
**Location**: Server block

**Problem**:
- No graceful error pages when backend is down
- Users see raw Nginx error page

**Fix Applied**:
```nginx
error_page 502 503 /502.html;  # Custom error page
```

---

### 6. **Missing Health Check Endpoint**
**Location**: Nginx configuration

**Problem**:
- Application has `/campain-app/api/v1/health` endpoint
- But Nginx doesn't have route for it
- Can't easily monitor if backend is alive

**Fix Applied**:
```nginx
location /campain-app/health {
    access_log off;
    proxy_pass http://127.0.0.1:4050/campain-app/api/v1/health;
    proxy_connect_timeout 5s;
    proxy_send_timeout 5s;
    proxy_read_timeout 5s;
}
```

---

## Summary of Changes

| Issue | Severity | Status |
|-------|----------|---------|
| Missing timeout headers | CRITICAL | ✅ Fixed |
| Port mismatch (4000 vs 4050) | CRITICAL | ✅ Fixed |
| Missing HTTP/1.1 keep-alive | HIGH | ✅ Fixed |
| Bad upstream config | MEDIUM | ✅ Fixed |
| No error pages | MEDIUM | ✅ Fixed |
| Missing health endpoint | LOW | ✅ Fixed |

---

## Testing After Deployment

1. **Check backend is running**:
   ```bash
   systemctl status lead-page.service
   ps aux | grep node
   ```

2. **Test health endpoint**:
   ```bash
   curl https://YOUR_DOMAIN/campain-app/health
   ```

3. **Check Nginx logs for errors**:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

4. **Load test to catch remaining issues**:
   ```bash
   ab -n 1000 -c 50 https://YOUR_DOMAIN/api/v1/health
   ```

5. **Monitor for 502 errors**:
   ```bash
   tail -f /var/log/nginx/access.log | grep 502
   ```

---

## Prevention Tips

- Always set `proxy_read_timeout` >= max expected response time + buffer
- Use `proxy_http_version 1.1` with `Connection ""` for keep-alive
- Monitor `/var/log/nginx/error.log` for upstream timeout messages
- Implement application-level retry logic for transient failures
- Set resource limits in systemd service (MemoryMax, CPUQuota)
- Use health checks to detect backend failures early
