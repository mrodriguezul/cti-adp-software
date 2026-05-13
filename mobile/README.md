# LPA Admin Mobile App

A native Android application that provides mobile access to the LPA (Logistics and Product Administration) Admin web application. This app wraps the web-based admin interface in a mobile-friendly WebView component.

## Overview

The LPA Admin Mobile App is a lightweight Android application built with Kotlin and Jetpack Compose that provides seamless access to the administrative functions of the LPA system directly from mobile devices. The app loads the web-based admin portal and presents it within a native Android container with a professional splash screen and navigation flow.

## Features

- **Mobile Access to Admin Portal**: Load and interact with the LPA Admin web application on your Android device
- **Splash Screen**: 4-second loading screen with visual feedback before the main app loads
- **JavaScript Support**: Full JavaScript execution enabled for dynamic web content
- **Native Navigation**: Smooth navigation flow from splash screen to main application
- **Internet Connectivity**: Connects to the LPA Admin web server via configurable URL
- **Material Design**: Built with Material 3 design system for a modern, polished UI

## Technology Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Android Version Support**: 
  - Minimum SDK: 24 (Android 7.0)
  - Target SDK: 34 (Android 14)
  - Compile SDK: 34
- **Key Dependencies**:
  - AndroidX Core and Lifecycle libraries
  - Jetpack Compose and Material 3
  - Navigation Compose for screen routing
  - Testing frameworks: JUnit, Espresso, Compose UI Testing

## Prerequisites

- **Android Studio**: Latest version (or 2024.x or later)
- **Java Development Kit (JDK)**: Java 8 or later
- **Gradle**: Version 8.x (included with Android Studio)
- **Android SDK**: API level 34 and Android 7.0 (API 24) for testing

## Project Structure

```
mobile/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/webviewapp/
│   │   │   │   ├── MainActivity.kt           # Main entry point and app navigation
│   │   │   │   └── ui/
│   │   │   │       ├── MainScreen.kt         # WebView container for admin portal
│   │   │   │       └── SplashScreen.kt       # Loading screen
│   │   │   ├── res/                          # Android resources (layouts, strings, drawables)
│   │   │   └── AndroidManifest.xml           # App configuration and permissions
│   │   └── androidTest/                      # Android instrumentation tests
│   ├── build.gradle                          # App-level Gradle configuration
│   └── proguard-rules.pro                    # ProGuard rules for code obfuscation
├── build.gradle                              # Project-level Gradle configuration
├── settings.gradle                           # Gradle settings
├── gradle.properties                         # Gradle properties
└── gradle/                                   # Gradle wrapper and dependencies

```

## Setup and Build

### 1. Clone/Open Project
Open the mobile project in Android Studio or clone it to your development machine.

### 2. Configure Server URL
In [MainActivity.kt](mobile/app/src/main/java/com/example/webviewapp/MainActivity.kt), the app connects to the admin portal at:

```kotlin
MainScreen(url = "http://10.0.2.2/cti-adp-software/webapp/login.php")
```

**Note**: The URL `10.0.2.2` is a special alias used by Android emulators to refer to the host machine's localhost. For physical devices, replace it with your actual server IP address.

### 3. Build the Application
```bash
./gradlew build
```

Or via Android Studio: `Build` → `Make Project`

### 4. Build Release APK
```bash
./gradlew assembleRelease
```

The APK will be generated in `app/build/outputs/apk/release/`

## Running the App

### On Android Emulator
1. Open Android Studio and start an Android emulator (API 24 or higher)
2. Select `Run` → `Run 'app'` or press `Shift + F10`
3. The app will install and launch automatically

### On Physical Device
1. Enable USB Debugging on your Android device (Settings → Developer Options → USB Debugging)
2. Connect the device via USB to your development machine
3. Select the device when prompted in Android Studio
4. Select `Run` → `Run 'app'`

### Manual APK Installation
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Permissions

The app requires the following Android permissions:

- **INTERNET**: Allows the app to communicate with the LPA Admin web server

See [AndroidManifest.xml](mobile/app/src/main/AndroidManifest.xml) for additional configuration.

## Development Notes

### Modifying the Server URL
To connect to a different server:
- Update the URL in `MainActivity.kt` under the `AppNavigation()` composable
- For emulators: use `10.0.2.2` to refer to localhost
- For physical devices: use the actual IP address of your development/production server

### Enabling JavaScript Debugging
The app has JavaScript enabled by default for full compatibility with the web portal. To debug web content, consider enabling Chrome DevTools remote debugging in production builds.

### Testing
Run instrumented tests with:
```bash
./gradlew connectedAndroidTest
```

Run unit tests with:
```bash
./gradlew test
```

## Build Configuration

- **Target API**: Android 14 (API 34)
- **Minimum API**: Android 7.0 (API 24)
- **Language**: Kotlin with Java 8 compatibility
- **Compose Version**: Kotlin Compiler Extension Version 1.5.1

## Architecture

The app follows a simple but clean architecture:

1. **MainActivity**: Manages the overall app lifecycle and navigation
2. **AppNavigation**: Handles screen transitions (Splash → Main)
3. **SplashScreen**: Displays a loading screen for 4 seconds
4. **MainScreen**: Renders the WebView component that loads the admin portal

## Troubleshooting

### Connection Issues
- Verify the server URL is correct and accessible
- Check that your device/emulator has internet connectivity
- On emulators, ensure you're using `10.0.2.2` for localhost connections

### WebView Not Loading
- Ensure JavaScript is enabled (currently enabled by default)
- Clear app cache and data from device settings
- Try reinstalling the app

### Build Failures
- Run `./gradlew clean` followed by `./gradlew build`
- Update Android SDK and build tools to latest versions
- Verify JDK version is Java 8 or later

## Related Projects

This mobile app is part of the CTI Course - Advanced Programming project suite, which includes:
- **E-commerce**: Full-stack e-commerce system with backend services
- **Webapp**: PHP-based admin portal (loaded by this mobile app)
- **Desktop**: Desktop admin application
- **Mobile**: This Android app for mobile admin access

## License

Educational Use Only - This project is part of the CTI Course (Advanced Programming) and is intended for educational purposes. Permission granted for students to use, modify, and learn from this code.

## Support

For issues or questions about the mobile app, refer to the project documentation or contact the development team.
