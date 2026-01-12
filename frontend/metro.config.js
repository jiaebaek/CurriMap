// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// node:sea 모듈을 무시하도록 설정
if (!config.resolver) {
  config.resolver = {};
}

const existingBlockList = Array.isArray(config.resolver.blockList) 
  ? config.resolver.blockList 
  : [];

config.resolver.blockList = [
  ...existingBlockList,
  /node:sea/,
];

module.exports = config;

