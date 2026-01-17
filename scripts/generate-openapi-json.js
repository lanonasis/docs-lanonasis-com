#!/usr/bin/env node

/**
 * Generate OpenAPI JSON from YAML
 * 
 * This script converts the OpenAPI YAML specification to JSON format
 * for better browser compatibility in the API Playground.
 * 
 * Usage: node scripts/generate-openapi-json.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const rootDir = path.join(__dirname, '..');
const yamlPath = path.join(rootDir, 'openapi.yaml');
const jsonPath = path.join(rootDir, 'static', 'openapi.json');

try {
  console.log('📖 Reading OpenAPI YAML spec...');
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  
  console.log('🔄 Parsing YAML...');
  const spec = yaml.load(yamlContent);
  
  const jsonOutput = JSON.stringify(spec, null, 2);

  if (checkOnly) {
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Missing OpenAPI JSON at ${jsonPath}`);
    }

    const current = fs.readFileSync(jsonPath, 'utf8');
    if (current !== jsonOutput) {
      throw new Error(`OpenAPI JSON is out of sync at ${jsonPath}`);
    }

    console.log(`✅ OpenAPI JSON is in sync at ${jsonPath}`);
    return;
  }

  console.log('📝 Writing JSON spec...');
  fs.writeFileSync(jsonPath, jsonOutput);

  const stats = fs.statSync(jsonPath);
  console.log(`✅ Successfully generated ${jsonPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   Paths: ${Object.keys(spec.paths || {}).length}`);
  console.log(`   Version: ${spec.info?.version || 'unknown'}`);
} catch (error) {
  console.error('❌ Error generating OpenAPI JSON:', error.message);
  process.exit(1);
}

