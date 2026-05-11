#!/bin/bash
# Build cccontrol-bridge from Swift source
# Requires: Xcode Command Line Tools (xcode-select --install)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BRIDGE_DIR="$SCRIPT_DIR/bridge"
SRC="$BRIDGE_DIR/main.swift"
BIN="$BRIDGE_DIR/cccontrol-bridge"

if [ ! -f "$SRC" ]; then
    echo "Error: Source not found at $SRC" >&2
    exit 1
fi

if ! command -v swiftc &>/dev/null; then
    echo "Error: swiftc not found. Install Xcode Command Line Tools:" >&2
    echo "  xcode-select --install" >&2
    exit 1
fi

echo "Compiling cccontrol-bridge..."
swiftc -O -framework AppKit -framework ApplicationServices "$SRC" -o "$BIN"

if [ $? -eq 0 ]; then
    echo "Built successfully: $BIN"
    chmod +x "$BIN"
else
    echo "Build failed" >&2
    exit 1
fi
