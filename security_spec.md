# Security Specification for Bloovi

## 1. Data Invariants
- A `User` profile must always match the `uid` of the authenticated user.
- Only the user `contact@bloovi.media` (verified) is the bootstrapped admin.
- `Company` accounts can only be created/modified by admins.
- `Project` records must link to a valid `companyId`.
- Companies can only view their own projects based on the `companyId` in their user profile.
- `SiteContent` is public for reading but strictly admin-only for writing.

## 2. The "Dirty Dozen" Payloads (Red Team Tests)
1. **Identity Spoofing**: Attempting to create a `/users/{uid}` profile with a different UID.
2. **Privilege Escalation**: A non-admin user trying to update their own `role` to 'admin'.
3. **Orphaned Project**: Creating a project with a random `companyId` that doesn't exist.
4. **Data Injection**: Overloading `siteContent.key` with a 1MB string.
5. **Cross-Company Leak**: Company A attempting to `get` a project belonging to Company B.
6. **Unauthorized CMS Write**: An unauthenticated user attempting to edit `siteContent`.
7. **Bypassing Verification**: Logging in with `contact@bloovi.media` but without email verification to gain admin access.
8. **Shadow Field Injection**: Adding an `isAdmin: true` field to a `Company` document.
9. **Status Shortcutting**: Directly setting a project's `progress` to 100 via client SDK (only admin should do this if intended, but here admin is allowed).
10. **Resource Exhaustion**: Creating 10,000 empty company documents in a loop (Admin only can create, so this is limited by admin trust).
11. **Immutable Key Mutation**: Changing the `key` of a `siteContent` document after creation.
12. **Anonymous Access**: Attempting to read `/projects` without being logged in.

## 3. Test Runner Invariant
The `firestore.rules` will be verified using the ESLint security plugin to ensure no obvious update gaps or relational syncing issues exist.
All actions will be guarded by `affectedKeys().hasOnly()` or strict schema validation.
