---
title: "Fourteen months micromanaging AI coding agents"
description: "For the first time in my career, the team I was working with was able to provide a reliable implementation of a feature at the same time the concept was being discussed. Not just one feature, but a collection of them that interacted with each other as a cohesive product. After six hours working with a team that had met for the first time, we had a working alerts map for Wellington City. That only works if the process can absorb changing your mind mid-build without losing the thread."
section: "notes"
publishedAt: 2026-08-26
---

For the first time in my career, the team I was working with was able to provide a reliable implementation of a feature at the same time the concept was being discussed. Not just one feature, but a collection of them that interacted with each other as a cohesive product. After six hours working with a team that had met for the first time, we had a working alerts map for Wellington City, [full demo available here](https://claudecommunity-nz.github.io/impact.lab.wlg.team-1.2026-08-08/). That only works if the process can absorb changing your mind mid-build without losing the thread.

That process is MMDD — Micromanaged Driven Development. I built it in June 2025, while working on Code Ripple, my entry for the AWS Lambda Hackathon, to deal with the specific problems vibe coding introduces: the same prompt can produce different code twice, a session can spiral into hallucinations or error loops, and once that happens it's hard to know why the code ended up the way it did or how to get back to something that worked. Fourteen months, five versions, and — by my count — over ten projects later, it's still how I work.

Why keep a bespoke process when the industry has been converging on workflows like Spec Driven Development? Mainly because MMDD is tool-agnostic — I'm micromanaging the agent, not the tool, so I move between Claude Code, Kiro, and Codex without any friction. A unit is just a plain file, not something baked into one tool's format. It's also simple enough to hold in your head, and fourteen months in, it's proved to work better than I expected.

## The rule, briefly

Before any code gets written, you and the agent agree on a plan: a high-level description of the project and a list of units to be implemented. Each **unit** is the smallest possible next change. That unit is a file, and it's also the prompt: you hand it to the agent as the instruction for what to build. Once it's done, it becomes a commit, so every piece of code traces back to the file that told the agent to write it. A main file tracks every unit's status — planned, in progress, done — so the project state is legible at a glance. The full ruleset and templates are available on their [website](https://mmdd.dev) if you want to check out the original source.

## What the range actually proves

Five versions in, the interesting finding isn't any single project — it's that the same discipline held across projects with nothing in common. A few examples, out of more than ten — [the rest are on the projects page](https://allende.nz/projects):

**Code Ripple**, built for the AWS Lambda Hackathon in July 2025, is where the first version of MMDD actually got used — the rules were still being written as the project went. Every architectural decision and service integration got documented and AI-orchestrated through the same unit-by-unit discipline, under hackathon time pressure, on a methodology that didn't have a name yet when the project started. [Demo video available in YouTube](https://www.youtube.com/watch?v=v90v7DCC_yk).

**Chur List**, an Alexa skill built for AWS's Weekend Productivity Challenge, lets you talk to a markdown to-do list instead of reading it — asking "what's still pending?" and getting a real answer back. It runs on Lambda, S3, and Bedrock, using an LLM for reading comprehension instead of regex, so it works with any markdown checklist regardless of structure. Every unit here had to survive being described out loud, voice-first, with no screen to check the result against. [AWS Builder Article](https://builder.aws.com/content/3AklPxfA1oTyy68VrNYB5bRZiyh/weekend-productivity-challenge-chur-list).

**PrettySure**, a financial projection tool, answers the question most finance apps dodge: what does my future actually look like? You give it a rough snapshot — net worth, a few assets, a debt, monthly flows — then ask a real question in plain English, like "can I afford to take six months off?" It reasons through it and comes back with a High/Mid/Low range and a plain-English narrative, not a spreadsheet. The units here weren't about UI at all; they were about getting the reasoning honest rather than reassuring. [Demo Video available in YouTube](https://youtu.be/pQXz0jsf8BA).

**Piano Teacher**, built for AWS's Weekend Agent Challenge, turns scanned sheet music into a lesson-by-lesson practice plan — hands separately, phrase by phrase, tempo ramps, tricky bars flagged. The part worth noting isn't the music theory, it's the trigger: no chat prompt, no button, just moving a card to "Doing" on a kanban board. The board file change itself wakes the agent — the status file MMDD already uses to track units became the control plane for starting one. [Demo Video available in YouTube](https://youtu.be/NzhR_zOGBnE).

**LucidThread** reached semifinalist in AWS's 10,000 AIdeas Challenge. It's a personal AI system built entirely with AI-generated code — Kiro, Kiro-CLI, and Claude Code wrote every line; my job was never to write code, it was to sequence decisions and verify outcomes. It layers Spec-Driven Development for the architecture on top of MMDD for the build itself: 20 units, 40+ subunits, every one documented, every decision traceable from spec to unit to commit. [AWS Builder Article](https://builder.aws.com/content/3AkCEuFLQPqr26sFGakBhmzc6JL/aideas-lucid-thread).

**The WCC hackathon** is the speed test: six hours, concept to demo, and at one point we were writing code before the concept was fully agreed. MMDD's job there wasn't rigor for its own sake — it was making sure "we changed our mind" never meant "start over." [Demo Video available in YouTube](https://youtu.be/bKIfeBEj7oo).

**Swapping frameworks in an afternoon** is the example I keep coming back to. I had a project in React and wanted the same thing in Flutter. New session, same twenty units reused from the original project, working implementation. Linus Torvalds and Martin Fowler have both described AI as a new abstraction layer over code — the same shift compilers made over machine language — and this is what that looks like in practice. Without the units already written down, you'd have to do the traditional inception of a legacy tool: learn the business rules, infer the decisions, maybe end up with something similar. With them, it's almost trivial.

## Five versions, not much changed

Going from v1 to v5, the core is nearly the same shape it started as. That surprised me — it works well enough that I haven't needed to touch it much, and most of the iteration went into tools _around_ MMDD (a kanban view, a VS Code extension in progress) rather than MMDD itself.

The clearest example of what did change is v2 to v5. [Version 2](https://github.com/robertoallende/micromanaged-driven-development/blob/ecc30a2d5e0bb3856d18f377c568254c8fc23fad/dev_log/00_mmdd.md) had two nearly-identical templates — one for units, one for subunits — each padded with bracketed placeholder text explaining every field. [Version 5](https://github.com/robertoallende/micromanaged-driven-development/blob/main/dev_log/00_mmdd.md) merges them into one template and drops most of the field-by-field hand-holding — but adds something v2 didn't have at all: an explicit 5-step cycle with hard rules stated up front, like "never implement without an approved plan" and "never batch large changes." The file didn't get shorter (v2 is 382 words, v5 is 465) — what I cut in redundant templates, I spent on making the workflow rules unambiguous instead of implied. The optimization was never about size. It was about redundancy: cutting what repeated, spending the saved space on what could still be misread.

## The thing that didn't stick

I tried an extension called Modernizer, aimed at legacy code analysis the same way MMDD is aimed at greenfield work. It didn't stick, and I think I know why now: greenfield projects share a shape at a high level, regardless of stack — some foundation, a roadmap, the roadmap split into baby steps. Legacy modernization doesn't share that shape across projects. A big-bang rewrite and an incremental, cherry-picked migration have almost nothing in common with each other.

I also migrated a stochastic research paper's code from C to Python. We got far, and the researcher called the outcome promising but not conclusive — I did it without domain knowledge, working alone, and that gap is still the real bottleneck with AI-assisted work, MMDD or not. The human in the loop is the one with judgment; the tool doesn't supply that.

## What's next

I keep sharing MMDD as widely as I can, hoping someone tells me it's obsolete because some option X is much better. I'm not interested in the statement itself — I'm interested in the why, and in what I can learn from a different way of doing things.

If you want to try it, go to [mmdd.dev](https://mmdd.dev/) and watch the twelve-minute video I released last weekend — building a photo gallery app from scratch, mosaic view and map view included, start to finish.