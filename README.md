# React Native App (Expo + NativeWind) with Google Stitch UI MCP

A modern cross-platform mobile application built with **Expo SDK 57**, **Expo Router**, **NativeWind v4** (Tailwind CSS), and configured with the **Google Stitch UI MCP Server**.

---

## Tech Stack

- **Framework**: [Expo SDK 57](https://docs.expo.dev/) (Managed Workflow)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based tabs navigation)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS v3 for React Native)
- **Language**: TypeScript (Strict Mode)
- **AI Design Tooling**: [Google Stitch MCP](https://github.com/davideast/stitch-mcp) (`@_davideast/stitch-mcp`)

---

## Getting Started

### 1. Run the App

Start the Expo development server:

```bash
npm start
```

From the terminal menu, press:
- `i` to run in the **iOS Simulator** (macOS with Xcode)
- `a` to run in an **Android Emulator** or connected device
- `w` to run in the **Web Browser**
- Scan the displayed QR code with the **Expo Go** app on your physical iPhone or Android device!

### 2. Connect Google Stitch UI (MCP)

The project includes preconfigured MCP settings for Antigravity, Cursor, and other MCP clients. Stitch UI allows AI agents to inspect your wireframes, extract design tokens, and build React Native screens directly from your Stitch designs.

#### Authenticating with Stitch
Because you don't need to manually configure Google Cloud credentials, simply run the interactive setup wizard in your terminal:

```bash
npx @_davideast/stitch-mcp init
```

1. It will automatically launch a browser window.
2. Sign in with your Google Account.
3. Grant access to Stitch / Google Cloud services.
4. Select or create your Stitch project when prompted.

#### Verifying MCP Setup
Check your connection health at any time:

```bash
npx @_davideast/stitch-mcp doctor
```

---

## Using Stitch MCP with Antigravity

Once authenticated, you can ask the agent in this workspace to interact with Stitch directly:

- *"List the screens available in my Stitch project."*
- *"Fetch the profile screen from Stitch and build a NativeWind React Native component for it in `app/(tabs)/profile.tsx`."*
- *"Update the color scheme in `tailwind.config.js` to match my Stitch design system tokens."*

---

## Project Structure

```text
├── .agents/                      # Antigravity configurations
│   ├── plugins/stitch-mcp/       # Stitch MCP plugin manifest & config
│   ├── skills/stitch-ui/         # Agent skill for translating Stitch HTML/CSS to RN
│   └── mcp_config.json           # Workspace MCP server configuration
├── .cursor/
│   └── mcp.json                  # Cursor IDE MCP server configuration
├── app/                          # Expo Router routes
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── _layout.tsx           # Tab bar layout and icons
│   │   ├── index.tsx             # Home screen (styled with NativeWind)
│   │   └── two.tsx               # Secondary tab screen
│   ├── _layout.tsx               # Root layout (loads fonts, theme, global.css)
│   └── modal.tsx                 # Modal screen
├── assets/                       # Fonts and images
├── components/                   # Reusable components
├── global.css                    # Tailwind CSS directives
├── tailwind.config.js            # Tailwind & NativeWind configuration
├── metro.config.js               # Metro bundler with withNativeWind
├── babel.config.js               # Babel preset and NativeWind JSX plugin
├── nativewind-env.d.ts           # NativeWind TypeScript definitions
├── package.json
└── tsconfig.json
```
