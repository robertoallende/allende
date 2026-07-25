---
title: "Shipped Fancy Kanban Plugin for Obsidian  "
description: "Humans need clear visuals and AI needs a clear format. I couldn't find an Obsidian plugin that provided both and was actively maintained, so I built my own."
section: "notes"
publishedAt: 2026-07-22
---

Humans need clear visuals and AI needs a clear format. I couldn't find an Obsidian plugin that provided both and was actively maintained, so I built my own.  
  
## A workflow, not just a tool  
There's a pattern forming: keep your knowledge in markdown, then ask an AI to read it and update it. My own stack is Claude and Google Drive, but the same pattern works with any vendor.  

For that to work, the data has to be equally clear to a person and to an AI. Markdown already does that for plain and formatted text — readable as-is, and it's what most models have seen the most of. Obsidian is one of the most popular ways to actually visualize that markdown.  
The next level is tasks. Not just brainstorming or laying out resources — the moment you start delegating real work to an agent, you need a way to visualize and record that work that's just as clear to you as it is to whatever's doing the work.  

That's the gap a kanban board sits in.  
  
## The format is the whole thing  
Fancy Kanban stores every board as a plain markdown table, inside a fenced code block. No database, no proprietary format, no data you can only see through the plugin.  
  
Open it without the plugin installed and it's still a readable table. Point an AI at your vault and it just sees rows and columns, formatted the same way it's seen a million tables in training. Nothing to translate.  
  
That's the whole bet: if the format is legible to both, trust follows for the human and usefulness follows for the machine. Everything else — the drag-and-drop, the card editor, the board setup panel — is the part people see first, but the table underneath is the part that makes any of it worth building on.  
  
## What happened next  
I shipped it, and for the first week I did nothing else. No launch post, no forum thread, no promotion of any kind — I wanted to know if the plugin could find people on its own before I pushed it in front of anyone.  
A week later: roughly 100 installs. No comms, no ads, nobody told to go get it.  
I'm already building on top of it myself — more on that soon.  
  
## Try it  
If you're on Obsidian, search [Fancy Kanban in Community Plugins](https://community.obsidian.md/plugins/fancy-kanban). It's free.  
Curious how others are doing this — and if this approach resonates with you.