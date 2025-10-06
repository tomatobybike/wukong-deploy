---
sidebar_position: 2
---

# Error Handling

**wukong-deploy** provides a flexible error handling mechanism to help you manage issues that may occur during the deployment process.

## Error Handling Configuration

Each command can define its own error handling strategy:

```javascript
{
  cmd: "npm run build",
  description: "Build project",
  exitOnStdErr: false,    // Whether to exit when an error occurs
  errorMatch: [           // Error matching patterns
    /Error:/i,
    /Failed to compile/i
  ]
}
```

## Configuration Options

### exitOnStdErr

- `true`: Any content written to `stderr` will be treated as an error
- `false`: Allows content to be written to `stderr`, used together with `errorMatch`

### errorMatch

Supports either a single string/regex or an array of regex patterns:

```javascript
errorMatch: /Error:/; // Single regular expression
errorMatch: [
  // Array of regular expressions
  /Error:/i,
  /Failed/i,
  /Exception/i,
];
```

## Error Handling Examples

### 1. NPM Build Error Handling

```javascript
{
  cmd: "npm run build",
  description: "Build project",
  exitOnStdErr: false,
  errorMatch: [
    /Failed to compile/,
    /Error in/,
    /Module not found/
  ]
}
```

### 2. Git Operation Error Handling

```javascript
{
  cmd: "git pull",
  description: "Update source code",
  exitOnStdErr: false,
  errorMatch: [
    /Authentication failed/,
    /Merge conflict/,
    /Please commit your changes/
  ]
}
```

### 3. Database Operation Error Handling

```javascript
{
  cmd: "npm run migrate",
  description: "Database migration",
  exitOnStdErr: false,
  errorMatch: [
    /Connection refused/,
    /Duplicate entry/,
    /Access denied/
  ]
}
```

## Best Practices

1. Define specific error matching patterns for each command
2. Set `exitOnStdErr: false` for non-critical commands
3. Use regular expressions to match common error messages
4. Add clear and descriptive error messages for better debugging
