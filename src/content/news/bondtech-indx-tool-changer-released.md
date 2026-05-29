---
title: "Bondtech INDX Tool-Changer Is Now Shipping"
category: "HARDWARE"
date: 2026-05-26
readTime: "3 min read"
excerpt: "Bondtech's INDX automatic tool-changing system has begun shipping after delays from Q1 2026, bringing wireless induction heating and up to 8 nozzles to prosumer printers."
summary:
  - "INDX uses wireless induction heating — no physical connectors between toolhead and carriage"
  - "Supports up to 8 individual nozzle assemblies per machine"
  - "Printhead priced at $250–300, nozzle assemblies at $35 each"
  - "Compatible with Prusa CORE One confirmed, Voron compatibility being explored by community"
  - "Near-zero waste multi-material printing is the primary design goal"
---

<p class="art-lead">Bondtech's INDX automatic tool-changing system has entered active shipping after being pushed back from its original Q1 2026 target, bringing a wireless induction heating architecture and support for up to 8 nozzle assemblies to prosumer FDM machines.</p>

## What INDX Is

INDX is Bondtech's entry into the automatic tool-changer category for desktop and prosumer FDM printers. Rather than switching spools or merging filaments, INDX physically swaps entire nozzle assemblies mid-print, giving each material its own dedicated hotend. The result is true multi-material printing without the purge towers, wipe towers, or filament waste associated with single-nozzle multi-material systems.

The system consists of two main components: a carriage-mounted printhead unit and individual nozzle assemblies that dock and undock automatically during a print job. Users configure which nozzle to use for each object or layer in their slicer, and INDX handles the mechanical swap without pausing beyond the time required to complete the exchange.

## Wireless Induction Heating

The defining technical feature of INDX is that there are no physical electrical connectors between the carriage and the nozzle assembly. Heating is delivered via wireless induction — a coil in the carriage transfers power to a receiver coil in the nozzle assembly when docked. Thermistor readings are passed back through the same inductive coupling.

This approach eliminates a class of reliability problems common in tool-changing printers: connector wear, contact oxidation, and alignment sensitivity. Bondtech says the connection is rated for hundreds of thousands of dock and undock cycles. The tradeoff is that induction heating is slightly less efficient than direct resistance heating, though Bondtech has not published comparative heat-up time data.

## Capacity and Configuration

A single INDX-equipped machine can host up to 8 nozzle assemblies, stored in a dock that typically mounts to the side or rear of the printer frame. Each assembly contains its own heater block, heat break, thermistor, and nozzle. Users can mix nozzle diameters and materials across assemblies — running a 0.4mm brass nozzle for PLA alongside a 0.6mm hardened steel nozzle for abrasive CF filaments on the same machine.

Assemblies are user-swappable. Bondtech designed them to be cleaned, re-tipped, or replaced individually without affecting the rest of the system.

## Pricing

The INDX printhead unit, which mounts to the carriage and contains the induction coupling and docking mechanism, is priced between $250 and $300 depending on configuration. Individual nozzle assemblies are $35 each. A base configuration with two assemblies and the printhead runs approximately $320–370.

By comparison, other multi-material add-ons for existing printers typically range from $250 for filament-multiplexer systems to $600 and above for full automatic tool-changer kits from other vendors.

## Compatibility

Bondtech has confirmed compatibility with the Prusa CORE One as a supported platform. The INDX printhead is designed around a standardised carriage interface, and the company has published mounting dimensions publicly to encourage third-party compatibility work.

Community members have been exploring INDX compatibility with Voron 2.4 and Trident toolhead systems. As of shipping date, no official Voron mount has been released, but several toolhead adapter designs have appeared on Printables and the Voron Users Discord. Bondtech has not confirmed or denied plans for an official Voron compatibility kit.

## Shipping Status

INDX began fulfilling pre-orders in the final week of May 2026 after a slip from the original Q1 2026 ship date. Bondtech attributed the delay to supply chain issues affecting the induction coil components. New orders placed now are quoted at a 3–4 week lead time. The system ships with the printhead unit, two nozzle assemblies, and a dock frame, with additional assemblies available as standalone add-ons.
