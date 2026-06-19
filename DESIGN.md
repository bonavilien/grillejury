# Design Context

## Visual Direction

Restrained product UI with tinted neutral surfaces, one accent color, and clear state changes. The interface should feel reliable during an interview rather than promotional.

## Components

- Top header with primary context and utility actions
- Segmented programme tabs
- Programme guidance notice
- Session toolbar with timer and API controls
- Structured criteria rows
- Result panel with generation status

## Accessibility

- All fields have labels
- Icon-only controls need accessible names
- Keyboard focus must be visible
- Mobile layout stacks controls into a single column

## Color

Use OKLCH tokens in CSS. Avoid pure black and pure white. Keep accent color for active selections, primary actions, and focus. Typography uses a native product stack led by Aptos and Avenir Next to stay readable without the generic Roboto fallback flagged by Impeccable.
