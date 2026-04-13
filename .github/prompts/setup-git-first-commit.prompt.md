---
name: setup-git-first-commit
description: Initialize git repository with meaningful first commit for kannada-sangha-iitd
---

# Set Up Git & First Commit

Initialize version control for the Kannada Sangha IITD project with proper git structure.

## What This Does

This workflow will:
1. Initialize a meaningful `.gitignore` (if not present)
2. Create a structured first commit with project setup
3. Add a git tag marking the project baseline
4. Prepare for team collaboration on version control

## Questions

Before proceeding, please confirm:

**1. Git Setup Status**
- Is this a fresh repository (no commits yet)?
- Should I treat `dist/` as a build artifact (ignore it)?
- Any local secrets or `.env` files to exclude?

**2. Commit Message Preference**
- Conventional Commits style (e.g., `feat: initial project setup`)?
- Or freestyle (e.g., `Initial commit: kannada-sangha-iitd v0.1.0`)?

**3. Remote Repository**
- Is there a GitHub remote already configured (origin)?
- Should I create a first tag (e.g., `v0.1.0-baseline`)?

## After Setup

You'll be ready to:
- Push to GitHub with `git push origin main` (or `git push -u origin main` if remote doesn't exist)
- Track future features/bugfixes as branches from this baseline
- Use conventional commit messages for team clarity

---

## I'm Ready

Once you confirm the questions above, I'll:
1. ✅ Verify repo state: `git status`, `git log`
2. ✅ Create/update `.gitignore` (dist/, node_modules/, .env, etc.)
3. ✅ Stage all files: `git add .`
4. ✅ Commit with message: `{your preference}`
5. ✅ Create annotated tag (optional): `git tag -a v0.1.0-baseline`
6. ✅ Display final state and next steps

**Estimated time:** ~2 minutes
