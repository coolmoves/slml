<!--
title: Async Cache Engine
description: High-performance async caching layer for Rust with TTL, LRU eviction, and simple mutex synchronization.
languages: Rust
tags: cache, async, tokio, performance
createdAt: 5 Hours ago
-->

# Async Cache Engine

A production-grade concurrent caching solution for async Rust applications.

## Key Features
- **Thread-safe synchronization**: Leveraging `tokio::sync::RwLock` for concurrent read locks.
- **Configurable TTL**: Cache entries expire automatically after the specified Duration.
- **Generic Store**: Fits any cloneable data structure.

## Rust Code Signature
```rust
use std::collections::HashMap;
use tokio::sync::RwLock;
use std::sync::Arc;

pub struct Cache<T: Clone> {
    store: Arc<RwLock<HashMap<String, CacheEntry<T>>>>,
    ttl: std::time::Duration,
}
```
