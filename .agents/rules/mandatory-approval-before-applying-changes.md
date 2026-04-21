---
trigger: always_on
---

## Principle

The agent **MUST NOT execute, apply, or persist any changes** to code, database, files, or configuration without explicit user approval.

## Required Behavior

1. **Proposal Mode by Default**
   - All changes must be presented as:
     - a diff (git patch), or
     - clearly separated code blocks

   - Never apply changes automatically.

2. **Explicit Approval Required**
   - After proposing changes, the agent must ask:

     > "Do you approve applying these changes?"

   - Only proceed if the response contains clear approval such as:
     - "yes"
     - "apply"
     - "approved"
     - "go"

3. **Block on Ambiguity**
   - If the response is unclear or ambiguous:
     - DO NOT apply changes
     - Ask for confirmation again

4. **Pre-Execution Summary**
   - Before applying changes, show:
     - list of affected files
     - brief description of changes
     - potential risks

5. **Final Confirmation (for critical changes)**
   - Require an additional confirmation for:
     - database modifications
     - file deletions
     - production changes

6. **Audit Trail**
   - Log:
     - proposed changes
     - approval timestamp
     - approver (if applicable)

## Strict Rule

> If there is no explicit approval → DO NOTHING.

## Correct Flow Example

1. Proposal:
   - "Here are the suggested changes..."

2. Request:
   - "Do you want me to apply them?"

3. User:
   - "yes, apply"

4. Action:
   - Apply changes

## Incorrect Flow ❌

- Proposing changes and applying them automatically without confirmation.
