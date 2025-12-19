/*
 * Combined Root Detection Bypass for Flutter (safe_device + RootBeer)
 */

Java.perform(function() {
    console.log("\n[+] Starting combined bypass: safe_device + RootBeer...");

    // 1. Bypass safe_device.Rooted.RootedCheck main class
    try {
        var RootedCheck = Java.use("com.xamdesign.safe_device.Rooted.RootedCheck");
        
        RootedCheck.isJailBroken.implementation = function(context) {
            console.log("[!] safe_device: isJailBroken() -> Bypassed (false)");
            return false;
        };

        RootedCheck.hasObviousRootSigns.implementation = function() {
            console.log("[!] safe_device: hasObviousRootSigns() -> Bypassed");
            return false;
        };

        RootedCheck.checkSuBinary.implementation = function() {
            console.log("[!] safe_device: checkSuBinary() -> Bypassed");
            return false;
        };
        
        RootedCheck.isLikelyEmulator.implementation = function() {
            console.log("[!] safe_device: isLikelyEmulator() -> Bypassed");
            return false;
        };
    } catch (e) { 
        console.log("[-] RootedCheck class not found."); 
    }

    // 2. Bypass API version specific classes (GreaterThan23 & LessThan23)
    try {
        var GreaterThan23 = Java.use("com.xamdesign.safe_device.Rooted.GreaterThan23");
        GreaterThan23.checkRooted.implementation = function() {
            console.log("[!] safe_device: GreaterThan23.checkRooted() -> Bypassed");
            return false;
        };
    } catch (e) {}

    try {
        var LessThan23 = Java.use("com.xamdesign.safe_device.Rooted.LessThan23");
        LessThan23.checkRooted.implementation = function() {
            console.log("[!] safe_device: LessThan23.checkRooted() -> Bypassed");
            return false;
        };
    } catch (e) {}

    // 3. Bypass RootBeer (dependency used by safe_device)
    try {
        var RootBeer = Java.use("com.scottyab.rootbeer.RootBeer");
        RootBeer.isRooted.implementation = function() { 
            console.log("[!] RootBeer: isRooted() -> Bypassed");
            return false; 
        };
        RootBeer.isRootedWithBusyBoxCheck.implementation = function() { 
            return false; 
        };
        RootBeer.checkForRootNative.implementation = function() { 
            return false; 
        };
    } catch (e) {
        console.log("[-] RootBeer class not found.");
    }

    // 4. Global File System Bypass (Hiding su, magisk, etc.)
    // essential bc RootedCheck uses 'new File(path).exists()'
    var File = Java.use("java.io.File");
    File.exists.implementation = function() {
        var name = this.getAbsolutePath();
        if (name.includes("su") || name.includes("magisk") || name.includes("Superuser") || name.includes("busybox")) {
            // console.log("[!] Hidden root file check: " + name);
            return false;
        }
        return this.exists();
    };

    // 5. System Command Bypass (which su, etc.)
    var Runtime = Java.use("java.lang.Runtime");
    Runtime.exec.overload('[Ljava.lang.String;').implementation = function(cmdArray) {
        var cmd = cmdArray.join(" ");
        if (cmd.includes("su") || cmd.includes("which") || cmd.includes("type su")) {
            console.log("[!] Blocked system command: " + cmd);
            return Runtime.exec.call(this, ["echo", "nothing"]);
        }
        return this.exec(cmdArray);
    };

    console.log("[+] Setup completed. System ready.");
});
