#!/usr/bin/env node
// Basic demo-store validation.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const demo = yaml.load(readFileSync(resolve(root, "11.demo-store.yaml"), "utf-8"));
let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    failed = true;
  }
}

assert(Array.isArray(demo.machines), "demo_store.machines must be an array");
assert(demo.machines?.length >= 3, "demo_store must include at least the 3 LAB machines");
for (const id of ["lab-8gb", "lab-512", "lab-256"]) {
  assert(demo.machines?.some((m) => m.id === id), `missing machine ${id}`);
}
assert(Array.isArray(demo.sensors), "demo_store.sensors must be an array");
assert(Array.isArray(demo.registry_entities), "demo_store.registry_entities must be an array");
assert(!("registry_types" in demo), "demo_store.registry_types must not duplicate the compiled Registry platform contract");
assert(Array.isArray(demo.ghosts), "demo_store.ghosts must be an array");
assert(Array.isArray(demo.receipts), "demo_store.receipts must be an array");

if (failed) process.exit(1);
console.log(`demo store OK · ${demo.machines.length} machines · ${demo.sensors.length} sensors · ${demo.registry_entities.length} entities`);
