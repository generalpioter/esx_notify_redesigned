# esx_notify_redesigned

Redesigned notification script for **ESX Framework**.
Original script by [ESX-Framework](https://github.com/esx-framework) — redesign & rework by **GENERALPIOTER**.

## About

`esx_notify_redesigned` replaces the default ESX notification UI with a modernized, restyled version while keeping full compatibility with the original ESX notify exports/events, so existing resources that trigger ESX notifications continue to work without changes.

## Features

- Modern, redesigned notification UI (visual overhaul of the original ESX notify)
- Drop-in replacement — no changes required in other resources calling ESX notifications
- Lightweight, no extra dependencies beyond ESX itself

## Dependencies

- [es_extended](https://github.com/esx-framework/esx_core) (ESX Framework)

## Installation

1. Download / clone this resource into your server's `resources` folder.
2. Add the following line to your `server.cfg`:
   ```
   ensure esx_notify_redesigned
   ```
3. Make sure it starts **after** `es_extended`.
4. Restart your server (or start the resource) and remove/disable the old `esx_notify` if it conflicts.

## Usage

Trigger notifications the same way you would with the original ESX notify system, e.g.:

```lua
ESX.ShowNotification('Hello world!')
```

or via event:

```lua
TriggerEvent('esx:showNotification', 'Hello world!')
```

## Credits

- **Original script:** ESX-Framework
- **Redesign / rework:** GENERALPIOTER

## License

See original ESX Framework license terms.
