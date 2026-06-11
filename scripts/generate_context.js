#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '..');
const PHARMANET_CONSTANTS = path.resolve(DOCS_ROOT, '..', 'pharmanet', 'lib', 'core', 'constants');
const DOCS_OUTPUT = path.join(PHARMANET_CONSTANTS, 'docs_context.dart');
const CONTACTS_OUTPUT = path.join(PHARMANET_CONSTANTS, 'support_contacts.dart');

const EXCLUDE = [];

// ---------------------------------------------------------------------------
// MDX parsing
// ---------------------------------------------------------------------------
function parseMdx(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = {};
  let body = content;

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (fmMatch) {
    const raw = fmMatch[1];
    for (const line of raw.split('\n')) {
      const sep = line.indexOf(': ');
      if (sep > 0) {
        const key = line.slice(0, sep).trim();
        const val = line.slice(sep + 2).trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = val;
      }
    }
    body = content.slice(fmMatch[0].length);
  }

  return {
    title: frontmatter.title || path.basename(filePath, '.mdx'),
    description: frontmatter.description || '',
    body,
  };
}

function collectFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!EXCLUDE.includes(e.name)) {
        collectFiles(path.join(dir, e.name), files);
      }
    } else if (e.name.endsWith('.mdx')) {
      files.push(path.join(dir, e.name));
    }
  }
  return files;
}

function sectionLabel(filePath) {
  const rel = path.relative(DOCS_ROOT, filePath).replace(/\.mdx$/, '');
  const parts = rel.split(path.sep);
  const isAmharic = parts[0] === 'am';
  const sub = isAmharic ? parts[1] : parts[0];
  const rootFiles = ['index', 'quickstart'];

  const prefix = isAmharic ? 'Amharic - ' : '';

  // Root-level English files (index.mdx, quickstart.mdx)
  if (!isAmharic && rootFiles.includes(sub)) return 'Getting Started';
  // Root-level Amharic files (am/index.mdx, am/quickstart.mdx)
  if (isAmharic && parts.length === 2 && rootFiles.includes(sub)) return `${prefix}Getting Started`;

  switch (sub) {
    case 'customer': return `${prefix}Customer`;
    case 'seller': return `${prefix}Seller`;
    case 'help': return `${prefix}Help`;
    default: return `${prefix}${sub}`;
  }
}

// ---------------------------------------------------------------------------
// Compressed body extraction
// ---------------------------------------------------------------------------
function stripMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/\|/g, '')
    .trim();
}

function isIndexPage(filePath) {
  const name = path.basename(filePath, '.mdx');
  return name === 'index';
}

function extractKeyInfo(body) {
  // Extract up to 2 key bullet points only
  const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  for (const line of lines) {
    if (items.length >= 2) break;
    const itemMatch = line.match(/^[-*]\s+\*\*(.*?)\*\*\s*[-—]\s*(.*)/);
    if (itemMatch) {
      const t = stripMarkdown(`${itemMatch[1]}: ${itemMatch[2]}`).trim();
      if (t.length > 5 && t.length < 100) items.push(t);
    }
  }
  return items.length ? `Features: ${items.join('; ')}` : '';
}

// ---------------------------------------------------------------------------
// Contact info extraction
// ---------------------------------------------------------------------------
function extractContacts() {
  const contactFile = path.join(DOCS_ROOT, 'help', 'contact.mdx');
  if (!fs.existsSync(contactFile)) return [];

  const { body } = parseMdx(contactFile);
  const contacts = [];

  const phoneMatch = body.match(/-\s+\*\*Phone:\*\*\s*(.*)/);
  if (phoneMatch) contacts.push({ key: 'phone', label: 'Phone', value: phoneMatch[1].trim() });

  const hoursMatch = body.match(/-\s+\*\*Hours:\*\*\s*(.*)/);
  if (hoursMatch) contacts.push({ key: 'supportHours', label: 'Support Hours', value: hoursMatch[1].trim() });

  const weekendMatch = body.match(/-\s+\*\*Weekend:\*\*\s*(.*)/);
  if (weekendMatch) contacts.push({ key: 'weekendHours', label: 'Weekend Hours', value: weekendMatch[1].trim() });

  const emailMatch = body.match(/-\s+\*\*Email:\*\*\s*(.*)/);
  if (emailMatch) contacts.push({ key: 'email', label: 'Email', value: emailMatch[1].trim() });

  const sellerSection = body.split(/## For Pharmacy Owners/i)[1] || '';
  const sellerEmailMatch = sellerSection.match(/Email:\s*(.*)/);
  if (sellerEmailMatch) contacts.push({ key: 'sellerEmail', label: 'Seller Support Email', value: sellerEmailMatch[1].trim() });

  const officeMatch = body.match(/\*\*PharmaNet Headquarters\*\*\s*\n+\s*(.*?)(?:\n\n|$)/);
  if (officeMatch) {
    const addr = officeMatch[1].trim();
    if (addr) contacts.push({ key: 'officeAddress', label: 'Office Address', value: addr });
  }

  const facebookMatch = body.match(/-\s+\*\*Facebook:\*\*\s*(.*)/);
  if (facebookMatch) contacts.push({ key: 'facebook', label: 'Facebook', value: facebookMatch[1].trim() });

  const telegramMatch = body.match(/-\s+\*\*Telegram:\*\*\s*(.*)/);
  if (telegramMatch) contacts.push({ key: 'telegram', label: 'Telegram', value: telegramMatch[1].trim() });

  const twitterMatch = body.match(/-\s+\*\*Twitter:\*\*\s*(.*)/);
  if (twitterMatch) contacts.push({ key: 'twitter', label: 'Twitter', value: twitterMatch[1].trim() });

  return contacts;
}

// ---------------------------------------------------------------------------
// File generation
// ---------------------------------------------------------------------------
function generateDocsFile(mdxFiles) {
  const entries = [];

  for (const file of mdxFiles) {
    const { title, description, body } = parseMdx(file);
    const label = sectionLabel(file);
    const features = isIndexPage(file) ? '' : extractKeyInfo(body);
    entries.push({ label, title, description, features });
  }

  const order = [
    'Getting Started', 'Customer', 'Seller', 'Help',
    'Amharic - Getting Started', 'Amharic - Customer', 'Amharic - Seller', 'Amharic - Help',
  ];
  entries.sort((a, b) => {
    const ia = order.indexOf(a.label);
    const ib = order.indexOf(b.label);
    if (ia !== ib) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.title.localeCompare(b.title);
  });

  const lines = [
    '// Generated by scripts/generate_context.js -- do not edit manually.',
    '// Run `node scripts/generate_context.js` from pharmanet-guide-docs/ to regenerate.',
    '',
    'class DocsContext {',
    '  static const String content = \'\'\'',
  ];

  for (const e of entries) {
    let line = `[${e.label}] ${e.title}`;
    if (e.description) line += `: ${e.description}`;
    if (e.features) line += ` | ${e.features}`;
    lines.push(line);
  }

  lines.push('\'\'\';');
  lines.push('}');

  const out = lines.join('\n');
  fs.mkdirSync(path.dirname(DOCS_OUTPUT), { recursive: true });
  fs.writeFileSync(DOCS_OUTPUT, out, 'utf-8');
  console.log(`Generated ${DOCS_OUTPUT} (${(out.length / 1024).toFixed(1)} KB, ${entries.length} pages)`);
}

function generateContactsFile(contacts) {
  const hasRealInfo = contacts.some(c =>
    !c.value.includes('[Insert') && !c.value.includes('[insert') && c.value !== ''
  );

  const lines = [
    '// Generated by scripts/generate_context.js -- do not edit manually.',
    '// Run `node scripts/generate_context.js` from pharmanet-guide-docs/ to regenerate.',
    '',
    'class SupportContacts {',
  ];

  for (const c of contacts) {
    const escaped = c.value.replace(/'/g, "\\'");
    lines.push(`  static const String ${c.key} = '${escaped}';`);
  }

  lines.push('');
  lines.push('  static const String contactInfo = \'\'\'');

  if (hasRealInfo) {
    for (const c of contacts) {
      if (c.value.includes('[Insert') || c.value.includes('[insert') || c.value === '') continue;
      lines.push(`${c.label}: ${c.value}`);
    }
  } else {
    lines.push('Contact information is being updated. Please check the Help Center in the app for the latest contact details.');
  }

  lines.push('\'\'\';');
  lines.push('}');

  const out = lines.join('\n');
  fs.mkdirSync(path.dirname(CONTACTS_OUTPUT), { recursive: true });
  fs.writeFileSync(CONTACTS_OUTPUT, out, 'utf-8');
  console.log(`Generated ${CONTACTS_OUTPUT} (${contacts.length} fields)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function run() {
  const mdxFiles = collectFiles(DOCS_ROOT);
  generateDocsFile(mdxFiles);

  const contacts = extractContacts();
  generateContactsFile(contacts);
}

run();
