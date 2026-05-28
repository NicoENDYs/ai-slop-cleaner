# Test: Multi-Language Patterns

## Python
**Input:**
```python
# This function is responsible for calculating the total
def calculate_total(items):
    # add all items
    return sum(items)
```
**Expected:** both comments removed, function body preserved.

## Go
**Input:**
```go
// This function is responsible for fetching the user
func FetchUser(id string) (*User, error) {
    // call the database
    return db.Find(id)
}
```
**Expected:** both comments removed.

## PHP
**Input:**
```php
// Helper function that formats the date string
function formatDate($date) {
    // format and return
    return date('Y-m-d', strtotime($date));
}
```
**Expected:** both comments removed.
