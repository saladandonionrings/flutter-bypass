# Flutter bypass scripts
>A collection of Frida scripts designed to bypass common security restrictions in Flutter applications during security audits.

## `rootdetect-bypass.js`
>This script specifically targets the `safe_device` Flutter plugin and the `RootBeer` library.

### Usage
- Launch `frida-server` on your device
- On host : 
```bash
frida -U -f com.app.test -l rootdetection-bypass.js
```
