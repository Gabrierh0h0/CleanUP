#!/bin/bash
# scripts/run-local.sh — Levanta el monolito EIAR completo (backend + frontend)

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║        EIAR — Monolito en Capas          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

if [ ! -f ".env" ]; then
  echo "❌ Falta el archivo .env en la raíz"
  exit 1
fi

if [ ! -f "firebase-service-account.json" ]; then
  echo "❌ Falta firebase-service-account.json en la raíz"
  exit 1
fi

echo "📦 Instalando dependencias del backend..."
npm install

echo ""
echo "📦 Instalando dependencias del frontend (Expo)..."
cd src/presentation/frontend && npm install && cd ../../..

echo ""
echo "🚀 Iniciando monolito completo..."
echo "   → Backend API:  http://localhost:3000"
echo "   → Frontend Expo: escaneá el QR con Expo Go"
echo ""
npm run start:all
