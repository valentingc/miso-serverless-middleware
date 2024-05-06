export function jsonMapReplacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else if (value instanceof Set) {
    return Array.from(value);
  } else if (value && typeof value === 'object' && '_idleTimeout' in value) {
    return 'TimeoutObject';
  } else {
    return value;
  }
}
