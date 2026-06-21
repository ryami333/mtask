# mtask

A small, keyboard-led todo app for the desktop — built for an audience of one (me).

`mtask` is unapologetically self-indulgent. It does exactly what I want a todo list to do and nothing more. It's minimal, fast, driven from the keyboard, and its look and feel borrows heavily from my favourite tools: the muted, focused chrome of **Sublime Text** and **Sublime Merge**. If that happens to be your taste too, welcome.

---

## What it is

A single, flat list of things to do. You add a thing, you check it off, you delete it. No folders, no boards, no due dates, no sync service, no account. Your todos live in a plain JSON file on your own machine.

What it _does_ have is a couple of small touches that make it pleasant to live in:

- **Color-coded groupings.** You can prefix a todo to tag it — say, a project code — and have every todo with that prefix render in a colour of your choosing. It's a lightweight way to create visual groupings (by project, by context, by whatever) without imposing any real structure. Prefixes and colours are completely customizable in settings.
- **Inline links.** Paste a URL into a todo and it's recognised automatically: the `https://` is hidden for readability, and you can open it in your browser without leaving the keyboard.
- **Everything from the keyboard.** Navigation, completing, editing, deleting, opening links — you never need the mouse if you don't want to.

---

## Keyboard shortcuts

> On macOS, **`⌘`** is the modifier. On Windows/Linux, use **`Ctrl`** in its place.

| Shortcut                       | Action                                          |
| ------------------------------ | ----------------------------------------------- |
| `⌘ + N`                        | New todo                                        |
| `↑` / `←`                      | Move focus to the previous todo (wraps around)  |
| `↓` / `→`                      | Move focus to the next todo (wraps around)      |
| `Home`                         | Jump to the first todo                          |
| `End`                          | Jump to the last todo                           |
| `⌘ + Enter` / `⌘ + Space`      | Toggle the focused todo complete / incomplete   |
| `⌘ + E`                        | Edit the focused todo                           |
| `⌘ + O`                        | Open the first link in the focused todo         |
| `⌘ + Delete` / `⌘ + Backspace` | Delete the focused todo (asks for confirmation) |

### Mouse, if you must

- **Double-click a link** inside a todo to open it in your browser.

---

## Color mappings, in practice

Open Settings (`⌘,`) and you'll find a table of **prefix → colour** pairs. Each row maps a leading string to a hex colour.

For example, with a mapping of prefix `ACME` → `#468C77`:

```
ACME-123 Ship the release      ← rendered in green
ACME-124 Write the changelog   ← rendered in green
Buy milk                       ← default colour
```

Anything you type that starts with `ACME` picks up the colour. Use it however suits you — project codes, clients, contexts, energy levels. Add, edit, and delete mappings freely; changes apply to the list immediately.

---

## Running it

```bash
yarn install
yarn dev      # run in development
yarn package  # build an unpacked app
yarn make     # produce a distributable (.zip, macOS only)
```

Built with Electron, React, and TypeScript. Distributables are produced for macOS.

---

## A note on scope

This is a personal tool. Features exist because I wanted them, and absent features are absent because I didn't. It's shared in case it's useful or interesting — but it's not trying to be a general-purpose product, and that's rather the point.
