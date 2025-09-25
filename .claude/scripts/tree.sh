#!/bin/bash

# Custom folders to ignore (in addition to .gitignore)
CUSTOM_IGNORE="@trunk|skill-tree|@skill-tree|public|migrations|tracingDir|eslint.tsconfig.mjs|tooling|sentry*|.github"

# Parse tsconfig.json exclude patterns
TSCONFIG_IGNORE=""
if [ -f "tsconfig.json" ]; then
    # Extract exclude patterns from tsconfig.json
    # Parse the JSON properly and handle wildcards
    TSCONFIG_PATTERNS=$(node -e "
        const fs = require('fs');
        const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
        if (tsconfig.exclude) {
            const patterns = tsconfig.exclude.map(p => {
                // Remove leading **/ and trailing /*
                return p.replace(/^\*\*\//, '').replace(/\/\*$/, '').replace(/^\*\*/, '');
            }).filter(p => p && !p.includes('*'));
            console.info(patterns.join('|'));
        }
    " 2>/dev/null || echo "")
    
    if [ -n "$TSCONFIG_PATTERNS" ]; then
        TSCONFIG_IGNORE="|$TSCONFIG_PATTERNS"
    fi
fi

# Combine all ignore patterns
FULL_IGNORE=".git|*.bak|$CUSTOM_IGNORE$TSCONFIG_IGNORE"

# Output file
OUTPUT=".claude/docs/project-structure.md"

# Create directory if it doesn't exist
mkdir -p .claude/docs

# Header
cat > "$OUTPUT" << 'EOF'
# Project Structure

EOF

echo "_Last Updated: $(date +%Y-%m-%d)_" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo '```' >> "$OUTPUT"

# Backup original .gitignore
cp .gitignore .gitignore.bak

# Remove !.* line temporarily (both commented and uncommented versions)
grep -v '^!\.\*' .gitignore | grep -v '^# !\.\*' > .gitignore.tmp && mv .gitignore.tmp .gitignore

# Use tree with gitignore (now without !.* line)
tree --gitignore \
  -a \
  -I "$FULL_IGNORE" \
  --dirsfirst \
  >> "$OUTPUT"

# Restore original .gitignore
mv .gitignore.bak .gitignore

# Close code block
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "Project structure written to $OUTPUT"

# Output the contents to stdout as well
cat "$OUTPUT"